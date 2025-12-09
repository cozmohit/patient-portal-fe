import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../enviornments/enviornment';

interface TokenResponse {
  access: string;
  refresh: string;
}

interface AzureTokenExchangeRequest {
  access_token: string;
  auth_method: 'azure';
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  
  private msalService = inject(MsalService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  
  isAuthenticatingWithMicrosoft = signal<boolean>(false);

  /**
   * Trigger Microsoft Login using Redirect Flow
   */
  async loginWithMicrosoft(): Promise<void> {
    try {
      const msalInstance = this.msalService.instance;
      
      // Ensure MSAL instance is initialized before calling any methods
      if (!(msalInstance as any).initialized) {
        await msalInstance.initialize();
      }
      
      const account = msalInstance.getActiveAccount();
      this.isAuthenticatingWithMicrosoft.set(true);
      
      this.msalService.loginRedirect({
        scopes: ['openid', 'profile', 'email'],
        account: account ?? undefined,
      });
    } catch (error) {
      this.isAuthenticatingWithMicrosoft.set(false);
      this.toastr.error('Failed to initiate Microsoft login', 'Authentication Error');
      console.error('Microsoft login error:', error);
    }
  }

  //Handle successful Azure login and exchange token with backend
  handleAzureLoginSuccess(authResult: AuthenticationResult): void {
    try {
      this.msalService.instance.setActiveAccount(authResult.account);
      localStorage.setItem('auth_method', 'azure');
      
      this.isAuthenticatingWithMicrosoft.set(true);

      // Exchange Azure token for backend JWT
      this.exchangeAzureToken(authResult.accessToken).subscribe({
        next: (backendTokens) => {
          this.storeTokens(backendTokens);
          console.log('Backend tokens:', backendTokens);
          this.toastr.success('Successfully logged in!', 'Welcome');
          this.router.navigate(['/dashboard']);
          this.isAuthenticatingWithMicrosoft.set(false);
        },
        error: (error) => {
          console.error('Azure token exchange failed:', error);
          this.toastr.error('Failed to authenticate with backend', 'Authentication Error');
          this.isAuthenticatingWithMicrosoft.set(false);
          this.logout();
        },
      });
    } catch (error) {
      console.error('Error handling Azure login:', error);
      this.toastr.error('An error occurred during authentication', 'Authentication Error');
      this.isAuthenticatingWithMicrosoft.set(false);
    }
  }

 //Exchange Azure token with backend
  private exchangeAzureToken(azureToken: string): Observable<TokenResponse> {
    const payload: AzureTokenExchangeRequest = {
      access_token: azureToken,
      auth_method: 'azure',
    };

    return this.http
      .post<TokenResponse>(`${environment.apiUrl}/validate-azure-token/`, payload)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Backend token exchange failed';
          
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 0) {
            errorMessage = 'Unable to connect to server';
          } else if (error.status === 401) {
            errorMessage = 'Invalid credentials';
          } else if (error.status === 403) {
            errorMessage = 'Access denied';
          }
          
          console.error('Backend token exchange error:', error);
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  //Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  //Get access token from localStorage
  getAccessToken(): string {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY) || '';
  }

  //Get refresh token from localStorage
  getRefreshToken(): string {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY) || '';
  }

  //Store tokens in localStorage
  private storeTokens(tokens: TokenResponse): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.access);
    if (tokens.refresh) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refresh);
    }
  }

  //Check if JWT token is expired
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expiry;
    } catch (error) {
      console.error('Error parsing token:', error);
      return true;
    }
  }

  //Logout user and clear tokens
  async logout(): Promise<void> {
    try {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem('auth_method');
      
      const msalInstance = this.msalService.instance;
      
      // Ensure MSAL instance is initialized before calling any methods
      if (!(msalInstance as any).initialized) {
        await msalInstance.initialize();
      }
      
      const account = msalInstance.getActiveAccount();
      if (account) {
        this.msalService.logoutRedirect({
          account: account,
        });
      } else {
        this.router.navigate(['/login']);
      }
      
      this.toastr.info('You have been logged out', 'Logout');
    } catch (error) {
      console.error('Logout error:', error);
      this.router.navigate(['/login']);
    }
  }
}

