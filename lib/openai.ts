import * as FileSystem from 'expo-file-system';
import { Category, Occasion, PairingAIResult, PairingOption } from '@/types';
import { TOP_PAIRINGS } from '@/data/pairings';

const SYSTEM_PROMPT = `You are Pour — a warm, deeply knowledgeable AI sommelier and craft bartender. Your recommendations feel like advice from a brilliant friend who happens to know every wine list and cocktail menu intimately.

When you see a dish, ingredient, or existing bottle in the photo, identify it and suggest exactly three pairings at different price points. Keep every rationale to exactly 2 warm, conversational sentences that explain WHY the flavours work together — avoid jargon unless you briefly explain it. Sound genuinely excited about each pairing.

Respond with valid JSON matching this exact schema — nothing else:
{
  "dish_description": "Brief, evocative name of what you see (e.g. 'Seared duck breast with cherry reduction')",
  "pairings": [
    {
      "name": "Full wine/spirit/cocktail name",
      "producer": "Winery or distillery (omit if cocktail)",
      "region": "Region or country of origin",
      "vintage": 2020,
      "price_range": "$18–28",
      "tier": "budget",
      "rationale": "First sentence. Second sentence.",
      "serving_temp": "14–16°C",
      "food_notes": ["complementary flavour note", "textural bridge"]
    },
    { "tier": "mid", ... },
    { "tier": "premium", ... }
  ],
  "why_it_works": "One paragraph (3–4 sentences) on the deeper food-science behind these pairings — acidity, tannins, fat, umami, etc."
}`;

// Mock pairings used when no API key is configured (development fallback)
function buildMockResult(category: Category): PairingAIResult {
  const seed = TOP_PAIRINGS[Math.floor(Math.random() * TOP_PAIRINGS.length)];
  const base = category === 'wine' ? seed.wine : category === 'whiskey' ? seed.whiskey : seed.cocktail;

  const tiers: PairingOption[] = [
    {
      name: category === 'wine' ? 'Côtes du Rhône Villages' : category === 'whiskey' ? 'Monkey Shoulder' : 'House Aperol Spritz',
      producer: category === 'wine' ? 'E. Guigal' : category === 'whiskey' ? 'William Grant & Sons' : undefined,
      region: category === 'wine' ? 'Rhône Valley, France' : category === 'whiskey' ? 'Speyside, Scotland' : 'Italy',
      price_range: '$14–22',
      tier: 'budget',
      rationale: `An approachable and versatile choice that plays beautifully with the dish. The balance between fruit and structure makes this an everyday crowd-pleaser.`,
      serving_temp: category === 'wine' ? '16–18°C' : undefined,
      food_notes: ['fruity brightness', 'approachable tannins'],
    },
    {
      name: base.name,
      producer: 'region' in base ? (base as { region: string }).region : undefined,
      region: 'region' in base ? (base as { region: string }).region : undefined,
      price_range: '$38–58',
      tier: 'mid',
      rationale: base.why,
      serving_temp: category === 'wine' ? '15–17°C' : undefined,
      food_notes: ['classic pairing', 'complementary structure'],
    },
    {
      name: category === 'wine' ? 'Barolo Cannubi 2017' : category === 'whiskey' ? 'Glenfarclas 21yr' : 'Negroni Sbagliato',
      producer: category === 'wine' ? 'Bartolo Mascarello' : category === 'whiskey' ? 'Glenfarclas' : undefined,
      region: category === 'wine' ? 'Piedmont, Italy' : category === 'whiskey' ? 'Speyside, Scotland' : 'Milan, Italy',
      price_range: '$85–120',
      tier: 'premium',
      rationale: `A transcendent pairing that elevates the entire dining experience. The complexity of this bottle rewards every nuance in the dish.`,
      serving_temp: category === 'wine' ? '17–19°C' : undefined,
      food_notes: ['luxurious depth', 'lingering finish'],
    },
  ];

  return {
    dish_description: seed.dish,
    pairings: tiers,
    why_it_works: `The flavour bridge between this dish and your selected ${category} comes down to complementary acidity and textural contrast. The dish's fat content mellows tannins or spirit heat, while the drink's acidity lifts the palate between bites. Each price tier offers the same core pairing logic — just with increasing complexity and cellar age.`,
  };
}

export async function getPairing(
  imageUri: string,
  category: Category,
  occasion: Occasion | null,
): Promise<PairingAIResult> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    // Realistic dev fallback — no API key needed
    await new Promise((r) => setTimeout(r, 1800)); // simulate latency
    return buildMockResult(category);
  }

  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const occasionText = occasion
    ? `Occasion: ${occasion.replace(/_/g, ' ')}. `
    : '';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      max_tokens: 1200,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64}`,
                detail: 'high',
              },
            },
            {
              type: 'text',
              text: `${occasionText}Suggest ${category} pairings at budget, mid, and premium tiers.`,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI error ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  const raw = JSON.parse(data.choices[0].message.content) as PairingAIResult;
  return raw;
}
