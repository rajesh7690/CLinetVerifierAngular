import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule  } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports:[ ReactiveFormsModule,RouterLink,CommonModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;
    this.auth.login(email, password).subscribe(res => {
      if (res.success && res.token && res.refreshToken) {
        this.auth.setTokens(res.token, res.refreshToken);
        this.router.navigate(['/dashboard']); // redirect after login
      } else {
        this.message = res.message || 'Login failed';
      }
    });
  }
}
