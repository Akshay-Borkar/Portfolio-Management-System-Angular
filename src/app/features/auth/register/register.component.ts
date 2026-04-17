import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { MessageModule } from 'primeng/message';
import { register } from '../../../store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, AsyncPipe,
    CardModule, InputTextModule, PasswordModule, ButtonModule, DropdownModule, MessageModule,
  ],
  template: `
    <div class="flex justify-content-center align-items-center py-5">
      <p-card header="Create Account" [style]="{ width: '420px' }">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="flex flex-column gap-3">
            <div class="flex gap-2">
              <div class="flex flex-column gap-1 flex-1">
                <label>First Name</label>
                <input pInputText formControlName="firstName" placeholder="First name" />
              </div>
              <div class="flex flex-column gap-1 flex-1">
                <label>Last Name</label>
                <input pInputText formControlName="lastName" placeholder="Last name" />
              </div>
            </div>
            <div class="flex flex-column gap-1">
              <label>Email</label>
              <input pInputText formControlName="email" type="email" placeholder="Email" />
            </div>
            <div class="flex flex-column gap-1">
              <label>Username</label>
              <input pInputText formControlName="userName" placeholder="Username (min 6 chars)" />
            </div>
            <div class="flex flex-column gap-1">
              <label>Password</label>
              <p-password
                formControlName="password"
                placeholder="Password (min 6 chars)"
                [toggleMask]="true"
                styleClass="w-full"
              />
            </div>
            <div class="flex flex-column gap-1">
              <label>Role</label>
              <p-dropdown
                formControlName="role"
                [options]="roles"
                placeholder="Select role"
                styleClass="w-full"
              />
            </div>
            @if (error$ | async; as err) {
              <p-message severity="error" [text]="err" />
            }
            <p-button
              label="Register"
              type="submit"
              [loading]="!!(loading$ | async)"
              [disabled]="form.invalid"
              styleClass="w-full"
            />
            <span class="text-center text-sm">
              Have an account? <a routerLink="/login">Sign in</a>
            </span>
          </div>
        </form>
      </p-card>
    </div>
  `,
})
export class RegisterComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  readonly loading$ = this.store.select(selectAuthLoading);
  readonly error$ = this.store.select(selectAuthError);

  readonly roles = ['User', 'Admin'];

  form = this.fb.nonNullable.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    userName: ['', [Validators.required, Validators.minLength(6)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    role: ['User', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.store.dispatch(register({ request: this.form.getRawValue() }));
  }
}
