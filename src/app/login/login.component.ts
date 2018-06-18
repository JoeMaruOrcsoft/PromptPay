import { UserService} from './../user.service';
import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username;
  password;
 
  constructor(private router : Router,private userService : UserService) { }

  ngOnInit() {
  }

  //check username/password + save username to userService 
  signin(){
    this.userService.login(this.username,this.password).then((res)=>{
      let data = res.json();
      
      console.log(data);
      this.userService.accountDetail = data;
      console.log(this.userService.accountDetail);
      this.router.navigate(['/account']);
      
    }).catch((err)=>{
      if(err.status == 401){
        console.log("error 401");
      }else if(err.status == 500){
        console.log("error 500?")
      }
    })
    

  }
}
