import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service'
import { UserService } from './services/user.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService, UserService]
})
export class AppComponent implements OnInit {

  signedIn: boolean = false;
  currentUser: any = null;

  constructor(
    private auth: AuthService,
  ){
    this.auth.isLoggedIn().then(res => { console.log("Navbar checkin login status", res); this.signedIn = res; myCallback() }).catch(reason => { this.signedIn = false; localStorage.removeItem('uid'); this.currentUser = null })

    let myCallback = () => {
      //this.currentUser = this.auth.current_user  //TODO: find out why this doesn't work
      this.currentUser = localStorage.getItem('uid')
    }

  }

  ngOnInit() {
  }

  navLogOut() {
    this.auth.doLogout()
    this.auth.isLoggedIn().then(res => { console.log("Navbar checkin logout status. signedIn: ", res); this.signedIn = res; myCallback() }).catch(reason => { this.signedIn = false; localStorage.removeItem('uid'); this.currentUser = null })
    let myCallback = () => {
      this.currentUser = localStorage.getItem('uid')
    }
  }

  navRefresh() {
    this.auth.isLoggedIn().then(res => { console.log("Navbar refreshing: signedIn: ", res); this.signedIn = res; myCallback() }).catch(reason => { this.signedIn = false; localStorage.removeItem('uid'); this.currentUser = null })
    let myCallback = () => {
      this.currentUser = localStorage.getItem('uid')
    }
  }

}
