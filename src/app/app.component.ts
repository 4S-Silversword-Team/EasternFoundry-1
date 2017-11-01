import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service'
import { UserService } from './services/user.service'
import { Router, NavigationEnd } from '@angular/router';
import { Message } from './classes/message'
import { MessageService } from './services/message.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService, UserService, MessageService]
})
export class AppComponent implements OnInit {

  signedIn: boolean = false;
  currentUser: any = null;
  unreadCount: number = 0
  companies: any[] = []
  companyUnreadCount: number = 0
  bugCount: number = 0

  constructor(
    private auth: AuthService,
    private messageService: MessageService,
    private userService: UserService,
    private router: Router,
  ){
    console.log("Navbar checkin login status")
    this.signedIn = auth.isLoggedIn()
    if (!this.signedIn) {
      localStorage.removeItem('token');
      localStorage.removeItem('uid');
      this.currentUser = null
    } else {
      this.currentUser = localStorage.getItem('uid')
      var user
      this.userService.getUserbyID(localStorage.getItem('uid')).toPromise().then((result) => {
        user = result
        this.messageService.getUnread(this.currentUser).toPromise().then((result) => {
          this.unreadCount = result
          console.log(this.unreadCount + ' unread messages')
          var companyPromises = []
          for (let p of user.companyUserProxies) {
            if (p.role && p.role.title == 'admin') {
              companyPromises.push(this.messageService.getUnread(p.company._id).toPromise().then((result) => {
                this.companies.push({
                  id: p.company._id,
                  name: p.company.name,
                  count: result,
                })
              }))
            }
          }
          Promise.all(companyPromises).then(result=>{
            for (let c of this.companies){
              this.companyUnreadCount += c.count
            }
            this.messageService.getUnreadBugReports(this.currentUser).toPromise().then((result) => {
              console.log('its checking')
              this.bugCount=result
            })
          })
        })
      })
    }
  }


  ngOnInit() {
    this.router.events.subscribe((evt) => {
       if (!(evt instanceof NavigationEnd)) {
         return;
       }
       window.scrollTo(0, 0)
     });
  }

  navLogOut() {
    this.auth.doLogout()
    if (this.auth.isLoggedIn()) {
      console.log('this thinks youre logged in!')
      this.signedIn = true
    } else {
      this.signedIn = false
    }
    if (!this.signedIn) {
      localStorage.removeItem('token');
      localStorage.removeItem('uid');
      this.currentUser = null
    }
    let myCallback = () => {
      this.currentUser = localStorage.getItem('uid')
    }
  }

  navRefresh() {
    this.signedIn = this.auth.isLoggedIn()
    if (!this.signedIn) {
      localStorage.removeItem('uid');
      this.currentUser = null
    }
    let myCallback = () => {
      this.currentUser = localStorage.getItem('uid')
    }
  }

}
