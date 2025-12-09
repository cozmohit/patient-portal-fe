import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../core/services/login.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private loginService = inject(LoginService);

  logout(): void {
    this.loginService.logout();
  }
}
