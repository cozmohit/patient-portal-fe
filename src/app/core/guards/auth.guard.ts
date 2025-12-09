import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoginService } from '../services/login.service';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  // Check if user is authenticated
  if (loginService.isAuthenticated()) {
    return of(true);
  }

  // Redirect to login page if not authenticated
  return of(router.parseUrl('/login'));
};

