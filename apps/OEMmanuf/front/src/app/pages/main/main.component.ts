import { Component } from '@angular/core';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { Header } from 'src/app/shared/models/header';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  header : Header = {
    pageTitle: GlobalConstants.siteTitle,
    currentUser: "Jorge",
    leftIcon: "add",
    rightIcon: "logout"
  };
  data=[
    {
      type: "hola",
      name:"hola",
      software:"hsdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddola",
      status:"hola"
    },{
      type: "hola",
      name:"hola",
      software:"hola",
      status:"hola"
    },{
      type: "hola",
      name:"hola",
      software:"hola",
      status:"hola"
    },{
      type: "hola",
      name:"hola",
      software:"hola",
      status:"hola"
    },{
      type: "hola",
      name:"hola",
      software:"hola",
      status:"hola"
    },
  ]
}
