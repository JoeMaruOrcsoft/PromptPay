import { Injectable } from '@angular/core';
import { Headers,Http,RequestOptions,Response} from '@angular/http'

@Injectable({
  providedIn: 'root'
})
export class TestServiceService {

  constructor(private http:Http) {

   }
   getData(){
     return this.http.get('http://192.168.9.154:8090/interbank/any-id/?type=mobile&value=0921419987').toPromise();
   }
   register(){
     return this.http.post('http://alws-orcsoft.mockable.io/InterBank/any-id',JSON.stringify({
       "IDType":"mobile",
       "IDValue":"0999999991",
       "BankCode":"014",
       "AccountID":"010-1-111111-1",
       "AccountName":"test"
     })).toPromise();
   }
}
