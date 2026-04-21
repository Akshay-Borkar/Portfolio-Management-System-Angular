# Finance.Portfolio.Web

A modern, real-time **stock portfolio management dashboard** built with **Angular 19** and **NgRx**. This application enables users to manage their stock investments, monitor portfolio performance, track real-time stock prices via WebSocket (SignalR), analyze market sentiment, and configure price alerts — all powered by the [Finance.StockMarket.Tracking](https://github.com/akshayborkarpro/Finance.StockMarket.Tracking) .NET backend.

**Live Status**: 🟢 Production-Ready  
**Framework**: Angular 19  
**Architecture**: Feature-based Modular with NgRx State Management  
**License**: MIT

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Application Routes](#application-routes)
- [State Management](#state-management)
- [Backend Integration](#backend-integration)
- [Development Notes](#development-notes)

---

## Overview

**Finance.Portfolio.Web** is the Angular frontend for the Finance Stock Market platform. It provides a rich, interactive UI for investors to track their holdings, view P&L summaries, monitor live price movements via charts, and stay informed through sentiment analysis of financial news. The app uses NgRx for predictable state management and PrimeNG for a polished, enterprise-grade UI.

### Core Capabilities

- 📊 **Portfolio Dashboard** — Real-time overview of holdings, sector allocation, and P&L performance
- 📈 **Stock Tracker** — Live price charts with technical analysis using lightweight-charts
- 🧠 **Sentiment Analysis** — News sentiment scoring per ticker symbol from Yahoo Finance
- 🔔 **Price Alerts** — Configure buy/sell price threshold alerts with condition-based triggers
- 🏢 **Sector Management** — Browse and manage stock market sectors with associated stocks
- 🔐 **Authentication** — JWT-based login and registration with route guards and HTTP interceptors
- ⚡ **Real-time Updates** — SignalR WebSocket connection for live stock price streaming
- 💀 **Loading States** — Skeleton loaders and empty states for polished UX

---

## Key Features

| Feature | Description |
|---------|-------------|
| **Portfolio P&L Summary** | View total invested value, current value, and unrealized gain/loss |
| **Real-time Price Feed** | WebSocket (SignalR) streams live prices to the dashboard |
| **Price Charts** | Candlestick/line charts powered by lightweight-charts and Chart.js |
| **Sentiment Analysis** | Analyze Yahoo Finance news headlines for bullish/bearish signals |
| **Price Alerts** | Set above/below price alerts and receive in-app notifications |
| **Sector Management** | Full CRUD for stock sectors with P/E ratio tracking |
| **JWT Authentication** | Token-based auth with auto-attach interceptor and auth guards |
| **NgRx State Store** | Centralized state for auth, portfolio, alerts, sectors, and notifications |

---

## Technology Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Angular 19.0.0 (standalone components) |
| **State Management** | NgRx Store 19 + Effects |
| **UI Components** | PrimeNG 19.0.0 |
| **Charts** | lightweight-charts 4.2.0, Chart.js 4.5.1 |
| **Real-time** | @microsoft/signalr 8.0.7 |
| **Authentication** | @auth0/angular-jwt 5.2.0 |
| **Styling** | SCSS, PrimeFlex 3.3.1 |
| **HTTP** | Angular HttpClient with interceptors |
| **Build Tool** | Angular CLI 19.0.0 |
| **Testing** | Karma + Jasmine |

---

## Project Structure

```
src/
└── app/
    ├── core/
    │   ├── auth/               # Auth guard, interceptor, service
    │   ├── models/             # Shared TypeScript interfaces & enums
    │   └── services/           # Alert, Portfolio, Sentiment, SignalR, StockSector services
    ├── features/               # Lazy-loaded feature modules
    │   ├── auth/               # Login & Register components
    │   ├── dashboard/          # Main dashboard with portfolio overview
    │   ├── portfolio/          # Holdings list and P&L detail
    │   ├── stock-sectors/      # Sector list and detail views
    │   ├── stock-tracker/      # Real-time price chart
    │   ├── sentiment/          # News sentiment analysis
    │   └── alerts/             # Price alert management
    ├── shared/
    │   ├── layout/             # NavBar and Shell layout
    │   └── modules/            # PrimeNG and shared utility modules
    └── store/                  # NgRx feature stores
        ├── auth/
        ├── portfolio/
        ├── stock-sector/
        ├── alert/
        └── notification/
```

---

## Prerequisites

- **Node.js** 20+ and npm 10+
- **Angular CLI** 19.x (`npm install -g @angular/cli`)
- **Finance.StockMarket.Tracking** backend running locally (see backend README)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/akshayborkarpro/Finance.Portfolio.Web.git
cd Finance.Portfolio.Web
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the backend URL

Update `src/environments/environment.ts` to point to your running backend:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5059',
  hubUrl: 'https://localhost:7206/stockMarketHub'
};
```

### 4. Run the development server

```bash
ng serve
```

Open [http://localhost:4200](http://localhost:4200) in your browser.

### 5. Build for production

```bash
ng build --configuration production
```

Output is placed in `dist/finance-portfolio-web/`.

---

## Application Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | LoginComponent | User login |
| `/register` | RegisterComponent | New user registration |
| `/dashboard` | DashboardComponent | Portfolio overview & market summary |
| `/portfolio` | PortfolioComponent | Holdings with P&L breakdown |
| `/stock-sectors` | StockSectorListComponent | Browse all sectors |
| `/stock-sectors/:id` | StockSectorDetailComponent | Sector stocks and details |
| `/stock-tracker` | StockTrackerComponent | Real-time price chart |
| `/sentiment` | SentimentComponent | News sentiment analysis |
| `/alerts` | AlertsComponent | Manage price alerts |

All routes except `/login` and `/register` are protected by `AuthGuard`.

---

## State Management

The app uses **NgRx** with the following feature stores:

| Store | Manages |
|-------|---------|
| `auth` | JWT tokens, current user, login/logout actions |
| `portfolio` | Holdings, P&L summary, investment history |
| `stock-sector` | Sector list and selected sector detail |
| `alert` | Price alert CRUD and status |
| `notification` | In-app notification messages |

Each store follows the Actions → Reducer → Effects → Selectors pattern with typed state interfaces.

---

## Backend Integration

This frontend connects to the **Finance.StockMarket.Tracking** .NET backend:

| Integration | Endpoint |
|-------------|----------|
| REST API (HTTP) | `http://localhost:5059` |
| REST API (HTTPS) | `https://localhost:7206` |
| SignalR Hub | `wss://localhost:7206/stockMarketHub` |
| Swagger Docs | `https://localhost:7206/swagger` |

JWT tokens obtained at login are automatically attached to all API requests via `AuthInterceptor`.

---

## Development Notes

- All feature components are **standalone** (no NgModules required per feature)
- PrimeNG theme is configured globally via `provideAnimationsAsync` and theme provider
- SignalR connection is managed by `SignalRService` in the core layer; it reconnects automatically on disconnect
- Loading skeletons are shown via `*ngIf` guards on NgRx selectors while data is fetching
- The `notification` store drives toast messages shown by the shared notification effect
