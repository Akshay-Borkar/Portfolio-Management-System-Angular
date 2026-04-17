import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SharedModule } from '../../../shared/modules/shared.module';
import { login } from '../../../store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  readonly loading$ = this.store.select(selectAuthLoading);
  readonly error$ = this.store.select(selectAuthError);

  form = this.fb.nonNullable.group({
    userName: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    if (this.form.invalid) return;
    this.store.dispatch(login({ request: this.form.getRawValue() }));
  }
}
