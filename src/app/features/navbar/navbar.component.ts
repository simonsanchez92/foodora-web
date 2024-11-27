import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../shared/auth.service';
import { LoadingService } from '../../shared/loading.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatMenuModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly loadingService = inject(LoadingService);

  isLoggedIn = computed(() => this.authService.isLoggedIn());

  logout() {
    this.loadingService.startLoading();

    setTimeout(() => {
      this.loadingService.stopLoading();
      this.authService.logout();
    }, 800);
  }
}
