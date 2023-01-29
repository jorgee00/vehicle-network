import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private cookie:CookieService,
    private router: Router
  ){};

  isLoggedIn(){
    return this.cookie.check('bearer');
  }

  getToken():any{
    return jwt_decode(this.cookie.get('bearer'));
  }

  logout(){
    this.cookie.delete('bearer');
    this.router.navigate(['/login']);
  }
}