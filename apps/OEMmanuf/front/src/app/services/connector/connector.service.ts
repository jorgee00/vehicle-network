import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from 'src/app/shared/models/response';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

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

  newSoftware(id:string, nombre: string, descripcion:string):Observable<any>{
    const body = new HttpParams().set('id', id ).set('nombre', nombre).set('descripcion',descripcion);
    return this.http.post<any>('/newSoftware',
    body.toString(),{
      headers:{
        "Authorization": this.auth.getAuthorization(),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  newSystem(id:string, nombre: string, descripcion:string, sw_included: string):Observable<any>{
    const body = new HttpParams().set('id', id ).set('nombre', nombre).set('descripcion',descripcion).set('sw_included',sw_included);
    return this.http.post<any>('/newSystem',
    body.toString(),{
      headers:{
        "Authorization": this.auth.getAuthorization(),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
  
}
