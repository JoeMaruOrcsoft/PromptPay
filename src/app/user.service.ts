import { Injectable } from '@angular/core';
import { Headers,Http,RequestOptions,Response} from '@angular/http'
@Injectable({
  providedIn: 'root'
})
export class UserService {
  accountDetail : {
    accountID : "",
    accountType : "",
    balanceAmount : "",
    name : ""
  }
  constructor(private http:Http) { }
  login(username,password){
    let headers = new Headers({'Content-Type':'application/json'})
    let options = new RequestOptions({headers:headers})
    return this.http.post('http://localhost:8091/v1/v1/callRestApiController/login',JSON.stringify({
      "username" : username,
      "password" : password
    }),options).toPromise()
  }
  updateAccountDetail(accountID){
    let headers = new Headers({'Content-Type':'application/json'})
    let options = new RequestOptions({headers:headers})
    return this.http.get('http://localhost:8091/v1/v1/callRestApiController/updateLatestAmount?accountID='+accountID).toPromise()
  }
}
