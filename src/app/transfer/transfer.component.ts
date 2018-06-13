import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  private promptpayForm : FormGroup
  private accountForm : FormGroup
  hideAcc = true;
  constructor(private fb: FormBuilder,private router: Router) { }

  ngOnInit() {
    this.promptpayForm = this.fb.group({
      fromAcc : [this.accountList[0]],
      toAcc : ['XXXXXXXXXX'],
      toAccName : ['Destination User'],
      toIDType : ['mobile'],
      toIDValue : ['',[Validators.required,Validators.pattern("^([0-9]{10})|([0-9]{13})$")]], //mobile no. length 10 only
      amount : ['',[Validators.required,Validators.pattern("^((?!0+$)\\d+)(\\.\\d{1,2})?$")]] //^((?!0+$)\d+)(\.\d{1,2})?$
    })
    this.accountForm = this.fb.group({
      fromAcc : [this.accountList[0]],
      toAcc : [''],
      toAccName : ['Destination User'],
      amount : ['',[Validators.required,Validators.pattern("^((?!0+$)\\d+)(\\.\\d{1,2})?$")]] //^((?!0+$)\d+)(\.\d{1,2})?$
    })
    this.onChangesPromptPay();
  }
  onChangesPromptPay(){
    const change = this.promptpayForm.controls['toIDType'].valueChanges
    change.subscribe(idType => {
      if(idType == 'mobile'){
        this.promptpayForm.controls['toIDValue'].setValidators([Validators.required,Validators.pattern("^([0-9]{10})$")])
        this.promptpayForm.controls['toIDValue'].updateValueAndValidity()
      }
      if(idType == 'citizen'){
        this.promptpayForm.controls['toIDValue'].setValidators([Validators.required,Validators.pattern("^([0-9]{13})$")])
        this.promptpayForm.controls['toIDValue'].updateValueAndValidity()
      }
    })
  }
  // 1. get data from form
  // 2. validate and verify then put in payload
  // 3. fire service and update database
  changeHideAcc(){
    console.log('change hideAcc')
    this.hideAcc = !this.hideAcc;
  }
  proceedTransferPromptPay(){
    this.promptpayForm.reset({
      fromAcc : this.accountList[0],
      toAcc : 'XXXXXXXXXX',
      toAccName : 'Destination User',
      toIDType : 'mobile',
      toIDValue : '',
      amount : ''
    });
  }
  proceedTransferAccount(){
    this.accountForm.reset({
      fromAcc : this.accountList[0],
      toAcc : '',
      toAccName : 'Destination User',
      amount : ''
    })
  }
  signout(){
    this.router.navigate([''])
  }
}
