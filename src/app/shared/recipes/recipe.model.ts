export interface Recipe {
  id: number;
  image: string;
  imageType: string;
  title: string;
}

export interface SearchResponse {
  number: number;
  offset: number;
  results: Recipe[];
  totalResults: number;
}
