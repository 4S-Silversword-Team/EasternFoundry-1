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
  new: boolean = false
  activeTab: number = 0
  signedIn: boolean = false
  currentUser: string


  constructor(
    private auth: AuthService,
    private router: Router,
    private nav: AppComponent
  ) {
      if (this.router.url == '/login/new') {
        this.new = true
      }
      if (auth.isLoggedIn()) {
        this.signedIn = true
        this.currentUser = localStorage.getItem('uid')
      }
    }

  ngOnInit() {
  }

  switchTab(t) {
    this.activeTab = t
  }

  logIn() {
    this.authError = false
    this.auth.doLogin(this.email.toLowerCase(), this.password, (function() {
      //this.authError = !this.auth.isLoggedIn()
      if (!this.auth.isLoggedIn()) {
        this.authError = true
      } else {
        if (!this.authError){
          //this.currentUser = this.auth.current_user  //TODO: find out why this doesn't work
          this.currentUser = localStorage.getItem('uid')
          this.nav.navRefresh();
          this.router.navigateByUrl("/user-profile/" + this.currentUser)
        }
      }
    }).bind(this))

  }

  navLogOut() {
    this.auth.doLogout()
    // if (this.auth.isLoggedIn()) {
    //   console.log('this thinks youre logged in!')
    //   this.signedIn = true
    // } else {
    //   this.signedIn = false
    // }
    // if (!this.signedIn) {
    //   localStorage.removeItem('token');
    //   localStorage.removeItem('uid');
    //   this.currentUser = null
    // }
    // let myCallback = () => {
    //   this.currentUser = localStorage.getItem('uid')
    // }
  }
}
