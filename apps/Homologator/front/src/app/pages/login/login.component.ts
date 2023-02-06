import { Component } from '@angular/core';
import { FormGroup ,FormBuilder } from '@angular/forms';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  siteTitle :string= GlobalConstants.siteTitle;
  public userForm:FormGroup;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router){
    this.userForm = this.fb.group({
      username: '',
      password: ''
    })
  }
  onClick(){
    const body = new HttpParams().set('username', this.userForm.get('username')?.value).set('password', this.userForm.get('password')?.value);
    this.http.post("api/login",body.toString(),
    {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    }).subscribe({
      next: data=> {
        this.auth.setToken(data);
        this.router.navigate(['/home']);
      },  
      error: error =>{
        console.log(error);
      }
    });
  }
}
