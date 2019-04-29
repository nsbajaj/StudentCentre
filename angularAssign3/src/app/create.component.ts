import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CreateCredentials } from './dataModelClasses';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})

export class CreateComponent implements OnInit {

  credentials: CreateCredentials;
  createError: string;
  tempRoles: string[] = ["Student", "Professor", "Advisor"];

  constructor(
    private router: Router,
    private a: AuthService,
    private jwtHelper: JwtHelperService
  ){
    this.credentials = new CreateCredentials();
    this.credentials.userName = '';
    this.credentials.fullName = '';
    this.credentials.password = '';
    this.credentials.passwordConfirm = '';
    this.credentials.role = '';

    this.createError = '';
  }

  ngOnInit() {
  }

  onSubmit(): void {
    // Complete this method...
    if(this.credentials.password !== this.credentials.passwordConfirm){
      this.createError = "Password and Password Confirm do not match.";
      return;
    }

    // Attempt to login, by calling the login method of the auth service
    this.a.create(this.credentials)
    .pipe(catchError(err => {
      this.createError = err.error.message;
      return throwError(err);
    })).subscribe(p => {
      this.createError = p.message;
    });
  }

}
