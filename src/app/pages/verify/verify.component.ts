import {Component, OnInit, AfterViewInit, Directive, ViewChild} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../../classes/user';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { TokenService } from '../../services/token.service';

import {AppComponent} from '../../app.component'

declare var $: any;

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
  providers: [ UserService, AuthService, TokenService ],
})

// @Directive({
//
// })

export class VerifyComponent implements OnInit {

    @ViewChild('fileInput') fileInput;

  userParam = {
    username: '',
    password: ''
  };
  password2 = ''
  paramsError:string = ""
  registerInProcess: boolean = false
  registerFailed: boolean = false
  email = {
    inUse: false,
    address: ''
  }
  token: any
  tokenInvalid: boolean
  promiseFinished: boolean

  customTrackBy(index: number, obj: any): any {
    return  index;
  }
  constructor(
    private auth: AuthService,
    private nav: AppComponent,
    private userService: UserService,
    private tokenService: TokenService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
  ) {
    this.tokenService.getTokenByHash(this.route.snapshot.params['hash']).toPromise().then((res) => {
      this.token = res
      if (!this.token.reset) {
        var time = new Date()
        if (+(time.getTime() / 1000) <= +this.token.expTime) {
          console.log('i think this will work')
          this.userService.getUserbyID(this.token.userId).toPromise().then((res) => {
            var user = res
            user.verified = true
            this.userService.updateUser(this.token.userId, user).toPromise().then((res) => {
              this.tokenService.deleteToken(this.token._id).toPromise().then((res) => {
                console.log('I THINK THE TOKEN IS GONE, NOW LETS SEND YOU AWAYYYYY')
                if (auth.isLoggedIn() && this.auth.getLoggedInUser() === user._id) {
                  this.router.navigate(['user-profile', user._id]);
                } else {
                  this.router.navigateByUrl("/login")
                }
              })
            })
          })
        } else {
          this.tokenInvalid = true
        }
        this.promiseFinished = true
      } else {
        this.tokenInvalid = true
      }
    }).catch(err => {
      this.tokenInvalid = true
      this.promiseFinished = true
    });

  }

  ngOnInit() {
  }


}
