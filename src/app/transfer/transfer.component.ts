import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {
  accountList = ["111111111111","222222222222"]
  accountTransfer = {
    fromAcc : "",
    toAcc : "",
    amount : "",
    fee : "2.00 Bahts",
    accName : "Destination User"
  }
  promptpayTransfer = {
    fromAcc : "",
    toIDType : "mobile",
    toIDValue : "2222222222",
    amount: "",
    fee : "2.00 Bahts",
    accName : "Destination User"
  }
  n : number
  private promptpayForm : FormGroup
  private accountForm : FormGroup
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.promptpayForm = this.fb.group({
      fromAcc : [this.accountList[0]],
      toAcc : ['2222222222'],
      toAccName : ['Destination User'],
      toIDType : ['mobile'],
      toIDValue : ['',[Validators.required,Validators.pattern("^([0-9]{9})|([0-9]{13})$")]], //mobile no. length 10 only (excluding first 0)
      amount : ['',[Validators.required,Validators.pattern("^((?!0+$)\\d+)(\\.\\d{1,2})?$")]] //^((?!0+$)\d+)(\.\d{1,2})?$
    })
    this.accountForm = this.fb.group({
      fromAcc : [this.accountList[0]],
      toAcc : ['2222222222'],
      toAccName : ['Destination User'],
      amount : ['',[Validators.required,Validators.pattern("^((?!0+$)\\d+)(\\.\\d{1,2})?$")]] //^((?!0+$)\d+)(\.\d{1,2})?$
    })
  }
  // 1. get data from form
  // 2. validate and verify then put in payload
  // 3. fire service and update database

}
