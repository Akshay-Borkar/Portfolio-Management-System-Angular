// Copy this file to environment.ts (and environment.prod.ts for a production build) and fill
// in your own values. Both are gitignored — never commit real Azure AD clientId/authority values.
export const environment = {
  production: false,
  apiUrl: '',
  agentApiUrl: '',
  signalrHubUrl: '/hubs/stockprice',
  portfolioReviewHubUrl: '/hubs/portfolio-review',
  // Microsoft Entra External ID — leave blank to keep the "Sign in with Microsoft" button
  // disabled. Fill in once the Entra tenant + app registration exist (see AZURE_AD_* in the
  // backend's .env.example / the Azure AD plan's Phase 0).
  azureAd: {
    clientId: '',
    authority: '',
    apiScope: '',
  },
};
