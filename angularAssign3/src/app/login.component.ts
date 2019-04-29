import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { LoginCredentials } from './dataModelClasses';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Properties

  credentials: LoginCredentials;
  loginError: string;

  // Initialization

  constructor(
    private router: Router,
    private a: AuthService,
    private jwtHelper: JwtHelperService
  ){
    this.credentials = new LoginCredentials();
    this.credentials.userName = '';
    this.credentials.password = '';

    this.loginError = '';
  }

  ngOnInit() {
  }

  // Methods

  onSubmit(): void {
    // Complete this method...

    // Clear the existing token
    localStorage.removeItem('access_token');

    // Attempt to login, by calling the login method of the auth service
    this.a.login(this.credentials)
    .pipe(catchError(err => {
      this.loginError = err.error.message;
      return throwError(err);
    })).subscribe(p => {
        if(p.token != null){
          localStorage.setItem("access_token", p.token);         
          // Go to this student's detail page
          let tokenDecoded = this.jwtHelper.decodeToken(p.token);
          this.router.navigate(['/students/', tokenDecoded.userName]);
        }
    });
  }
}