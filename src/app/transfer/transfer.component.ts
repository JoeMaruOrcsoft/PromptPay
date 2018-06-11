import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  accountList = [111111111111,222222222222]
  accountTransfer = {
    fromAcc : this.accountList[0],
    toAcc : "",
    amount : ""
  }
  promptpayTransfer = {
    fromAcc : this.accountList[0],
    toIDType : "mobile",
    toIDValue : "",
    amount: ""
  }
  constructor() { }

  ngOnInit() {
  }

}
