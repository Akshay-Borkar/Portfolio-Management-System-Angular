export const StorageKeys = {
  Token: 'stockmarket_token',
  User: 'stockmarket_user',
  Theme: 'stockmarket_theme',
} as const;

export const ApiEndpoints = {
  Auth: {
    Base: '/api/auth',
    Login: '/login',
    Register: '/register',
    ExternalLogin: '/external/login',
  },
  Portfolio: {
    Base: '/api/portfolio',
    Summary: '/summary',
    Stock: '/stock',
    Investment: '/investment',
    Chart: '/chart',
    Investments: '/investments',
    Chat: '/chat',
    RebalancingChat: '/ai/rebalancing/chat',
    RebalancingSession: '/ai/rebalancing/session',
  },
  StockSector: {
    Base: '/api/stocksector',
  },
  Alerts: {
    Base: '/api/alerts',
  },
  Sentiment: {
    Base: '/api/sentiment',
    Analyze: '/analyze',
  },
  Documents: {
    Base: '/api/documents',
    Ingest: '/ingest',
    List: '/list',
  },
  Agents: {
    Base: '/api/agents',
    RunPortfolioReview: '/run-portfolio-review',
  },
} as const;

export const SignalRMethods = {
  ReceiveStockPrice: 'ReceiveStockPrice',
  ReceivePortfolioReview: 'ReceivePortfolioReview',
  SubscribeToStock: 'SubscribeToStock',
  UnsubscribeFromStock: 'UnsubscribeFromStock',
} as const;

export const Pagination = {
  DefaultPage: 1,
  DefaultPageSize: 10,
  PortfolioPageSize: 5,
} as const;

export const SseMarkers = {
  DataPrefix: 'data: ',
  Done: '[DONE]',
} as const;

export const ThemeValues = {
  Dark: 'dark',
  Light: 'light',
  DarkModeClass: 'dark-mode',
} as const;

export const AppRoutes = {
  Login: '/login',
  Dashboard: '/dashboard',
} as const;

export const HttpStatusCodes = {
  Unauthorized: 401,
  Forbidden: 403,
} as const;
