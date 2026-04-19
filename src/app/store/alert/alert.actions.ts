import { createAction, props } from '@ngrx/store';
import { AlertDTO, CreateAlertRequest } from '../../core/models/alert.models';

export const loadAlerts = createAction('[Alert] Load Alerts');
export const loadAlertsSuccess = createAction('[Alert] Load Alerts Success', props<{ alerts: AlertDTO[] }>());
export const loadAlertsFailure = createAction('[Alert] Load Alerts Failure', props<{ error: string }>());

export const createAlert = createAction('[Alert] Create Alert', props<{ request: CreateAlertRequest }>());
export const createAlertSuccess = createAction('[Alert] Create Alert Success');
export const createAlertFailure = createAction('[Alert] Create Alert Failure', props<{ error: string }>());

export const deleteAlert = createAction('[Alert] Delete Alert', props<{ alertId: string }>());
export const deleteAlertSuccess = createAction('[Alert] Delete Alert Success', props<{ alertId: string }>());
export const deleteAlertFailure = createAction('[Alert] Delete Alert Failure', props<{ error: string }>());
