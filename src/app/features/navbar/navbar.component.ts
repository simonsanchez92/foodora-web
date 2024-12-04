import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { LoadingService } from '../../shared/loading.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly loadingService = inject(LoadingService);
  private readonly router = inject(Router);

  isLoggedIn: boolean = false;

  menuItems = [
    { label: 'Menu', icon: 'menu_book', action: () => this.navigate('menu') },
    { label: 'Search', icon: 'search', action: () => this.navigate('search') },
    { label: 'Logout', icon: 'logout', action: () => this.logout() },
  ];

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }
  navigate(route: string) {
    this.router.navigate([route]);
  }

  logout() {
    this.loadingService.startLoading();

    setTimeout(() => {
      this.loadingService.stopLoading();
      this.authService.logout();
    }, 800);
  }
}
