import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private cookie:CookieService
  ) { }
  isLoggedIn(){
    return this.cookie.check('bearer');
  }
}
