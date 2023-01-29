import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from 'src/app/shared/models/response';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectorService {

  constructor(
    private http : HttpClient,
    private auth: AuthService
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
      console.log(resp)
      return resp;
    }
    return [];
  }
  async listSystem():Promise<Response[]>{
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
      console.log(resp)
      return resp;
    }
    return [];
  }
}
