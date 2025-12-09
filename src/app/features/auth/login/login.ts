import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../core/services/login.service';
import { useAuth } from '../../../../auth.config';

@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginService = inject(LoginService);
  readonly authConfig = useAuth();

  async loginWithMicrosoft() {
    this.loginService.loginWithMicrosoft();
  }
}
