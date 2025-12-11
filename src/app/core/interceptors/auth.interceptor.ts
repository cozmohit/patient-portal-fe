import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from '../services/login.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private loginService = inject(LoginService);
  private toastr = inject(ToastrService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip auth header for authentication endpoints
    if (
      req.url.includes('/auth/login') ||
      req.url.includes('/token/') || 
      req.url.includes('/validate-azure-token/') ||
      req.url.includes('/refresh/')
    ) {
      return next.handle(req);
    }

    // Add authorization header if token exists
    const accessToken = this.loginService.getAccessToken();
    if (accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expired or invalid
          this.toastr.error('Session expired. Please login again.', 'Authentication Error');
          this.loginService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}

