import { createAction, props } from '@ngrx/store';
import {
  AddInvestmentRequest,
  AddStockRequest,
  PortfolioSummaryDTO,
} from '../../core/models/portfolio.models';

export const loadPortfolio = createAction('[Portfolio] Load Portfolio');
export const loadPortfolioSuccess = createAction(
  '[Portfolio] Load Portfolio Success',
  props<{ summary: PortfolioSummaryDTO }>()
);
export const loadPortfolioFailure = createAction(
  '[Portfolio] Load Portfolio Failure',
  props<{ error: string }>()
);

export const addStock = createAction(
  '[Portfolio] Add Stock',
  props<{ request: AddStockRequest }>()
);
export const addStockSuccess = createAction('[Portfolio] Add Stock Success');
export const addStockFailure = createAction(
  '[Portfolio] Add Stock Failure',
  props<{ error: string }>()
);

export const addInvestment = createAction(
  '[Portfolio] Add Investment',
  props<{ request: AddInvestmentRequest }>()
);
export const addInvestmentSuccess = createAction('[Portfolio] Add Investment Success');
export const addInvestmentFailure = createAction(
  '[Portfolio] Add Investment Failure',
  props<{ error: string }>()
);
