// Bottle images sourced from Unsplash (unsplash.com/license — free for commercial use)
// Each URL is ?w=400&auto=format&fit=crop&q=85 for optimal mobile performance
export const BottleImages = {
  redWine:       'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&auto=format&fit=crop&q=85',
  redWineAlt:    'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=400&auto=format&fit=crop&q=85',
  whiteWine:     'https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400&auto=format&fit=crop&q=85',
  sparkling:     'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400&auto=format&fit=crop&q=85',
  port:          'https://images.unsplash.com/photo-1578911373434-0cb395d2cbfb?w=400&auto=format&fit=crop&q=85',
  whiskey:       'https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=400&auto=format&fit=crop&q=85',
  whiskeyBottle: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=400&auto=format&fit=crop&q=85',
  bourbon:       'https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=400&auto=format&fit=crop&q=85',
  cocktail:      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&auto=format&fit=crop&q=85',
  cocktailAlt:   'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&auto=format&fit=crop&q=85',
  wineGlass:     'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&auto=format&fit=crop&q=85',
} as const;

export const TOP_PAIRINGS = [
  {
    dish: 'Grilled Salmon',
    imageUrl: BottleImages.redWineAlt,
    wine: { name: 'Pinot Noir', region: 'Burgundy', why: 'Low tannins complement the fatty fish without overwhelming delicate flavors.' },
    whiskey: { name: 'Japanese Single Malt', region: 'Yamazaki', why: 'Subtle fruit notes mirror the richness of the fish.' },
    cocktail: { name: 'Yuzu Gimlet', why: 'Citrus brightness cuts through the richness and echoes Asian-inspired preparations.' },
  },
  {
    dish: 'Beef Ribeye',
    imageUrl: BottleImages.redWine,
    wine: { name: 'Cabernet Sauvignon', region: 'Napa Valley', why: 'Bold tannins cut through fat; dark fruit matches umami depth.' },
    whiskey: { name: 'Bourbon', region: 'Kentucky', why: 'Caramel sweetness and oak tannins create harmony with charred beef.' },
    cocktail: { name: 'Old Fashioned', why: 'Bitters and orange oils amplify the savory crust while sweetness rounds the finish.' },
  },
  {
    dish: 'Mushroom Risotto',
    imageUrl: BottleImages.redWine,
    wine: { name: 'Barolo', region: 'Piedmont', why: 'Earthy Nebbiolo mirrors wild mushroom umami; both need time to breathe.' },
    whiskey: { name: 'Speyside Scotch', region: 'Glenfarclas', why: 'Dried fruit and sherry notes complement earthy depth without competing.' },
    cocktail: { name: 'Mezcal Negroni', why: 'Smoky agave spirit echoes truffle and forest floor complexity.' },
  },
  {
    dish: 'Oysters',
    imageUrl: BottleImages.whiteWine,
    wine: { name: 'Muscadet', region: 'Loire Valley', why: 'Crisp acidity and saline minerality are a textbook match for briny oysters.' },
    whiskey: { name: 'Irish Pot Still', region: 'Green Spot', why: 'Creamy grain sweetness contrasts the salt and amplifies oceanic notes.' },
    cocktail: { name: 'Dirty Martini', why: 'Olive brine doubles down on salinity; cold temperature heightens the experience.' },
  },
  {
    dish: 'Spicy Thai Curry',
    imageUrl: BottleImages.whiteWine,
    wine: { name: 'Riesling Spätlese', region: 'Mosel', why: 'Residual sweetness douses heat; acidity cuts coconut richness.' },
    whiskey: { name: 'Honey Whiskey', region: 'Drambuie', why: 'Natural sweetness tames chili heat and echoes lemongrass notes.' },
    cocktail: { name: 'Mango Sour', why: 'Tropical fruit meets heat halfway; egg white smooths the palate between bites.' },
  },
  {
    dish: 'Dark Chocolate Lava Cake',
    imageUrl: BottleImages.port,
    wine: { name: 'Tawny Port', region: 'Douro, Portugal', why: 'Nutty oxidation and dried fruit play against deep cocoa beautifully.' },
    whiskey: { name: 'Islay Single Malt', region: 'Ardbeg', why: 'Bold smoke and maritime char contrasts sweetness for a complex finish.' },
    cocktail: { name: 'Espresso Martini', why: 'Coffee bitterness amplifies chocolate intensity; vodka keeps it clean.' },
  },
  {
    dish: 'Truffle Pasta',
    imageUrl: BottleImages.whiteWine,
    wine: { name: 'White Burgundy', region: 'Puligny-Montrachet', why: 'Creamy texture and mineral drive match luxurious truffle depth.' },
    whiskey: { name: 'Cognac XO', region: 'Hennessy', why: 'Aged grape spirit and oak complexity find common ground with earthy truffle.' },
    cocktail: { name: 'Black Manhattan', why: "Averna amaro brings herbal earthiness that mirrors truffle's forest character." },
  },
  {
    dish: 'BBQ Ribs',
    imageUrl: BottleImages.bourbon,
    wine: { name: 'Zinfandel', region: 'Sonoma', why: 'Jammy fruit and spice match smoky char; medium tannins handle fat.' },
    whiskey: { name: 'Tennessee Whiskey', region: "Jack Daniel's", why: 'Maple-charcoal filtration echoes the smokehouse; sweetness complements BBQ sauce.' },
    cocktail: { name: 'Whiskey Sour', why: 'Lemon cuts through smoke and fat; whiskey base harmonizes with the meat.' },
  },
  {
    dish: 'Cheese Board (Aged Cheddar)',
    imageUrl: BottleImages.port,
    wine: { name: 'Vintage Port', region: 'Quinta do Crasto', why: 'Classic pairing — sweetness of Port amplifies the crystalline savory crunch.' },
    whiskey: { name: 'Speyside 18yr', region: 'Glenfiddich', why: 'Aged complexity and subtle sherry notes mirror long-aged cheddar crystals.' },
    cocktail: { name: 'Boulevardier', why: 'Bitter Campari and sweet vermouth create contrast and cleanse the palate.' },
  },
  {
    dish: 'Sushi & Sashimi',
    imageUrl: BottleImages.sparkling,
    wine: { name: 'Champagne Blanc de Blancs', region: 'Pol Roger', why: 'Toasty autolysis and crisp acidity match delicate fish; bubbles cleanse palate.' },
    whiskey: { name: 'Nikka Coffey Grain', region: 'Japan', why: "Light, vanilla-forward with a clean finish that doesn't overpower raw fish." },
    cocktail: { name: 'Sake Martini', why: 'Umami from sake amplifies fish; cold temperature maintains texture integrity.' },
  },
];

export const WEEKLY_PICK = {
  name: 'Barolo 2018',
  producer: 'Giacomo Conterno',
  region: 'Piedmont, Italy',
  category: 'wine' as const,
  imageUrl: BottleImages.redWine,
  rationale: 'This structured Nebbiolo is at a magical drinking window — tannins have softened while its rose petal and tar complexity remains vivid.',
  food_match: 'Braised short ribs, aged pecorino, or a simple plate of pasta e fagioli',
  price: '$85–110',
};
