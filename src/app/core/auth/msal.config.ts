import { PublicClientApplication, InteractionType, IPublicClientApplication, BrowserCacheLocation } from '@azure/msal-browser';
import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';
import { environment } from '../../../environments/environment';

/** True once real Entra External ID values have been filled into the environment config
 *  (see AZURE_AD_* in the backend's .env.example — Phase 0 of the Azure AD plan). Everything
 *  in this file stays inert until then; the "Sign in with Microsoft" button checks this too. */
export const isAzureAdConfigured = (): boolean =>
  !!environment.azureAd.clientId && !!environment.azureAd.authority;

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: environment.azureAd.clientId || '00000000-0000-0000-0000-000000000000',
      authority: environment.azureAd.authority || 'https://login.microsoftonline.com/common',
      redirectUri: window.location.origin,
      postLogoutRedirectUri: window.location.origin,
    },
    cache: {
      // localStorage (not the default sessionStorage) so MSAL's own token cache survives a
      // refresh, same reasoning as StorageKeys.Token already being kept in localStorage.
      cacheLocation: BrowserCacheLocation.LocalStorage,
    },
  });
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return { interactionType: InteractionType.Redirect };
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  // Empty on purpose: the app does not use MsalInterceptor. The existing authInterceptor stays
  // the single source of truth for every normal request — MSAL is only ever consulted directly
  // by the loginWithMicrosoft$ effect (see auth.effects.ts).
  return { interactionType: InteractionType.Redirect, protectedResourceMap: new Map() };
}
