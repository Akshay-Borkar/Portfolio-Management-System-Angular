import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlertState } from '../../core/models/alert.models';

export const selectAlertState = createFeatureSelector<AlertState>('alert');

export const selectAllAlerts = createSelector(selectAlertState, (s) => s.alerts);
export const selectAlertLoading = createSelector(selectAlertState, (s) => s.loading);
export const selectAlertError = createSelector(selectAlertState, (s) => s.error);
export const selectAlertTotalCount = createSelector(selectAlertState, (s) => s.totalCount);
export const selectAlertPage = createSelector(selectAlertState, (s) => s.page);
export const selectAlertPageSize = createSelector(selectAlertState, (s) => s.pageSize);
