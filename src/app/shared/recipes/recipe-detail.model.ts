export interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  instructions: string;
  spoonacularScore: number;
  summary: string;
  vegan: boolean;
  vegetarian: boolean;
  pricePerServing: number;
  readyInMinutes: number;
  healthScore: number;
}
