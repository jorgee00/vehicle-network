import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { Header } from 'src/app/shared/models/header';
import { ToastrService } from 'ngx-toastr';
import { ConnectorService } from 'src/app/services/connector/connector.service';
import { Response } from 'src/app/shared/models/response';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  header: Header = {
    pageTitle: GlobalConstants.siteTitle
  };
  id:string = '';
  name:string = '';
  description:string = '';
  reason:string = '';
  type:string = '';
  data: Response[] = [];
  
  constructor(
    private toastr: ToastrService,
    private connector: ConnectorService
  ){};
  async ngOnInit() {
		await this.refresh();
	}
	async refresh() {
    this.resetForm();
		let newdata = await this.connector.listSoftware();
		this.data = newdata.concat(await this.connector.listSystem());
	}
  resetForm():void {
    this.id = '';
    this.name = '';
    this.description = '';
    this.reason = '';
    this.type = '';
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
    this.name = elem.name;
    this.description = elem.description;
    this.type = elem.type;
  }
  accept(){
    if(this.reason != ''){
      if(this.type.toLowerCase() === 'software'){
        this.connector.acceptSoftware(this.id,this.reason).subscribe({
          next: data => {
            this.toastr.success('Se acepto correctamente el software.', "Éxito", {
              timeOut: 3000,
            });
            this.refresh();
          },
          error: error => {
            this.toastr.error("Se ha producido el siguiente error: " + error, "Error", {
              timeOut: 3000,
            });
          }
        });
        
      }else{
        this.connector.acceptSystem(this.id,this.reason).subscribe({
          next: data => {
            this.toastr.success('Se acepto correctamente el sistema.', "Éxito", {
              timeOut: 3000,
            });
            this.refresh();
          },
          error: error => {
            this.toastr.error("Se ha producido el siguiente error: " + error, "Error", {
              timeOut: 3000,
            });
          }
        });
      }
      this.hiddeModal();
    }
  }
  reject(){
    if(this.reason != ''){
      if(this.type.toLowerCase() === 'software'){
        this.connector.rejectSoftware(this.id,this.reason).subscribe({
          next: data => {
            this.toastr.success('Se rechazo correctamente el software.', "Éxito", {
              timeOut: 3000,
            });
            this.refresh();
          },
          error: error => {
            this.toastr.error("Se ha producido el siguiente error: " + error, "Error", {
              timeOut: 3000,
            });
          }
        });
        
      }else{
        this.connector.rejectSystem(this.id,this.reason).subscribe({
          next: data => {
            this.toastr.success('Se rechazo correctamente el sistema.', "Éxito", {
              timeOut: 3000,
            });
            this.refresh();
          },
          error: error => {
            this.toastr.error("Se ha producido el siguiente error: " + error, "Error", {
              timeOut: 3000,
            });
          }
        });
      }
      this.hiddeModal();
    }
  }
}
