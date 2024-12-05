import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { RecipeComponent } from './pages/recipe/recipe.component';
import { SearchComponent } from './pages/search/search.component';

export const routes: Routes = [
  // {
  // path: '',
  // component: LayoutComponent,
  // children: [
  //   { path: 'login', component: HomeComponent },
  //   { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  //   { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  //   { path: '**', redirectTo: 'login' },
  // ],

  { path: 'login', component: HomeComponent },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'recipe/:id', component: RecipeComponent, canActivate: [AuthGuard] },
  { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' },

  // },
];
