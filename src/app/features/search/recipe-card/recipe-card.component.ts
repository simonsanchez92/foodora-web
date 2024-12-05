import { Component, inject, input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Recipe } from '../../../shared/recipes/recipe.model';
import { RecipesService } from '../../../shared/recipes/recipes.service';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.scss',
})
export class RecipeCardComponent {
  private recipesService = inject(RecipesService);
  private router = inject(Router);
  recipe = input.required<Recipe>();

  // getDetails(id: number) {
  //   this.recipesService.getOne(id).subscribe({
  //     next: (recipe) => {
  //       console.log(recipe);
  //     },
  //   });
  // }

  goToDetails(id: number) {
    this.router.navigate([`/recipe/${id}`]);
  }

  onAdd() {
    this.recipesService.addItem(this.recipe());
  }
}
