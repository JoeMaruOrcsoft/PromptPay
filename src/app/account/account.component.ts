import { BankService } from './../bank.service';
import { UserService } from './../user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  account;
  recentTxn = [];
  isClick = false;
  isClick2 = false;
  constructor(private router: Router,private userService : UserService,private bankService:BankService) { }

  ngOnInit() {
    this.account = this.userService.accountDetail
    console.log(this.account)
    this.bankService.initAccountIDList();
    this.account.forEach((item,index)=>{
      this.getRecentTransaction(this.account[index].accountID,index);
    })
    
  }
  getRecentTransaction(accountID,id){
    this.bankService.getRecentTransaction(accountID).then(res=>{
      this.recentTxn[id] = res.json(); 
      console.log(this.recentTxn[id])
    })
  }
  changeArrow2(){
    this.isClick2 = !this.isClick2;
  }
  changeArrow(){
    this.isClick = !this.isClick;
  }
  signout(){
    this.router.navigate([''])
  }

}
