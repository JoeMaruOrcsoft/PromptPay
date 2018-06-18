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
  toggleDetail = false;
  toggleDetail2 = false;
  account;

  constructor(private router: Router,private userService : UserService,private bankService:BankService) { }

  ngOnInit() {
    this.account = this.userService.accountDetail
    console.log(this.account)
    this.bankService.initAccountIDList();
  }
  signout(){
    this.router.navigate([''])
  }
  showHideDetail(){
    this.toggleDetail = !this.toggleDetail;
  }
  showHideDetail2(){
    this.toggleDetail2 = !this.toggleDetail2;
  }
}
