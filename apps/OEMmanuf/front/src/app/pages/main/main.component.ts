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
  systemSel : string[] = [];
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
  ];
  create(){
    document.getElementById("mainModal")?.classList.remove("hidden");
    document.getElementById("selectModal")?.classList.remove("hidden");
  }
  hiddeModal(){
    document.getElementById("mainModal")?.classList.add("hidden");
    document.getElementById("newSoftware")?.classList.add("hidden");
    document.getElementById("newSystem")?.classList.add("hidden");
  }
  newSoftware(event:any){
    this.stopPropagation(event);
    document.getElementById("selectModal")?.classList.add("hidden");
    document.getElementById("newSoftware")?.classList.remove("hidden");
  }
  newSystem(event:any){
    this.stopPropagation(event);
    document.getElementById("selectModal")?.classList.add("hidden");
    document.getElementById("newSystem")?.classList.remove("hidden");
  }
  stopPropagation(event:any){
    event.stopPropagation()
  }
}
