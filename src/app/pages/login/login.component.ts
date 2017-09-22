import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params } from '@angular/router'
import {AppComponent} from '../../app.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService, UserService]
})
export class LoginComponent implements OnInit {

  authError: boolean = false
  email: string
  password: string


  constructor(
    private auth: AuthService,
    private router: Router,
    private nav: AppComponent
  ) { }

  ngOnInit() {
  }

  logIn() {
    this.auth.doLogin(this.email.toLowerCase(), this.password, (function() {
      //this.authError = !this.auth.isLoggedIn()
      this.auth.isLoggedIn().then(res => { this.authError = !res; myCallback() }).catch(reason => {this.authError = true; myCallback()})
      let myCallback = () => {
        if (!this.authError){
          this.nav.navRefresh();
          //this.currentUser = this.auth.current_user  //TODO: find out why this doesn't work
          this.currentUser = localStorage.getItem('uid')
          this.router.navigateByUrl("/user-profile/" + this.currentUser)
        }
      }
    }).bind(this))

  }
}
