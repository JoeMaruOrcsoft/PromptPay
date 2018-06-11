import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { TestServiceService } from './test-service.service'
import { HttpClientModule } from '@angular/common/http'; 
import { HttpModule } from '@angular/http';
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { TransferComponent } from './transfer/transfer.component';

const appRoute :Routes = [
  {path: '',component: LoginComponent},
  {path:'transfer',component: TransferComponent },
  {path:'account',component: AccountComponent},
  {path:'promptpay',component:HomeComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AccountComponent,
    TransferComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoute),
    FormsModule,
    HttpClientModule,
    HttpModule
  ],
  exports:[RouterModule],
  providers: [TestServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
