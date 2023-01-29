import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Header } from '../../models/header';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
  @Input() header:Header={pageTitle:""};
  @Output() actionLeft = new EventEmitter<void>();
  currentUser:string = "";
  constructor(
    private authService:AuthService
  ){}
  ngOnInit(): void {
    this.currentUser = this.authService.getToken().sub;
  }
  logout(){
    this.authService.logout();
  }
}
