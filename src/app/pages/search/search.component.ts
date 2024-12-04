import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
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
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnInit {
  private readonly recipesService = inject(RecipesService);
  private destroyRef = inject(DestroyRef);

  recipes = signal<Recipe[] | undefined>(undefined);

  form = new FormGroup({
    term: new FormControl<string>('', {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    console.log('hey ma');

    const subscription = this.recipesService.getMany('pizza').subscribe({
      next: (recipes) => {
        this.recipes.set(recipes);
      },
      error: (error: Error) => {
        console.log(error);
      },
      complete: () => {
        console.log('Completed');
        console.log(this.recipes());
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  goDetails() {
    console.log('Navigate to recipe details');
  }

  onAdd() {
    console.log('item added');
  }
}
