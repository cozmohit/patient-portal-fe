import { Configuration } from "@azure/msal-browser";
import { environment } from "./enviornments/enviornment";

export const msalConfig: Configuration = {
    auth: {
        clientId: environment.adConfig.clientId,
        authority: `https://login.microsoftonline.com/${environment.adConfig.tenantId}`,
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        navigateToLoginRequestUrl: true,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false, 
    },
};

// API scopes for token acquisition
export const loginRequest = {
    scopes: [`api://${environment.adConfig.clientId}/api-access`],
};
