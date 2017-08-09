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
    this.auth.doLogin(this.email, this.password, (function() {
      this.authError = !this.auth.isLoggedIn()
      if (!this.authError){
        this.nav.navRefresh();
        this.router.navigateByUrl("/companies")
      }
    }).bind(this))

  }
}
