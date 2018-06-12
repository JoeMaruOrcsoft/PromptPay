import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  toggleDetail = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }
  signout(){
    this.router.navigate([''])
  }
  showHideDetail(){
    this.toggleDetail = !this.toggleDetail;
  }
}
