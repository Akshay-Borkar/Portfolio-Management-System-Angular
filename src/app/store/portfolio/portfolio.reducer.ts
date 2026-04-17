import { createReducer, on } from '@ngrx/store';
import { PortfolioState } from '../../core/models/portfolio.models';
import * as PortfolioActions from './portfolio.actions';

export const initialState: PortfolioState = {
  summary: null,
  loading: false,
  error: null,
};

export const portfolioReducer = createReducer(
  initialState,

  on(
    PortfolioActions.loadPortfolio,
    PortfolioActions.addStock,
    PortfolioActions.addInvestment,
    (state) => ({ ...state, loading: true, error: null })
  ),

  on(PortfolioActions.loadPortfolioSuccess, (state, { summary }) => ({
    ...state,
    summary,
    loading: false,
  })),

  on(
    PortfolioActions.addStockSuccess,
    PortfolioActions.addInvestmentSuccess,
    (state) => ({ ...state, loading: false })
  ),

  on(
    PortfolioActions.loadPortfolioFailure,
    PortfolioActions.addStockFailure,
    PortfolioActions.addInvestmentFailure,
    (state, { error }) => ({ ...state, loading: false, error })
  )
);
