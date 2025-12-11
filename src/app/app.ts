import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus, EventType, AuthenticationResult } from '@azure/msal-browser';
import { Subject, filter, takeUntil } from 'rxjs';
import { LoginService } from './core/services/login.service';
import { loginRequest } from '../auth.config';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  private msalService = inject(MsalService);
  private msalBroadcastService = inject(MsalBroadcastService);
  private loginService = inject(LoginService);
  private toastr = inject(ToastrService);
  
  private readonly destroying$ = new Subject<void>();

  async ngOnInit() {
    // Initialize MSAL instance first
    await this.msalService.instance.initialize();
    
    console.log('MSAL initialized, handling redirect...');
    
    // Handle the redirect promise FIRST before anything else
    this.msalService.instance.handleRedirectPromise()
      .then((response: AuthenticationResult | null) => {
        console.log('Redirect promise resolved:', response);
        
        if (response) {
          // User just returned from Microsoft login
          console.log('User returned from Microsoft login');
          this.handleSuccessfulLogin(response);
        } else {
          // No redirect response - check for existing account
          this.checkExistingAccount();
        }
      })
      .catch((error) => {
        console.error('Redirect handling error:', error);
        this.toastr.error('Authentication redirect failed', 'Authentication Error');
      });

    // Subscribe to MSAL events for additional login success handling
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((event) => event.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this.destroying$)
      )
      .subscribe((event) => {
        console.log('LOGIN_SUCCESS event:', event);
        if (event.payload) {
          this.handleSuccessfulLogin(event.payload as AuthenticationResult);
        }
      });

    // Monitor interaction status changes
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status) => status === InteractionStatus.None),
        takeUntil(this.destroying$)
      )
      .subscribe(() => {
        console.log('Interaction complete, checking accounts...');
        this.checkExistingAccount();
      });
  }

  private checkExistingAccount(): void {
    const accounts = this.msalService.instance.getAllAccounts();
    console.log('Existing accounts:', accounts.length);
    
    if (accounts.length > 0) {
      this.msalService.instance.setActiveAccount(accounts[0]);
    }
  }

  private async handleSuccessfulLogin(authResult: AuthenticationResult): Promise<void> {
    console.log('Handling successful login, authResult:', authResult);
    
    try {
      // Set the active account
      this.msalService.instance.setActiveAccount(authResult.account);
      
      // Acquire access token for our API
      console.log('Acquiring token for API...');
      const tokenResponse = await this.msalService.instance.acquireTokenSilent({
        account: authResult.account,
        scopes: loginRequest.scopes,
      });
      
      console.log('Token acquired successfully');
      
      // Exchange Azure token with backend
      this.loginService.exchangeTokenAndLogin(tokenResponse.accessToken);
      
    } catch (error) {
      console.error('Token acquisition failed:', error);
      this.toastr.error('Failed to acquire authentication token', 'Authentication Error');
    }
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
  }
}
