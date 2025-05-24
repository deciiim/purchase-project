import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// Import standalone components (no declarations)
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    LoginComponent,      // import standalone components here
    RegisterComponent,
  ],
  exports: [
    LoginComponent,      // export them here as well
    RegisterComponent,
  ]
})
export class AuthModule { }
