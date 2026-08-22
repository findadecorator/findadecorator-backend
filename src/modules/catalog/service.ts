export const products = [
  { id: "prod_001", name: "Dulux Easycare Matt", brand: "Dulux", category: "paint", finish: "matt", sku: "DUL-ECM-1", coverage: "13m²/L", priceGbp: 18.5, recommendedFor: ["living room", "bedroom"], affiliateUrl: "https://www.diy.com/" },
  { id: "prod_002", name: "Johnstone's Satin", brand: "Johnstone's", category: "paint", finish: "satin", sku: "JON-SAT-4", coverage: "12m²/L", priceGbp: 22.0, recommendedFor: ["kitchen", "bathroom"], affiliateUrl: "https://www.screwfix.com/" },
  { id: "prod_003", name: "Zinsser Peel Stop", brand: "Zinsser", category: "primer", finish: "primer", sku: "ZIN-PS-9", coverage: "10m²/L", priceGbp: 16.0, recommendedFor: ["patching", "stained walls"], affiliateUrl: "https://www.b&q.com/" },
  { id: "prod_004", name: "Toupret Interior Filler", brand: "Toupret", category: "filler", finish: "filler", sku: "TOU-FIL-6", coverage: "4m²/kg", priceGbp: 12.5, recommendedFor: ["repair"], affiliateUrl: "https://www.screwfix.com/" },
  { id: "prod_005", name: "Astonish Wallpaper Roll", brand: "Astonish", category: "wallpaper", finish: "standard", sku: "AST-WAL-15", coverage: "5m²/roll", priceGbp: 24.0, recommendedFor: ["feature wall"], affiliateUrl: "https://www.diy.com/" }
];

export function listProducts(category?: string) {
  return category ? products.filter((item) => item.category === category) : products;
}

export function getFeaturedBrands() {
  return [
    { brand: "Dulux", verified: true, sponsored: true },
    { brand: "Johnstone's", verified: true, sponsored: true },
    { brand: "Farrow & Ball", verified: true, sponsored: false }
  ];
}

export function getRecommendations(jobType: string) {
  const map: Record<string, string[]> = {
    bedroom: ["prod_001", "prod_003"],
    kitchen: ["prod_002", "prod_004"],
    feature_wall: ["prod_005", "prod_001"],
    bathroom: ["prod_002", "prod_003"]
  };
  const ids = map[jobType.toLowerCase()] ?? ["prod_001", "prod_003"];
  return products.filter((product) => ids.includes(product.id));
}
