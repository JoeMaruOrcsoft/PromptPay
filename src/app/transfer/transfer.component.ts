import { BankService } from "./../bank.service";
import { UserService } from "./../user.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-transfer",
  templateUrl: "./transfer.component.html",
  styleUrls: ["./transfer.component.css"]
})
export class TransferComponent implements OnInit {
  accountList;
  accountTransfer = {
    fromAcc: "",
    toAcc: "",
    amount: "",
    fee: "",
    accName: "Destination User"
  };
  promptpayTransfer = {
    fromAcc: "",
    toIDType: "mobile",
    toIDValue: "2222222222",
    amount: "",
    fee: "",
    accName: "Destination User"
  };
  private promptpayForm: FormGroup;
  private accountForm: FormGroup;
  hideAcc = true;
  insufficient = false;
  dontexist = false;
  slip = {
    txnID : "",
    date : "",
    fromAcc : "",
    toAcc : "",
    accName : "Test Name",
    amount : "",
    fee : ""
  };
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private bankService: BankService
  ) {}

  ngOnInit() {
    this.accountList = this.bankService.accountList;
    this.promptpayForm = this.fb.group({
      fromAcc: [this.accountList[0]],
      toAcc: ["XXXXXXXXXX"],
      toAccName: ["Destination User"],
      toIDType: ["mobile"],
      toIDValue: [
        "",
        [Validators.required, Validators.pattern("^([0-9]{10})|([0-9]{13})$")]
      ], //mobile no. length 10 only
      amount: [
        "",
        [
          Validators.required,
          Validators.pattern("^((?!0+$)\\d+)(\\.\\d{1,2})?$")
        ]
      ] //^((?!0+$)\d+)(\.\d{1,2})?$
    });
    this.accountForm = this.fb.group({
      fromAcc: [this.accountList[0]],
      toAcc: [""],
      toAccName: ["Destination User"],
      amount: [
        "",
        [
          Validators.required,
          Validators.pattern("^((?!0+$)\\d+)(\\.\\d{1,2})?$")
        ]
      ] //^((?!0+$)\d+)(\.\d{1,2})?$
    });
    this.onChangesPromptPay();
  }
  onChangesPromptPay() {
    const change = this.promptpayForm.controls["toIDType"].valueChanges;
    change.subscribe(idType => {
      if (idType == "mobile") {
        this.promptpayForm.controls["toIDValue"].setValidators([
          Validators.required,
          Validators.pattern("^([0-9]{10})$")
        ]);
        this.promptpayForm.controls["toIDValue"].updateValueAndValidity();
      }
      if (idType == "citizen") {
        this.promptpayForm.controls["toIDValue"].setValidators([
          Validators.required,
          Validators.pattern("^([0-9]{13})$")
        ]);
        this.promptpayForm.controls["toIDValue"].updateValueAndValidity();
      }
    });
  }
  // 1. get data from form
  // 2. validate and verify then put in payload
  // 3. fire service and update database
  prepareReviewAccount() {
    this.dontexist = false;
    this.insufficient = false;
    this.accountTransfer.fromAcc = this.accountForm.controls["fromAcc"].value;
    this.accountTransfer.toAcc = this.accountForm.controls["toAcc"].value;
    //get destination name using query service
    this.bankService.getToAccName(this.accountTransfer.toAcc).then(res=>{
      this.accountTransfer.accName = res.json().name;
    })
    this.accountTransfer.amount = this.accountForm.controls["amount"].value;
    this.accountTransfer.fee = "0";
    //check destination account
    let exist;
    this.bankService.checkDesAccount(this.accountTransfer.toAcc).then(res => {
      exist = res.json();
      console.log(exist);
      //check balance
      let accountDetail = this.userService.accountDetail;
      let accountBalance;
      for (var key in accountDetail) {
        if (
          accountDetail.hasOwnProperty(key) &&
          accountDetail[key].accountID == this.accountTransfer.fromAcc
        ) {
          accountBalance = accountDetail[key].balanceAmount;
        }
      }
      console.log("exist is " + exist);
      if (exist == false || +this.accountTransfer.amount > +accountBalance) {
        if (exist == false) {
          console.log("exist came here");
          //trigger des not found modal
          this.dontexist = true;

        }
        if (+this.accountTransfer.amount > +accountBalance) {
          //trigger inadequate balance
          this.insufficient = true;

        }
      } else if (+this.accountTransfer.amount <= +accountBalance) {
        //trigger review modal
        console.log("change hideAcc");

        this.hideAcc = !this.hideAcc;
        this.slip = this.bankService.slip;
        console.log('accname is '+this.accountTransfer.accName)
        this.openModal("openConfirmAccount");
      }
    });
  }
  prepareReviewPromptpay() {}
  openModal(type) {
    document.getElementById(type).click();
  }
  proceedTransferPromptPay() {
    this.promptpayForm.reset({
      fromAcc: this.accountList[0],
      toAcc: "XXXXXXXXXX",
      toAccName: "Destination User",
      toIDType: "mobile",
      toIDValue: "",
      amount: ""
    });
    //if transfer successfully
    //this.openModal();
  }
  proceedTransferAccount() {
    this.bankService.localTransfer(
      this.accountTransfer.fromAcc,
      this.accountTransfer.toAcc,
      +this.accountTransfer.amount
    );
    this.accountForm.reset({
      fromAcc: this.accountList[0],
      toAcc: "",
      toAccName: "Destination User",
      amount: ""
    });
    this.openModal("openSlipAccount")

    //move checking balance fn from bank.service to this section
  }
  testTransfer() {
    this.bankService.checkDesAccount("0023230554");
  }
  signout() {
    this.router.navigate([""]);
  }
}
