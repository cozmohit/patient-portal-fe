import { AccountInfo, PublicClientApplication, Configuration } from "@azure/msal-browser";
import { environment } from "./enviornments/enviornment";


export const msalConfig: Configuration = {
    auth: {
        clientId: environment.adConfig.clientId,
        authority: `https://login.microsoftonline.com/${environment.adConfig.tenantId}/v2.0`,
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false, 
    },
    system: {
    }
};

const data = {
    account: null as AccountInfo | null,
    msalInstance: new PublicClientApplication(msalConfig),
    token: "",
};

export function useAuth() {
    return data;
}