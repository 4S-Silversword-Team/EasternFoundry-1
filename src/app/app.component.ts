import { Component, OnInit, NgZone } from '@angular/core';
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

  constructor(
    private auth: AuthService,
    private zone: NgZone
  ){
    this.signedIn = this.auth.isLoggedIn()

  }

  ngOnInit() {
  }

  navLogOut() {
    this.auth.doLogout()
    this.signedIn = this.auth.isLoggedIn()
  }

  navRefresh() {
    console.log("1",this.signedIn)
    this.signedIn = this.auth.isLoggedIn()
    console.log("2",this.signedIn)
    this.zone.run(() => console.log("refresshing"))
  }

}
