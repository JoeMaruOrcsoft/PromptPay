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
  slip={
    txnID : "",
    date : "",
    fromAcc : "",
    toAcc : "",
    accName : "Test Name",
    amount : "",
    fee : ""
  }
  slipPP={
    txnID : "",
    date : "",
    fromAcc : "",
    toAcc : "",
    accName : "Test Name",
    amount : "",
    fee : ""
  }
  toAccName;
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
  getToAccName(accountID){
    return this.http.get('http://localhost:8091/v1/v1/callRestApiController/getCustomerName?accountID='+accountID).toPromise()
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
          let txnID = res.json().TxnID;
          this.http.get('http://localhost:8091/v1/v1/callRestApiController/getTransactionDetail?txnID='+txnID).toPromise().then(res=>{
            let detail = res.json();
            this.slip.amount = detail.NetAmount;
            this.slip.date = detail.CreateDTM;
            this.slip.fee = detail.FeeAmount;
            this.slip.fromAcc = detail.SendAccountID;
            this.slip.toAcc = detail.ReceiveAccountID;
            this.slip.txnID = detail.TxnID;
            this.slip.accName = this.toAccName;
          })
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
  promptpayTransfer(promptpayDetail){
    let accountDetail = this.userService.accountDetail;
    console.log(promptpayDetail)
    let net = (+promptpayDetail.fee)+(+promptpayDetail.amount);
    console.log(net)
    let bodyInsert = JSON.stringify({
      TxnType : "S",
      TxnState : "Process",
      TxnNote : "test transfer",
      FeeAmount : promptpayDetail.fee,
      SubmitAmount : promptpayDetail.amount,
      NetAmount : net,
      SendBankCode : "002",
      SendAccountID : promptpayDetail.fromAcc,
      ReceiveBankCode : promptpayDetail.toBankCode,
      ReceiveAccountID : promptpayDetail.toAcc,
      AIPID : promptpayDetail.AIPID
    });
    let bodyInsertReceiver = JSON.stringify({
      TxnType : "R",
      TxnState : "Complete",
      TxnNote : "test transfer",
      FeeAmount : 0,
      SubmitAmount : promptpayDetail.amount,
      NetAmount :  promptpayDetail.amount,
      SendBankCode : "002",
      SendAccountID : promptpayDetail.fromAcc,
      ReceiveBankCode : promptpayDetail.toBankCode,
      ReceiveAccountID : promptpayDetail.toAcc,
      AIPID : promptpayDetail.AIPID
    });
    let bodyTransfer = JSON.stringify({
      IDType : promptpayDetail.toIDType,
      IDValue : promptpayDetail.toIDValue,
      Amount : promptpayDetail.amount
    })
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    //first insert txn for sender
    this.http.post('http://localhost:8091/v1/v1/callRestApiController/insertPromptPayTxn',bodyInsert,options).toPromise().then(res=>{
      let id = res.json()
      let senderTxnID = id.TxnID;   
      this.http.post('http://localhost:8091/v1/v1/callRestApiController/transfer',bodyTransfer,options).toPromise().then((res=>{
        console.log(res.json());
        //update TxnState sender Txn
        console.log('id = '+senderTxnID);
          this.http.post('http://localhost:8091/v1/v1/callRestApiController/updateTxnState?txnID='+senderTxnID,null).toPromise()
        //create complete receiver Txn

          // this.http.post('http://localhost:8091/v1/v1/callRestApiController/insertPromptPayTxn',bodyInsertReceiver,options).toPromise()
          // console.log("transfer success") //transfer success       
          this.http.get('http://localhost:8091/v1/v1/callRestApiController/getTransactionDetail?txnID='+senderTxnID).toPromise().then(res=>{
            let detail = res.json();
            this.slipPP.amount = detail.SubmitAmount;
            this.slipPP.date = detail.CreateDTM;
            this.slipPP.fee = detail.FeeAmount;
            this.slipPP.fromAcc = detail.SendAccountID;
            this.slipPP.toAcc = detail.ReceiveAccountID;
            this.slipPP.txnID = detail.TxnID;
            this.slipPP.accName = promptpayDetail.accName;
            console.log(this.slipPP)
          })
          this.http.get('http://localhost:8091/v1/v1/callRestApiController/updateLatestAmount?accountID='+promptpayDetail.fromAcc).subscribe(res=>{
            if(res.status == 200){
              let latestAmount = res.json();
              console.log(latestAmount)
              for (var key in accountDetail) {
                if (
                  accountDetail.hasOwnProperty(key) &&
                  accountDetail[key].accountID == promptpayDetail.fromAcc
                ) {
                  accountDetail[key].balanceAmount = latestAmount; //update latest amount for sender account
                }
              }
            }
          })
      
        }))

    })
  }
  getPromptPayDetail(idType,idValue){
    return this.http.get('http://localhost:8091/v1/v1/callRestApiController/getPromptPayDetail?type='+idType+'&value='+idValue).toPromise()
  }

  registerPromptPay(resultSet){
    let body = {
      IDType : resultSet.idType,
      IDValue : resultSet.idValue,
      BankCode : resultSet.bankCode,
      AccountID : resultSet.accNumber,
      AccountName : resultSet.accName
    }
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers});
    return this.http.post('http://localhost:8091/v1/v1/callRestApiController/postRegisterPromppay',body,options).toPromise();
  }
  deletePromptPay(idType,idValue){
    return this.http.post('http://localhost:8091/v1/v1/callRestApiController/deletePromptPay?type='+idType+'&value='+idValue,null).toPromise();
  }
  getRecentTransaction(accountID){
    return this.http.get('http://localhost:8091/v1/v1/callRestApiController/selectRecentTransaction?accountID='+accountID).toPromise();
  }
}
