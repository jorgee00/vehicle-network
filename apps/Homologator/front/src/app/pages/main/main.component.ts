import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { Header } from 'src/app/shared/models/header';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent{
  header: Header = {
    pageTitle: GlobalConstants.siteTitle
  };
  id:string = '';
  name:string = '';
  description:string = '';
  reason:string = '';
  data = [
    {
      type: "hola",
      id: "0",
      name: "hola",
      description: "desc",
      software: "hsdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddola",
      status: "hola"
    }, {
      type: "hola",
      id: "0",
      name: "hola",
      description: "desc",
      software: "hola",
      status: "hola"
    }, {
      type: "hola",
      id: "0",
      name: "hola",
      description: "desc",
      software: "hola",
      status: "hola"
    }, {
      type: "hola",
      id: "0",
      name: "hola",
      description: "desc",
      software: "hola",
      status: "hola"
    }, {
      type: "hola",
      id: "0",
      name: "hola",
      description: "desc",
      software: "hola",
      status: "hola"
    },
  ];
  constructor(
    private toastr: ToastrService
  ){};
  
  resetForm():void {
    this.id = '';
    this.name = '';
    this.description = '';
    this.reason = '';
  }
  hiddeModal() {
    document.getElementById("mainModal")?.classList.add("hidden");
    this.resetForm();
  }
  stopPropagation(event: any) {
    event.stopPropagation()
  }
  openElem(elem:any){
    document.getElementById("mainModal")?.classList.remove("hidden");
    document.getElementById("chooseOption")?.classList.remove("hidden");
    this.id = elem.id;
    this.description = elem.description;
    this.name = elem.name;

  }
  accept(){

  }
  reject(){

  }
}
