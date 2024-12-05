import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RecipeDetail } from '../../shared/recipes/recipe-detail.model';
import { RecipesService } from '../../shared/recipes/recipes.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  private recipeService = inject(RecipesService);

  recipes: RecipeDetail[] = [];

  ngOnInit(): void {
    this.recipeService.state$.subscribe({
      next: (res) => {
        this.recipes = res;
      },
    });
  }
}
