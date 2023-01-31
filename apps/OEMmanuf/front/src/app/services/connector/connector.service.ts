import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from 'src/app/shared/models/response';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  constructor(
    private http : HttpClient,
    private auth: AuthService,
    private toastr: ToastrService
  ) { }
  async listSoftware():Promise<Response[]>{
    const data = await this.http.get<any>('/listSoftware',{
      headers:{
        "Authorization": this.auth.getAuthorization()
      }
    }).toPromise();
    
		if(data && data.result){
      let resp:Response[] = JSON.parse(data.payload);
      resp.forEach(element => {
            element.type = "Software"
          });
      return resp;
    }
    return [];
  }
  async listSystem():Promise<Response[]>{
    const data = await this.http.get<any>('/listSystem',{
      headers:{
        "Authorization": this.auth.getAuthorization()
      }
    }).toPromise();
    
		if(data && data.result){
      let resp:Response[] = JSON.parse(data.payload);
      resp.forEach(element => {
            element.type = "System"
          });
      return resp;
    }
    return [];
  }

  newSoftware(id:string, nombre: string, descripcion:string):void{
    const body = new HttpParams().set('id', id ).set('nombre', nombre).set('descripcion',descripcion);
    this.http.post<any>('/sendNewSwDescription',
    body.toString(),{
      headers:{
        "Authorization": this.auth.getAuthorization(),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).subscribe({
      next: data => {
        this.toastr.success("Se creo correctamente el software.","Éxito",{
          timeOut: 3000,
        });
      },  
      error: error =>{
        this.toastr.error("Se ha producido el siguiente error: " + error, "Error",{
				  timeOut: 3000,
			  });
      }
    });
  }

  newSystem(id:string, nombre: string, descripcion:string, sw_included: string):void{
    const body = new HttpParams().set('id', id ).set('nombre', nombre).set('descripcion',descripcion).set('sw_included',sw_included);
    this.http.post<any>('/sendNewSwDescription',
    body.toString(),{
      headers:{
        "Authorization": this.auth.getAuthorization(),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).subscribe({
      next: data => {
        this.toastr.success("Se creo correctamente el sistema.","Éxito",{
          timeOut: 3000,
        });
      },  
      error: error =>{
        this.toastr.error("Se ha producido el siguiente error: " + error, "Error",{
				  timeOut: 3000,
			  });
      }
    });
  }
  
}
