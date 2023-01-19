import { Component } from '@angular/core';
import { FormGroup ,FormBuilder } from '@angular/forms';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  siteTitle :string= GlobalConstants.siteTitle;
  public userForm:FormGroup;
  constructor(private http: HttpClient,private fb: FormBuilder){
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
          console.log(data)
      },  
      error: error =>{
        console.log(error)
      }
    });
  }
}
