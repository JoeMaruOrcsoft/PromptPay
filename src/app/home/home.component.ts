import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { BankService } from '../bank.service';
import { HttpErrorResponse} from '@angular/common/http'
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  accountList = this.bankService.accountList;
  resultSet = {
    accNumber : this.accountList[0],
    bankCode : "002",
    idType : "mobile",
    idValue : "",
    accName : this.userService.accountDetail[0].name
  }
  deleteSet = {
    idType : "mobile",
    idValue: "",
    accNumber : this.accountList[0],
    accName : this.userService.accountDetail[0].name
  }
  
  private resultForm : FormGroup
  private deleteForm : FormGroup

  exist = false;
  registerSuccess = false;
  getError = false;
  deleteError = false;
  deleteSuccess = false
  
  constructor(private router: Router,private bankService : BankService,private fb: FormBuilder,private userService : UserService) { }
  ngOnInit() {
    this.resultForm = this.fb.group({
      accNumber : [this.accountList[0]],
      idType : ['mobile'],
      idValue : ['',[Validators.required,Validators.pattern("^([0-9]{10})$")]]
    })
    this.deleteForm = this.fb.group({
      idType : ['mobile'],
      idValue : ['',[Validators.required,Validators.pattern("^([0-9]{10})$")]]
    })
    this.onChangesResult();
    this.onChangesDelete();
  }
  onChangesResult(){
    const change = this.resultForm.controls['idType'].valueChanges
    change.subscribe(idType => {
      if(idType == 'mobile'){
        this.resultForm.controls['idValue'].setValidators([Validators.required,Validators.pattern("^([0-9]{10})$")])
        this.resultForm.controls['idValue'].updateValueAndValidity()
      }
      if(idType == 'citizen'){
        this.resultForm.controls['idValue'].setValidators([Validators.required,Validators.pattern("^([0-9]{13})$")])
        this.resultForm.controls['idValue'].updateValueAndValidity()
      }
    })
  }
  onChangesDelete(){
    const change = this.deleteForm.controls['idType'].valueChanges
    change.subscribe(idType => {
      if(idType == 'mobile'){
        this.deleteForm.controls['idValue'].setValidators([Validators.required,Validators.pattern("^([0-9]{10})$")])
        this.deleteForm.controls['idValue'].updateValueAndValidity()
      }
      if(idType == 'citizen'){
        this.deleteForm.controls['idValue'].setValidators([Validators.required,Validators.pattern("^([0-9]{13})$")])
        this.deleteForm.controls['idValue'].updateValueAndValidity()
      }
    })
  }
  resetRegisterDiv(){
    this.registerSuccess = false;
    this.exist = false;
  }
  resetDeleteDiv(){
    this.deleteError = false;
    this.getError = false;
    this.deleteSuccess = false;
  }
  register(){
    this.resultSet.idType = this.resultForm.controls['idType'].value;
    this.resultSet.idValue = this.resultForm.controls['idValue'].value;
    this.resultSet.accNumber = this.resultForm.controls['accNumber'].value
    this.bankService.registerPromptPay(this.resultSet).then(()=>{
      //show success alert
      this.registerSuccess = true;
      this.resultForm.reset({
        accNumber : this.accountList[0],
        idType : "mobile",
        idValue : ""
      })
    }).catch((error)=>{
      // show fail alert
      console.log(error);
      this.exist = true;
    })
  }
  delete(){
    this.deleteSet.idType = this.deleteForm.controls['idType'].value;
    this.deleteSet.idValue = this.deleteForm.controls['idValue'].value;
    this.bankService.deletePromptPay(this.deleteSet.idType,this.deleteSet.idValue).then(res=>{
      //show success alert
      this.deleteSuccess = true;
      this.deleteForm.reset({
        idType : "mobile",
        idValue : ""
      })
    }).catch((error:HttpErrorResponse)=>{
      //error in get AIP process
      if(error.status == 400){
        this.getError = true;
      }else if(error.status == 404){
        this.deleteError = true;
      }
    })
  }
 
  signout(){
    this.router.navigate([''])
  }
  

}
