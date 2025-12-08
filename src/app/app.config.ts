// import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
// import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';

// import { routes } from './app.routes';
// import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
// import { provideAnimations } from '@angular/platform-browser/animations';

// import { msalConfig } from '../auth.config';
// // Factory function for MSAL instance
// export function MSALInstanceFactory(): IPublicClientApplication {
//   return new PublicClientApplication(msalConfig);
// }

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideZoneChangeDetection({ eventCoalescing: true }),
//     provideRouter(routes, withPreloading(PreloadAllModules)),
//     provideHttpClient(withInterceptorsFromDi(), withInterceptors([errorInterceptor])),
//     provideAnimations(),
//     provideToastr({
//       progressBar: true,
//       timeOut: 3000,
//     }),
//     {
//       provide: HTTP_INTERCEPTORS,
//       useClass: withInterceptors,
//       multi: true,
//     },
//     {
//       provide: MSAL_INSTANCE,
//       useFactory: MSALInstanceFactory
//     },
//     MsalService,
//     MsalBroadcastService,
//   ],
// };
