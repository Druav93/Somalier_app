export type Category = 'wine' | 'whiskey' | 'cocktail';
export type Occasion = 'date_night' | 'bbq' | 'gift' | 'dinner_party' | 'casual' | 'celebration';
export type BudgetTier = 'budget' | 'mid' | 'premium';

export interface TasteProfile {
  id: string;
  user_id: string;
  sweetness: number;       // 1-5
  acidity: number;         // 1-5
  tannins: number;         // 1-5
  body: number;            // 1-5
  smokiness: number;       // 1-5
  preferred_categories: Category[];
  created_at: string;
}

export interface PairingOption {
  name: string;
  producer?: string;
  region?: string;
  vintage?: number;
  price_range: string;
  tier: BudgetTier;
  rationale: string;
  serving_temp?: string;
  food_notes: string[];
}

export interface Pairing {
  id: string;
  user_id: string;
  image_url: string;
  dish_description: string;
  occasion?: Occasion;
  category: Category;
  pairings: PairingOption[];
  created_at: string;
  is_favorite: boolean;
  user_rating?: number;
  user_notes?: string;
}

export interface BarItem {
  id: string;
  user_id: string;
  name: string;
  producer?: string;
  category: Category;
  image_url?: string;
  created_at: string;
}

export interface OnboardingProfile {
  sweetness: number;
  body: number;
  acidity: number;
  smokiness: number;
  categories: Category[];
}
