import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './pages/menu/menu.component';
import { SearchComponent } from './pages/search/search.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'login', component: HomeComponent },
      { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
      { path: 'menu', component: MenuComponent, canActivate: [AuthGuard] },
      { path: '**', redirectTo: 'login' },
    ],
  },
];
