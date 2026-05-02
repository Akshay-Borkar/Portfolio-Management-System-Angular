import { createReducer, on } from '@ngrx/store';
import { AlertState } from '../../core/models/alert.models';
import * as AlertActions from './alert.actions';

export const initialState: AlertState = {
  alerts: [],
  totalCount: 0,
  page: 1,
  pageSize: 10,
  loading: false,
  error: null,
};

export const alertReducer = createReducer(
  initialState,

  on(AlertActions.loadAlerts, AlertActions.createAlert, (state) =>
    ({ ...state, loading: true, error: null })),

  on(AlertActions.loadAlertsSuccess, (state, { alerts, totalCount, page, pageSize }) =>
    ({ ...state, alerts, totalCount, page, pageSize, loading: false })),

  on(AlertActions.createAlertSuccess, (state) =>
    ({ ...state, loading: false })),

  on(AlertActions.deleteAlertSuccess, (state, { alertId }) => ({
    ...state,
    alerts: state.alerts.filter((a) => a.id !== alertId),
    totalCount: state.totalCount - 1,
  })),

  on(
    AlertActions.loadAlertsFailure,
    AlertActions.createAlertFailure,
    AlertActions.deleteAlertFailure,
    (state, { error }) => ({ ...state, loading: false, error })
  )
);
