import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../enviornments/enviornment';
import { loginRequest } from '../../../auth.config';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: Role;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

interface AzureTokenExchangeRequest {
  azure_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_EMAIL_KEY = 'user_email';
  private readonly USER_ROLE_KEY = 'user_role';
  private readonly USER_FIRST_NAME_KEY = 'user_first_name';
  
  private msalService = inject(MsalService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  
  isAuthenticatingWithMicrosoft = signal<boolean>(false);

  private baseUrl = `${environment.apiUrl}/users/auth`;

  /**
   * Trigger Microsoft Login using Redirect Flow
   */
  async loginWithMicrosoft(): Promise<void> {
    try {
      const msalInstance = this.msalService.instance;
      
      // Ensure MSAL instance is initialized
      await msalInstance.initialize();
      
      this.isAuthenticatingWithMicrosoft.set(true);
      console.log('Initiating Microsoft login redirect...');
      
      // Use loginRedirect - this will navigate away from the app
      await msalInstance.loginRedirect({
        scopes: loginRequest.scopes,
      });
    } catch (error) {
      this.isAuthenticatingWithMicrosoft.set(false);
      this.toastr.error('Failed to initiate Microsoft login', 'Authentication Error');
      console.error('Microsoft login error:', error);
    }
  }

  /**
   * Exchange Azure token with backend and complete login
   */
  exchangeTokenAndLogin(azureAccessToken: string): void {
    this.isAuthenticatingWithMicrosoft.set(true);
    console.log('Exchanging token with backend...');
    
    this.exchangeAzureToken(azureAccessToken).subscribe({
      next: (response) => {
        console.log('Backend token exchange successful');
        this.storeTokens(response);
        localStorage.setItem('auth_method', 'azure');
        
        const userName = `${response.user.first_name} ${response.user.last_name}`;
        this.toastr.success(`Welcome back, ${userName}!`, 'Login Successful');
        
        // Navigate to dashboard
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
  }

  /**
   * Exchange Azure token with backend
   */
  private exchangeAzureToken(azureToken: string): Observable<TokenResponse> {
    const payload: AzureTokenExchangeRequest = {
      azure_token: azureToken,
    };

    return this.http
      .post<TokenResponse>(`${this.baseUrl}/login/`, payload)
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

 // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Get access token from sessionStorage
  getAccessToken(): string {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY) || '';
  }

  // Get refresh token from localStorage
  getRefreshToken(): string {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY) || '';
  }

  // Store tokens and user data
  private storeTokens(response: TokenResponse): void {
    // Store access token in sessionStorage
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, response.access_token);
    
    // Store refresh token in localStorage
    if (response.refresh_token) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refresh_token);
    }
    
    // Store user data in localStorage
    localStorage.setItem(this.USER_EMAIL_KEY, response.user.email);
    localStorage.setItem(this.USER_ROLE_KEY, response.user.role.name);
    localStorage.setItem(this.USER_FIRST_NAME_KEY, response.user.first_name);
   
  }

  // Get user email from localStorage
  getUserEmail(): string {
    return localStorage.getItem(this.USER_EMAIL_KEY) || '';
  }

  // Get user role from localStorage
  getUserRole(): string {
    return localStorage.getItem(this.USER_ROLE_KEY) || '';
  }

  // Get user first name from localStorage
  getUserFirstName(): string {
    return localStorage.getItem(this.USER_FIRST_NAME_KEY) || '';
    
  }

  // Get user initials for avatar
  getUserInitials(): string {
    const firstName = this.getUserFirstName();
    return firstName ? firstName.charAt(0).toUpperCase() : 'U';
  }

  // Check if JWT token is expired
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

  // Logout user and clear tokens
  async logout(): Promise<void> {
    try {
      // Clear sessionStorage
      sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
      
      // Clear localStorage
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_EMAIL_KEY);
      localStorage.removeItem(this.USER_ROLE_KEY);
      localStorage.removeItem(this.USER_FIRST_NAME_KEY);
      localStorage.removeItem('auth_method');
      
      const msalInstance = this.msalService.instance;
      
      // Ensure MSAL instance is initialized
      await msalInstance.initialize();
      
      const account = msalInstance.getActiveAccount();
      if (account) {
        await msalInstance.logoutRedirect({
          account: account,
          postLogoutRedirectUri: window.location.origin,
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
