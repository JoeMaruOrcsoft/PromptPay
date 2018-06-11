import { Component, OnInit } from '@angular/core';
import { BankService } from '../bank.service';
import { Response} from '@angular/http'
import { Router } from '@angular/router';

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
    accNumber : this.accountList[0],
    bankCode : "002",
    idType : "mobile",
    idValue: "",
    accName : "testUser"
  }
 
  constructor(private router: Router,private bankService : BankService) { }
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
  ngOnInit() {
  }

}
