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
		pageTitle: GlobalConstants.siteTitle,
		leftIcon: "add"
	};
	sysInput: string = ""
	systemSel: string[] = [];
	id:string = "";
	name:string = "";
	description: string= "";
	data:Response[] = [];
	constructor(
		private toastr: ToastrService,
		private connector: ConnectorService 
	){};
	
	async ngOnInit(){
		this.data = await this.connector.listSoftware();
		this.data = this.data.concat(await this.connector.listSystem());
	}
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
			this.connector.newSoftware(this.id,this.name,this.description);
			this.hiddeModal();
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
			this.connector.newSystem(this.id,this.name,this.description,this.systemSel.toString());
			this.hiddeModal();
		}else{
			this.toastr.error("Debe de rellenar los siguientes campos: " + error,"Error",{
				timeOut: 3000,
			});
		}
	}
}
