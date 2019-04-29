import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  tokenRaw?: string;
  logoutError: string;

  constructor(private jwtHelper: JwtHelperService, private router: Router) { 
    // Fetch the token from the browser's local storage
    this.tokenRaw = localStorage.getItem('access_token');

    // If it exists, decode it, otherwise, create placeholder values for the view
    if (this.tokenRaw) {
      localStorage.setItem('access_token', "");
    }
    this.logoutError = "You've been successfully logged out.";
    //this.router.navigate(['/home']);
  }

  ngOnInit() {

  }

}
