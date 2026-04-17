import { createReducer, on } from '@ngrx/store';
import { AuthState, LoginResponse } from '../../core/models/auth.models';
import * as AuthActions from './auth.actions';

const TOKEN_KEY = 'stockmarket_token';
const USER_KEY = 'stockmarket_user';

export const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, AuthActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { response }) => {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response));
    return { ...state, user: response, loading: false, error: null };
  }),

  on(AuthActions.loginFailure, AuthActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.registerSuccess, (state) => ({
    ...state,
    loading: false,
    error: null,
  })),

  on(AuthActions.logout, (state) => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    return { ...initialState };
  }),

  on(AuthActions.loadUserFromStorage, (state) => {
    const raw = localStorage.getItem(USER_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (!raw || !token) return state;
    try {
      const user: LoginResponse = JSON.parse(raw);
      return { ...state, user };
    } catch {
      return state;
    }
  })
);
