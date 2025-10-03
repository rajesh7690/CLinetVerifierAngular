import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports:[ReactiveFormsModule,CommonModule,RouterLink]
})
export class RegisterComponent {
  registerForm: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['',Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.registerForm.invalid) return;

    const { firstName, lastName, email,username, password } = this.registerForm.value;
    this.auth.register(firstName, lastName, email,username, password).subscribe(res => {
      if (res.success) {
        this.message = 'Registration successful! You can now log in.';
      } else {
        this.message = res.message || 'Registration failed';
      }
    });
  }
}
