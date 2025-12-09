import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
    },
    {
        path: '',
        loadComponent: () => import('./layouts/main-layout/main-layout').then(m => m.MainLayout),
        // canActivate: [authGuard], // Uncomment when auth is ready
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard/dashboard').then(m => m.Dashboard),
            },
            {
                path: 'market-size',
                loadComponent: () => import('./features/market-size/market-size').then(m => m.MarketSize),
            },
            {
                path: 'patients',
                loadComponent: () => import('./features/patients/patients').then(m => m.Patients),
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'login',
    }
];
