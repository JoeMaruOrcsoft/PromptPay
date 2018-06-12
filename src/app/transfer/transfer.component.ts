import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    amount : "",
    fee : "2.00 Bahts",
    accName : "Destination User"
  }
  promptpayTransfer = {
    fromAcc : this.accountList[0],
    toIDType : "mobile",
    toIDValue : "",
    amount: "",
    fee : "2.00 Bahts",
    accName : "Destination User"
  }
  private promptpayForm : FormGroup
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.promptpayForm = this.fb.group({
      fromAcc : [this.accountList[0]],
      toIDType : ['mobile'],
      toIDValue : ['',[Validators.required]],
      amount : ['',[Validators.required,Validators.pattern("^((?!0+$)\\d+)(\\.\\d{1,2})?$")]] //^((?!0+$)\d+)(\.\d{1,2})?$
    })
  }

}
