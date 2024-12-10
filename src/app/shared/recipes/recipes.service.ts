import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { RecipeDetail } from './recipe-detail.model';
import { Recipe, SearchResponse } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private httpClient = inject(HttpClient);

  //Local storage state for user dishes
  private initialState: RecipeDetail[] = JSON.parse(
    localStorage.getItem('dishes') ?? '[]'
  );
  // BehaviorSubject to hold the state and allow subscriptions
  private stateSubject = new BehaviorSubject<RecipeDetail[]>(this.initialState);
  //Observable to expose the state
  state$ = this.stateSubject.asObservable();

  private dishCountSubject = new BehaviorSubject<{
    vegan: number;
    nonVegan: number;
  }>(this.calculateDishCount(this.initialState));

  dishCount$ = this.dishCountSubject.asObservable();

  getMany(term: string) {
    return this.httpClient
      .get<SearchResponse>(
        `https://api.spoonacular.com/recipes/complexSearch?query=${term}&apiKey=9633d50c4561455784d5013b3c7d3502`
      )
      .pipe(
        map((res) => {
          localStorage.setItem('searchResults', JSON.stringify(res.results));
          return res.results;
        }),

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
            spoonacularScore,
            summary,
            vegan,
            vegetarian,
            pricePerServing,
            readyInMinutes,
            healthScore,
          }) => {
            return {
              id,
              title,
              image,
              instructions,
              spoonacularScore,
              summary,
              vegan,
              vegetarian,
              pricePerServing,
              readyInMinutes,
              healthScore,
            } as RecipeDetail; // Transform response to only include desired properties
          }
        )
      );
  }

  getUserDishes(): RecipeDetail[] {
    return this.stateSubject.value;
  }

  addItem(recipe: Recipe) {
    //check if recipe already exists in db
    const alreadyExists = this.stateSubject.value.find(
      (r) => r.id === recipe.id
    );

    if (alreadyExists) {
      alert("You've already added this dish");
      return;
    }

    let newRecipe: RecipeDetail;

    this.getOne(recipe.id).subscribe({
      next: (res) => {
        newRecipe = res;

        const { vegan, nonVegan } = this.dishCountSubject.value;

        if (newRecipe.vegan && vegan >= 2) {
          alert('You cannot add more than 2 vegan dishes');
          return;
        } else if (!newRecipe.vegan && nonVegan >= 2) {
          alert('You cannot add more than 2 non-vegan dishes');
          return;
        }

        //Store recipe in db
        const updatedState = [...this.stateSubject.value, newRecipe];
        this.updateState(updatedState);
      },
    });
  }

  updateState(newState: RecipeDetail[]) {
    this.stateSubject.next(newState);
    localStorage.setItem('dishes', JSON.stringify(newState));

    this.dishCountSubject.next(this.calculateDishCount(newState));
  }

  clearState() {
    this.updateState([]);
  }

  private calculateDishCount(dishes: RecipeDetail[]): {
    vegan: number;
    nonVegan: number;
  } {
    const vegan = dishes.filter((d) => d.vegan).length;
    const nonVegan = dishes.filter((d) => !d.vegan).length;
    return { vegan, nonVegan };
  }
}
