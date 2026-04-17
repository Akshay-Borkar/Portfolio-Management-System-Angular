export const environment = {
  production: true,
  // Empty strings → nginx proxies /api/ and /stockMarketHub to the backend container
  apiUrl: '',
  signalrHubUrl: '/stockMarketHub',
};
