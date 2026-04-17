import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { SharedModule } from '../../../shared/modules/shared.module';
import { register } from '../../../store/auth/auth.actions';
import { selectAuthError, selectAuthLoading } from '../../../store/auth/auth.selectors';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
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
