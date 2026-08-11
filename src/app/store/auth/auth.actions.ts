import { createAction, props } from '@ngrx/store';
import { LoginRequest, LoginResponse, RegisterRequest } from '../../core/models/auth.models';

export const login = createAction(
  '[Auth] Login',
  props<{ request: LoginRequest }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: LoginResponse }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const register = createAction(
  '[Auth] Register',
  props<{ request: RegisterRequest }>()
);
export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ userId: string }>()
);
export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

export const loginWithMicrosoft = createAction('[Auth] Login With Microsoft');

// Dispatched from app.config.ts's bootstrap initializer when the app reloads after Entra
// redirects back with an auth response — see handleRedirectObservable() there.
export const loginWithMicrosoftRedirectReturned = createAction(
  '[Auth] Login With Microsoft Redirect Returned',
  props<{ accessToken: string }>()
);

export const logout = createAction('[Auth] Logout');
export const loadUserFromStorage = createAction('[Auth] Load User From Storage');
