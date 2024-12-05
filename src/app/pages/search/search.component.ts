import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BannerComponent } from '../../features/banner/banner.component';
import { Recipe } from '../../shared/recipes/recipe.model';
import { RecipesService } from '../../shared/recipes/recipes.service';
import { LoadingService } from '../../shared/services/loading.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    BannerComponent,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  private recipesService = inject(RecipesService);
  loadingService = inject(LoadingService);
  private destroyRef = inject(DestroyRef);

  recipes = signal<Recipe[] | undefined>(undefined);
  errorMessage = signal<string | null>(null);
  searchTerm = signal<string>('');

  hasResults = computed<boolean>(() => {
    const recipeList = this.recipes();
    return !!recipeList && recipeList.length > 0;
  });

  noResults = computed<boolean>(() => {
    const recipeList = this.recipes();
    return !!recipeList && recipeList.length === 0;
  });

  form = new FormGroup({
    term: new FormControl<string>('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
  });

  ngOnInit(): void {}

  onSubmit(form: FormGroup) {
    if (!form.valid) {
      this.errorMessage.set('Please enter at least 2 characters');
      return;
    }

    this.loadingService.startLoading();

    this.errorMessage.set(null);
    //this.loading.set(true)
    this.searchTerm.set(form.controls['term'].value ?? '');

    this.recipesService
      .getMany(this.searchTerm())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (recipes) => {
          console.log(recipes);

          this.recipes.set(recipes);
        },
        error: (error: Error) => {
          console.log(error);
          this.errorMessage.set(
            'An error has occurred fetching recipes, please try again'
          );
        },
        complete: () => {
          this.loadingService.stopLoading();
          form.reset();
        },
      });
  }

  getDetails(id: number) {
    this.recipesService.getOne(id).subscribe({
      next: (recipe) => {
        console.log(recipe);
      },
    });
  }

  onAdd() {
    console.log('item added');
  }
}
