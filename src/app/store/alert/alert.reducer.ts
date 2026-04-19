import { createReducer, on } from '@ngrx/store';
import { AlertState } from '../../core/models/alert.models';
import * as AlertActions from './alert.actions';

export const initialState: AlertState = {
  alerts: [],
  loading: false,
  error: null,
};

export const alertReducer = createReducer(
  initialState,

  on(AlertActions.loadAlerts, AlertActions.createAlert, (state) =>
    ({ ...state, loading: true, error: null })),

  on(AlertActions.loadAlertsSuccess, (state, { alerts }) =>
    ({ ...state, alerts, loading: false })),

  on(AlertActions.createAlertSuccess, (state) =>
    ({ ...state, loading: false })),

  on(AlertActions.deleteAlertSuccess, (state, { alertId }) => ({
    ...state,
    alerts: state.alerts.filter((a) => a.id !== alertId),
  })),

  on(
    AlertActions.loadAlertsFailure,
    AlertActions.createAlertFailure,
    AlertActions.deleteAlertFailure,
    (state, { error }) => ({ ...state, loading: false, error })
  )
);
