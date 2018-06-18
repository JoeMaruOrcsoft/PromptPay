import { UserService } from "./user.service";
import { Injectable } from "@angular/core";
// import { Http,RequestOptions} from '@angular/http'
// import { HttpHeaders } from '@angular/common/http';
import {
  Http,
  Response,
  RequestOptions,
  Headers,
  Request,
  RequestMethod
} from "@angular/http";
@Injectable({
  providedIn: "root"
})
export class BankService {
  accountList = [];
  constructor(private http: Http, private userService: UserService) {}
  initAccountIDList() {
    //reset list after re-login
    this.accountList = [];
    let accountDetail = this.userService.accountDetail;
    for (var key in accountDetail) {
      if (accountDetail.hasOwnProperty(key)) {
        this.accountList.push(accountDetail[key].accountID);
      }
    }
  }

  checkDesAccount(desAccount){
    return this.http.get('http://localhost:8091/v1/v1/callRestApiController/checkDesAccount?accountID='+desAccount).toPromise();
  }

  localTransfer(fromAcc, toAcc, transferAmount:number) {
    let accountDetail = this.userService.accountDetail;

      let fee = 0;
      let net = transferAmount+fee;
      let body = JSON.stringify({
        TxnType : "S",
        TxnState : "Complete",
        TxnNote : "test transfer",
        FeeAmount : fee,
        SubmitAmount : transferAmount,
        NetAmount : net,
        SendBankCode : "002",
        SendAccountID : fromAcc,
        ReceiveBankCode : "002",
        ReceiveAccountID : toAcc
      });
      let headers = new Headers({ "Content-Type": "application/json" });
      let options = new RequestOptions({ headers: headers });
      this.http.post('http://localhost:8091/v1/v1/callRestApiController/transferLocal',body,options).subscribe(res=>{
        if(res.status == 200){
          console.log("transfer success") //transfer success
          this.http.get('http://localhost:8091/v1/v1/callRestApiController/updateLatestAmount?accountID='+fromAcc).subscribe(res=>{
            if(res.status == 200){
              let latestAmount = res.json();
              console.log(latestAmount)
              for (var key in accountDetail) {
                if (
                  accountDetail.hasOwnProperty(key) &&
                  accountDetail[key].accountID == fromAcc
                ) {
                  accountDetail[key].balanceAmount = latestAmount; //update latest amount for sender account
                }
              }
            }
          })
          this.http.get('http://localhost:8091/v1/v1/callRestApiController/updateLatestAmount?accountID='+toAcc).subscribe(res=>{
            if(res.status == 200){
              let latestAmount = res.json();
              console.log(latestAmount)
              for (var key in accountDetail) {
                if (
                  accountDetail.hasOwnProperty(key) &&
                  accountDetail[key].accountID == toAcc
                ) {
                  accountDetail[key].balanceAmount = latestAmount; //update latest amount for receiver account (in case of transfer in same account)
                }
              }
            }
          })
        }else if(res.status == 401){
          console.log("transfer fail by something else") //transfer fail by something else
        }
      })
    
  }
  // getData(type,value){
  //   return this.http.get('http://localhost:8091/v1/v1/callRestApiController/getPromptPayDetail?type='+type+'&value='+value).toPromise();
  // }
  // register(){
  //   let body = JSON.stringify({
  //     "IDType": "mobile",
  //     "IDValue":"0000000777",
  //     "BankCode" : "002",
  //     "AccountID" : "000-0-111111-8",
  //     "AccountName" : "eiei7"
  //   });
  //   let headers = new Headers({ 'Content-Type': 'application/json' });
  //   let options = new RequestOptions({ headers: headers});
  //   return this.http.post('http://localhost:8091/v1/v1/callRestApiController/postRegisterPromppay',body,options).toPromise()
  // }
}
