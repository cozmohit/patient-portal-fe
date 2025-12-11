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
        canActivate: [authGuard],
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
            },
            {
                path: 'master/users',
                loadComponent: () => import('./features/master-data/users/users').then(m => m.Users),
            },
            {
                path: 'master/countries',
                loadComponent: () => import('./features/master-data/countries/countries').then(m => m.Countries),
            },
            {
                path: 'master/products',
                loadComponent: () => import('./features/master-data/products/products').then(m => m.Products),
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'login',
    }
];
