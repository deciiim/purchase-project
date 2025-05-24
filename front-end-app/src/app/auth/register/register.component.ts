import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;  
  accountCreated = false;
  errorMessage = '';  // For displaying backend errors

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password?.value === confirmPassword?.value 
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      // Rename fullName to name here to match backend expectation
      const { fullName, email, password } = this.registerForm.value;
  
      this.http.post('http://localhost:3000/users', { 
        name: fullName,   // <-- renamed here
        email, 
        password 
      }).subscribe({
        next: () => {
          this.accountCreated = true;
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription';
        }
      });
    }
  }
  

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
