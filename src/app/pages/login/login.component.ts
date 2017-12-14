import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { Router, ActivatedRoute, Params } from '@angular/router'
import {AppComponent} from '../../app.component'
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService, UserService, AppService, TokenService]
})
export class LoginComponent implements OnInit {

  authError: boolean = false
  email: string
  password: string = ''
  new: boolean = false
  activeTab: number = 0
  signedIn: boolean = false
  currentUser: string
  forgotPassword = false
  passwordReset = false
  passwordSent = false
  passwordToken: any
  tokenInvalid = false
  password2: string = ''
  promiseFinished = false

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private appService: AppService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    private nav: AppComponent
  ) {
      if (this.router.url.startsWith('/password-reset')) {
        this.passwordReset = true
        this.tokenService.getTokenByHash(this.route.snapshot.params['hash']).toPromise().then((res) => {
          this.passwordToken = res
          var time = new Date()
          if (+(time.getTime() / 1000) <= +this.passwordToken.expTime) {
            console.log('i think this will work')
          } else {
            this.tokenInvalid = true
          }
          this.promiseFinished = true
        }).catch(err => {
          this.tokenInvalid = true
          this.promiseFinished = true
        });
      }
      else {
        console.log(this.router.url)
        if (this.router.url == '/login/new') {
          this.new = true
        }
        if (auth.isLoggedIn()) {
          this.signedIn = true
          this.currentUser = localStorage.getItem('uid')
        }
      }
    }

  ngOnInit() {
  }

  switchTab(t) {
    this.activeTab = t
  }

  invalidEmail() {
    return (this.email.length > 0 && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)))
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
          console.log(this.currentUser)
          this.router.navigateByUrl("/user-profile/" + this.currentUser)
        }
      }
    }).bind(this))
  }

  resetPassword(){
    var time = new Date()
    var expTime = '' + ((time.getTime() / 1000) + 60*60*24 )
    var resetHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    this.userService.getUserIdByEmail(this.email).toPromise().then((res) => {
      var user = res
      var token = {
        userId: user.id,
        userEmail: this.email,
        expTime: expTime,
        hash: resetHash
      }
      this.tokenService.createToken(token).toPromise().then((res) => {
        var resetLink = "http://13.58.193.226:4200/password-reset/" + resetHash
        // var resetLink = "http://localhost:4200/password-reset/" + resetHash
        var mail = ({
          senderEmail: 'federalfoundryforge@gmail.com',
          recipientEmail: this.email,
          subject: 'Your Password Reset',
          contactMessage: 'We recently received a password reset request for your Federal Foundry Forge profile. If you requested this reset, copy and paste the link below into your browser: \n \n ' + resetLink + ' \n \n If not, you can ignore this message.',
          contactHTML: '<p>We recently received a password reset request for your Federal Foundry Forge profile. If you requested this reset, <a href="' + resetLink + '">click here to assign a new password</a>. If not, you can ignore this message.</p>'
        });

        this.appService.sendEmail(mail).toPromise().then((res) => {
          console.log('email sent i think! check!')
          this.passwordSent = true
        })
      })
    })
  }

  changePassword(password, token) {
    // console.log(JSON.stringify(token))
    var pass = {
      email: token.userEmail,
      password: password
    }
    this.userService.updatePw(token.userId, pass).toPromise().then((res) => {
      console.log('I THINK IT DID THE PASSWORD CHANGE')
      this.tokenService.deleteToken(this.passwordToken._id).toPromise().then((res) => {
        console.log('I THINK THE TOKEN IS GONE, NOW LETS SEND YOU AWAYYYYY')
        this.router.navigateByUrl("/")
      })
    })
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
