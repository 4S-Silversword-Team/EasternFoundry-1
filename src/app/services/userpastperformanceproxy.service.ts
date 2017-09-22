import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { Observable } from 'rxjs/Observable'
import { UserPastPerformanceProxy } from '../classes/user-pp-proxy'
import {AuthHttp} from '../classes/auth-http'

@Injectable()
export class UserPastPerformanceProxyService {
  authHttp: AuthHttp

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getUserPPProxies(): Promise<UserPastPerformanceProxy[]> {
    var response = this.authHttp.get(environment.apiRoot + "userpastperformanceproxy/" )
    .map(response => <[UserPastPerformanceProxy]> response.json())

    var promise: Promise<[UserPastPerformanceProxy]> = response.toPromise();
    return promise
  }

  getUserPPProxiesByID(id: string): Observable<UserPastPerformanceProxy> {
    var response = this.authHttp.get(environment.apiRoot + "userpastperformanceproxy/" + id)
      .map(response => <UserPastPerformanceProxy> response.json())
    return response;
  }

  updateUserPPProxies(id: string, request: any): Observable<UserPastPerformanceProxy> {
    var response = this.authHttp.put(environment.apiRoot + "userpastperformanceproxy/" + id, request)
    .map(response => <UserPastPerformanceProxy> response.json())
    return response;
  }
  addUserPPProxy(request: any): Promise<Response> {
    return this.authHttp.post(environment.apiRoot + "userpastperformanceproxy/add", request).toPromise();
  }
  deleteUserPPProxy(id: string): Promise<Response> {
    return this.authHttp.delete(environment.apiRoot + "userpastperformanceproxy/" + id).toPromise();
  }
}
