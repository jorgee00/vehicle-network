import { HttpClient, HttpParams} from '@angular/common/http';
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
    const data = await this.http.get<any>('api/listSoftware',{
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
    const data = await this.http.get<any>('api/listSystem',{
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

  acceptSoftware(id:string, justification: string):Observable<any>{
    const body = new HttpParams().set('id', id ).set('justification', justification);
    return this.http.post<any>('api/acceptSoftware',
    body.toString(),{
      headers:{
        "Authorization": this.auth.getAuthorization(),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  rejectSoftware(id:string, justification: string):Observable<any>{
    const body = new HttpParams().set('id', id ).set('justification', justification);
    return this.http.post<any>('api/rejectSoftware',
    body.toString(),{
      headers:{
        "Authorization": this.auth.getAuthorization(),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  acceptSystem(id:string, justification: string):Observable<any>{
    const body = new HttpParams().set('id', id ).set('justification', justification);
    return this.http.post<any>('api/acceptSystem',
    body.toString(),{
      headers:{
        "Authorization": this.auth.getAuthorization(),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  rejectSystem(id:string, justification: string):Observable<any>{
    const body = new HttpParams().set('id', id ).set('justification', justification);
    return this.http.post<any>('api/rejectSystem',
    body.toString(),{
      headers:{
        "Authorization": this.auth.getAuthorization(),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }
  
}
