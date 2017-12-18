import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { AuthHttp } from '../classes/auth-http'

import { Observable } from 'rxjs/Observable'
import { User } from '../classes/user'

@Injectable()
export class UserService {

  authHttp: AuthHttp
  current_user: any

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getUsers(): Promise<User[]> {
    var response = this.authHttp.get(environment.apiRoot + "profiles/" )
      .map(response => <[User]> response.json())

    var userPromise: Promise<[User]> = response.toPromise();
    return userPromise;
  }

  getUserbyID(id: string): Observable<User> {
    var response = this.authHttp.get(environment.apiRoot + "profiles/" + id)
      .map(response => <User> response.json())
    return response;
  }

  updateUser(id: string, request: any): Observable<User> {
    var response = this.authHttp.put(environment.apiRoot + "profiles/" + id, request)
      .map(response => <User> response.json())
    return response;
  }

  updatePw(id: string, request: any) {
    var response = this.authHttp.postNoJson(environment.apiRoot + "auth/resetPw/" + id, request)
      .map(response => { console.log("non json response", response); return response.json()});
    return response;
  }


  getUserIdByEmail(email: string){
    var response = this.authHttp.get(environment.apiRoot + "profiles/email/" + email)
      .map(response => response.json())
    return response;
  }

  registerUser(request: any){
    console.log("Register User Service initiated");
    var response = this.authHttp.postNoJson(environment.apiRoot + "register/", request)
      .map(response => { console.log("non json response", response); return response.json()});
    return response;
  }

  toggleUserPublic(id: string): Observable<User> {
    var response = this.authHttp.get(environment.apiRoot + "profiles/" + id + "/public")
      .map(response => <User> response.json());
    return response;
  }

  deleteUser(id: string): Observable<any> {
    var response = this.authHttp.delete(environment.apiRoot + "profiles/" + id)
      .map(response => <User> JSON.parse(JSON.stringify(response)));
    return response;
  }



  // createUser(id: string): Observable<User> {
  //
  // }

}
