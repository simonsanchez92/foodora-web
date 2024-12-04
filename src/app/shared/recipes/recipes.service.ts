import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { SearchResponse } from './recipe.model';

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
}
