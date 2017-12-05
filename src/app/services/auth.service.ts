import { Inject ,Injectable } from '@angular/core'
import { Http, Response, RequestOptions, RequestOptionsArgs, Headers } from '@angular/http'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable'

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/toPromise'

import { environment } from '../../environments/environment'

import { AuthHttp } from '../classes/auth-http'
import { User } from '../classes/user'
import { UserService } from '../services/user.service'

@Injectable()
export class AuthService {

  loginResponse: {
    id: string,
    ttl: number,
    created: string,
    userId: string
  }

  authHttp: AuthHttp
  public current_user

  constructor(
    private http:Http,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private userService: UserService,
  ) {
    this.authHttp = new AuthHttp(http)

    //This should not be here because it is called anytime auth service is invoked: i.e. it redirects at inappropriate times
    // // check if the user is logged or if token is expired. If true then login
    // if (!this.isLoggedIn()) {
    //   this.router.navigateByUrl("/login")
    // } else { // else if already logged in go to corporate profile page
    //   this.router.navigateByUrl("/companies")
    // }
  }

  doLogin(email, password, callback) {
    let body = {
      email: email,
      password: password
    }
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    //get User Id from email
    var userId
    this.userService.getUserIdByEmail(body.email).toPromise().then((user) => {
      if (user.id) {

      userId = user.id
      this.http.post(environment.apiRoot + "auth/login/" + userId , body, options).toPromise()
      .then(res => {
        var time = new Date()
        var expTime = '' + ((time.getTime() / 1000) + 60*60*168 )
        localStorage.setItem('expTime', expTime)
        localStorage.setItem('uid', user.id)//this sets a current user just for submitting a valid email, this could introduce security issues we should be mindful of addressing.
        this.current_user = user.id
        console.log("CU", this.current_user)

        this.extractData(res);

        callback()} )
      .catch(err => {this.handleErrorPromise(err); callback();});
    } else {
      callback();
    }
    })
  }

  private extractData(res: Response) {
  	let body = res.json();
    console.log(body)
    localStorage.setItem('token', body.message) //TODO: ideally in the future, we should look into finding more secure ways to handle tokens than local storage
  }
  private handleErrorObservable (error: Response | any) {
  	console.error(error.message || error);
	  return Observable.throw(error.message || error);
  }
  private handleErrorPromise (error: Response | any) {
	  console.error(error.message || error);
	  return Promise.reject(error.message || error);
  }

  doLogout() {
    localStorage.clear()
    this.current_user = null;
  }

   isLoggedIn() {
    // var userId = this.getLoggedInUser()
    // var returnVal
    // await this.userService.getUserbyID(userId).toPromise().then(async (user) => {
    //   var body = {
    //     token: localStorage.getItem("token"),
    //     email: user.primaryEmail
    //   }
    //   await this.http.post(environment.apiRoot + "auth/verify/" + userId , body).toPromise().then(async (res) => {
    //     console.log("in isLoggedIn promise")
    //     await res.status === 200 ? returnVal = true: returnVal = false
    //   })
    // }).catch(reason => {
    //   console.log(reason)
    //   console.log("Can't reach back end - determining status from local token: " + (localStorage.getItem('token') != null))
    //   return (localStorage.getItem('token') != null)
    // })
    // if (returnVal != undefined) {
    //   console.log("logged in return val is: ", returnVal)
    //   return returnVal
    // }
    var time = new Date()
    // console.log(time.getTime() / 1000)
    // console.log((time.getTime() / 1000) + 60*60*168 )
    if ((time.getTime() / 1000) >= parseInt(localStorage.getItem('expTime')) || !localStorage.getTime('expTime')) {
      this.doLogout()
    }
    return (localStorage.getItem('token') != null && localStorage.getItem('uid') != null)
  }

  getLoggedInUser() {
    return localStorage.getItem('uid'); //TODO: Another way to go about this. Pass token to a getUserIdByToken function to the backend. If respone doesn't eql localstorage uid, doLogout. Else return uid.
  }
}
