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
    pageTitle: GlobalConstants.siteTitle,
    leftIcon: "add"
  };
  sysInput: string = ""
  systemSel: string[] = [];
  id:string = "";
  name:string = "";
  description: string= "";
  data = [
    {
      type: "hola",
      identifier: "0",
      name: "hola",
      software: "hsdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddola",
      status: "hola"
    }, {
      type: "hola",
      identifier: "0",
      name: "hola",
      software: "hola",
      status: "hola"
    }, {
      type: "hola",
      identifier: "0",
      name: "hola",
      software: "hola",
      status: "hola"
    }, {
      type: "hola",
      identifier: "0",
      name: "hola",
      software: "hola",
      status: "hola"
    }, {
      type: "hola",
      identifier: "0",
      name: "hola",
      software: "hola",
      status: "hola"
    },
  ];
  constructor(
    private toastr: ToastrService
  ){};

  create() {
    document.getElementById("mainModal")?.classList.remove("hidden");
    document.getElementById("selectModal")?.classList.remove("hidden");
  };

  resetForm():void {
    this.id = '';
    this.name = '';
    this.description = '';
    this.systemSel = [];
  }
  hiddeModal() {
    document.getElementById("mainModal")?.classList.add("hidden");
    document.getElementById("newSoftware")?.classList.add("hidden");
    document.getElementById("newSystem")?.classList.add("hidden");
    this.resetForm();
  }
  newSoftware(event: any) {
    this.stopPropagation(event);
    document.getElementById("selectModal")?.classList.add("hidden");
    document.getElementById("newSoftware")?.classList.remove("hidden");
  }
  newSystem(event: any) {
    this.stopPropagation(event);
    document.getElementById("selectModal")?.classList.add("hidden");
    document.getElementById("newSystem")?.classList.remove("hidden");
  }
  stopPropagation(event: any) {
    event.stopPropagation()
  }
  addSystem():void {
    if (this.sysInput !== '' && !this.systemSel.includes(this.sysInput)) {
      this.systemSel.push(this.sysInput);
      this.sysInput = '';
    }
  }
  rmSystem(elem:string):void {
    if (elem !== '' && this.systemSel.indexOf(elem) > -1) {
      this.systemSel.splice(this.systemSel.indexOf(elem),1);
    }
  }
  createSW():void{
    let error = '';
    if(this.id == ''){
      error += "Id ";
    }
    if(this.name == ''){
      error += "Nombre ";
    }
    if(this.description == ''){
      error += "Descripción ";
    }
    if(error == ''){
      this.toastr.success("Se creo correctamente el software.","Éxito",{
        timeOut: 3000,
      });
    }else{
      this.toastr.error("Debe de rellenar los siguientes campos: " + error,"Error",{
        timeOut: 3000,
      });
    }
  }
  createSys():void{
    let error = '';
    if(this.id == ''){
      error += "Id ";
    }
    if(this.name == ''){
      error += "Nombre ";
    }
    if(this.description == ''){
      error += "Descripción ";
    }
    if(this.systemSel.length === 0){
      error += "Sistemas ";
    }
    if(error == ''){
      this.toastr.success("Se creo correctamente el sistema.","Éxito",{
        timeOut: 3000,
      });
      this.hiddeModal();
    }else{
      this.toastr.error("Debe de rellenar los siguientes campos: " + error,
        "Error",{
        timeOut: 3000,
      });
    }
  }
}
