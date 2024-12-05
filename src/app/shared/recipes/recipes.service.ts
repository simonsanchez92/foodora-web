import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RecipeDetail } from './recipe-detail.model';
import { Recipe, SearchResponse } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private httpClient = inject(HttpClient);

  getMany(term: string) {
    return this.httpClient
      .get<SearchResponse>(
        `https://api.spoonacular.com/recipes/complexSearch?query=${term}&apiKey=9633d50c4561455784d5013b3c7d3502`
      )
      .pipe(
        map((res) => res.results),
        catchError((error) => {
          console.log(error);
          return throwError(() => new Error());
        })
      );
  }

  getOne(id: number): Observable<RecipeDetail> {
    return this.httpClient
      .get<RecipeDetail>(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=9633d50c4561455784d5013b3c7d3502`
      )
      .pipe(
        map(
          ({
            id,
            title,
            image,
            instructions,
            pricePerServing,
            readyInMinutes,
            healthScore,
          }) => {
            return {
              id,
              title,
              image,
              instructions,
              pricePerServing,
              readyInMinutes,
              healthScore,
            } as RecipeDetail; // Transform response to only include desired properties
          }
        )
      );
  }

  addRecipe(recipe: Recipe) {}
}
