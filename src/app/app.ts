import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalModule } from '@azure/msal-angular';
import { LoginService } from './core/services/login.service';
import { useAuth } from '../auth.config';
import { AuthenticationResult } from '@azure/msal-browser';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MsalModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private loginService = inject(LoginService);
  private toastr = inject(ToastrService);
  private readonly authConfig = useAuth();

  async ngOnInit() {
    try {
      // Initialize MSAL
      await this.authConfig.msalInstance.initialize();

      // Handle redirect after Microsoft login
      this.authConfig.msalInstance
        .handleRedirectPromise()
        .then(async (authResult: AuthenticationResult | null) => {
          if (authResult) {
            // User returned from Microsoft login
            const accounts = this.authConfig.msalInstance.getAllAccounts();
            if (accounts.length > 0) {
              this.authConfig.account = accounts[0];
              
              try {
                // Acquire token silently
                const response = await this.authConfig.msalInstance.acquireTokenSilent({
                  account: this.authConfig.account,
                  scopes: ['openid', 'profile', 'email'],
                });
                
                this.authConfig.token = response.accessToken;
                
                // Exchange Azure token for backend JWT
                this.loginService.handleAzureLoginSuccess(authResult);
              } catch (error) {
                console.error('Token acquisition failed:', error);
                this.toastr.error('Failed to acquire authentication token', 'Authentication Error');
              }
            }
          } else {
            // Check if there's an existing active account
            const accounts = this.authConfig.msalInstance.getAllAccounts();
            if (accounts.length > 0) {
              this.authConfig.account = accounts[0];
              this.authConfig.msalInstance.setActiveAccount(accounts[0]);
            }
          }
        })
        .catch((error) => {
          console.error('Redirect handling error:', error);
          this.toastr.error('Authentication redirect failed', 'Authentication Error');
        });
    } catch (error) {
      console.error('MSAL initialization error:', error);
      this.toastr.error('Failed to initialize authentication', 'Initialization Error');
    }
  }
}
