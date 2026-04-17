import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { login } from '../../../store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, RouterLink, AsyncPipe,
    CardModule, InputTextModule, PasswordModule, ButtonModule, MessageModule,
  ],
  template: `
    <div class="flex justify-content-center align-items-center" style="min-height:100vh">
      <p-card header="Sign In" [style]="{ width: '380px' }">
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="flex flex-column gap-3">
            <div class="flex flex-column gap-1">
              <label for="userName">Username</label>
              <input pInputText id="userName" formControlName="userName" placeholder="Enter username" />
            </div>
            <div class="flex flex-column gap-1">
              <label for="password">Password</label>
              <p-password
                id="password"
                formControlName="password"
                placeholder="Enter password"
                [feedback]="false"
                [toggleMask]="true"
                styleClass="w-full"
              />
            </div>
            @if (error$ | async; as err) {
              <p-message severity="error" [text]="err" />
            }
            <p-button
              label="Sign In"
              type="submit"
              [loading]="!!(loading$ | async)"
              [disabled]="form.invalid"
              styleClass="w-full"
            />
            <span class="text-center text-sm">
              No account? <a routerLink="/register">Register</a>
            </span>
          </div>
        </form>
      </p-card>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  readonly loading$ = this.store.select(selectAuthLoading);
  readonly error$ = this.store.select(selectAuthError);

  form = this.fb.nonNullable.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.invalid) return;
    this.store.dispatch(login({ request: this.form.getRawValue() }));
  }
}
