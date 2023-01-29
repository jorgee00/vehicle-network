import { Component } from '@angular/core';
import { FormGroup ,FormBuilder } from '@angular/forms';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

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
    private router: Router){
    this.userForm = this.fb.group({
      username: '',
      password: ''
    })
  }
  onClick(){
    const body = new HttpParams().set('username', this.userForm.get('username')?.value).set('password', this.userForm.get('password')?.value);
    console.log(body)
    this.http.post("/login",body.toString(),
    {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
    }).subscribe({
      next: data => {
        this.router.navigate(['/home']);
      },  
      error: error =>{
        console.log(error);
      }
    });
  }
}
