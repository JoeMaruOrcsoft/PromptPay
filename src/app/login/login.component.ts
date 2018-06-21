import { UserService} from './../user.service';
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { markParentViewsForCheckProjectedViews } from '@angular/core/src/view/util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username;
  password;
  showError = false;
  private form :FormGroup;
  constructor(private router : Router,private userService : UserService,private fb: FormBuilder,) { }

  ngOnInit() {
    this.form = this.fb.group({
      user: ['',Validators.required],
      password:['',Validators.required]
    })
  }

  //check username/password + save username to userService 
  signin(){
    this.userService.login(this.form.controls['user'].value,this.form.controls['password'].value).then((res)=>{
      let data = res.json();
      
      console.log(data);
      this.userService.accountDetail = data;
      console.log(this.userService.accountDetail);
      this.router.navigate(['/account']);
      
    }).catch((err)=>{
      if(err.status == 401){
        console.log("error 401");
        this.showError = true;
      }else if(err.status == 500){
        console.log("error 500?");
        this.showError = true;
      }
    })
    

  }
}
