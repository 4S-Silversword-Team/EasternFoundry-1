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

    // check if the user is logged or if token is expired. If true then login
    if (!this.isLoggedIn()) {
      this.router.navigateByUrl("/login")
    } else { // else if already logged in go to corporate profile page
      this.router.navigateByUrl("/companies")
    }
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
      localStorage.setItem('uid', user.id)
      userId = user.id
      this.http.post(environment.apiRoot + "auth/login/" + userId , body, options).toPromise()
      .then(res => {this.extractData(res); callback()} )
      .catch(this.handleErrorPromise);
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

  doLogout(redirect = null) {
    localStorage.removeItem('token')
  }

  isLoggedIn() {
    //TODO pass localstorage token to backend verifyCurrentUser function : requires a user Id in params, token, and email in request body
    return localStorage.getItem('token') != null
  }
}
