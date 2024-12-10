import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RecipeDetail } from '../../../shared/recipes/recipe-detail.model';

@Component({
  selector: 'app-dish-card',
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatListModule],
  templateUrl: './dish-card.component.html',
  styleUrl: './dish-card.component.scss',
})
export class DishCardComponent {
  longText: string = 'hey dyde';

  dish = input.required<RecipeDetail>();
}
