import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PortfolioState } from '../../core/models/portfolio.models';

export const selectPortfolioState = createFeatureSelector<PortfolioState>('portfolio');

export const selectPortfolioSummary = createSelector(selectPortfolioState, (s) => s.summary);
export const selectPortfolioLoading = createSelector(selectPortfolioState, (s) => s.loading);
export const selectPortfolioError = createSelector(selectPortfolioState, (s) => s.error);
export const selectHoldings = createSelector(selectPortfolioSummary, (s) => s?.holdings ?? []);
export const selectSectorAllocations = createSelector(selectPortfolioSummary, (s) => s?.sectorAllocations ?? []);
