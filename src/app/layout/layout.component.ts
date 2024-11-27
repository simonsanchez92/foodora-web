import { Component, computed, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../features/footer/footer.component';
import { NavbarComponent } from '../features/navbar/navbar.component';
import { LoadingService } from '../shared/loading.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  readonly loadingService = inject(LoadingService);

  isLoading = computed(() => this.loadingService.isLoading());
}
