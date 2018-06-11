import { Injectable } from '@angular/core';
// import { Http,RequestOptions} from '@angular/http'
// import { HttpHeaders } from '@angular/common/http';
import {Http, Response, RequestOptions, Headers, Request, RequestMethod} from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(private http:Http) {

  }
  getData(type,value){
    return this.http.get('http://localhost:8091/v1/v1/callRestApiController/getPromptPayDetail?type='+type+'&value='+value).toPromise();
  }
  register(){
    let body = JSON.stringify({
      "IDType": "mobile",
      "IDValue":"0000000777",
      "BankCode" : "002",
      "AccountID" : "000-0-111111-8",
      "AccountName" : "eiei7"
    });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers});
    return this.http.post('http://localhost:8091/v1/v1/callRestApiController/postRegisterPromppay',body,options).toPromise()
  }
}
