import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { JwtHelperService } from '@auth0/angular-jwt';

import { map, catchError } from 'rxjs/operators';
//import { Credentials } from './login.component';
import { User, LoginCredentials, ActivateCredentials, CreateCredentials } from './dataModelClasses';

@Injectable()
export class AuthService {

  // Properties

  private url: string = 'https://secret-ocean-38431.herokuapp.com/api/';

  // Initialization

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
  ) { }

  // Methods

  public getToken(): string {
    return localStorage.getItem('access_token');
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');

    if (token) {
      //console.log('token exists');
      return true;
    } else {
      //console.log('no token');
      return false;
    }
  }

  // Options object for POST and PUT requests
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  // Error handler, from the Angular docs
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  login(credentials: LoginCredentials): Observable<any> {

    // Uncomment if you want to see the passed-in credentials
    // console.log(credentials);

    // Attempt to login
    // ##### EDIT the following to match the path to your web API login resource
    var tempURL = this.url + "useraccounts/login/";
    return this.http.post<any>(tempURL, credentials, this.httpOptions);
  }

  activate(credentials: ActivateCredentials): Observable<any> {

    // Uncomment if you want to see the passed-in credentials
    // console.log(credentials);

    // Attempt to activate
    // ##### EDIT the following to match the path to your web API login resource
    var tempURL = this.url + "useraccounts/activate/";
    return this.http.post<any>(tempURL, credentials, this.httpOptions);
  }

  create(credentials: CreateCredentials): Observable<any> {

    // Uncomment if you want to see the passed-in credentials
    // console.log(credentials);

    // Attempt to activate
    // ##### EDIT the following to match the path to your web API login resource
    var tempURL = this.url + "useraccounts/create/";
    return this.http.post<any>(tempURL, credentials, this.httpOptions);
  }
}
