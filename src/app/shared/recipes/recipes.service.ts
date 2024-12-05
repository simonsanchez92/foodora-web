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

  private veganDishesSubject = new BehaviorSubject<number>(
    this.stateSubject.value.filter((d) => d.vegan).length
  );
  veganDishes$ = this.veganDishesSubject.asObservable();

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
        console.log(res);
        newRecipe = res;

        //Store recipe in db
        const updatedState = [...this.stateSubject.value, newRecipe];
        this.updateState(updatedState);

        console.log(this.veganDishesSubject.value);
      },
    });

    // if (prevDishes) {
    //   const dishes: Recipe[] = JSON.parse(prevDishes);

    //   console.log(dishes);
    // } else {
    //   console.log('No dishes found');
    // }
    //Check if 2 vegan / non-vegan
    //Show error if any

    console.log(this.stateSubject.value);
  }

  updateState(newState: RecipeDetail[]) {
    this.stateSubject.next(newState);
    localStorage.setItem('dishes', JSON.stringify(newState));

    this.veganDishesSubject.next(newState.filter((dish) => dish.vegan).length);
  }

  clearState() {
    this.updateState([]);
  }
}
