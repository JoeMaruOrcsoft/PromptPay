import { Component, OnInit } from '@angular/core';
import { BankService } from '../bank.service';
import { Response} from '@angular/http'
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  accountList = [1111111111,2222222222]
  resultSet = {
    accNumber : this.accountList[0],
    bankCode : "002",
    idType : "mobile",
    idValue : "",
    accName : "testUser"
  }
  deleteSet = {
    idType : "mobile",
    idValue: "",
    accNumber : "",
    accName : "testUser"
  }
  
  private resultForm : FormGroup
  private deleteForm : FormGroup
  constructor(private router: Router,private bankService : BankService,private fb: FormBuilder) { }
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
 
  callPostService(){
    this.bankService.register().then((response)=>{
      console.log('post success');
    });
  }
  callGetService(type,value){
    this.bankService.getData(type,value).then((response)=>{
      const res = response.json();
      console.log(res);
    });
  }
  signout(){
    this.router.navigate([''])
  }
  

}
