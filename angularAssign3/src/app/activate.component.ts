import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ActivateCredentials } from './dataModelClasses';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.css']
})
export class ActivateComponent implements OnInit {

  credentials: ActivateCredentials;
  activateError: string;
  tempRoles: string[] = ["Student", "Professor", "Advisor"];

  constructor(
    private router: Router,
    private a: AuthService,
    private jwtHelper: JwtHelperService){
      this.credentials = new ActivateCredentials();
      this.credentials.userName = '';
      this.credentials.password = '';
      this.credentials.passwordConfirm = '';
      this.credentials.role = '';
      this.activateError = '';
    }

  ngOnInit() {
  }

  onSubmit(): void {
    if(this.credentials.password !== this.credentials.passwordConfirm){
      this.activateError = "Password and Password Confirm do not match.";
      return;
    }
    // Complete this method...
    
    // Attempt to activate, by calling the activate method of the auth service
    this.a.activate(this.credentials)
    .pipe(catchError(err => {
      this.activateError = err.error.message;
      return throwError(err);
    })).subscribe(p => {
      this.activateError = p.message;
    });
  }
}
