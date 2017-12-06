import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { Observable } from 'rxjs/Observable'
import { Role } from '../classes/role'
import {AuthHttp} from '../classes/auth-http'

@Injectable()
export class RoleService {

  authHttp: AuthHttp

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getRoleByID(id: string): Observable<Role> {
    var response = this.authHttp.get(environment.apiRoot + "role/" + id)
      .map(response => <Role> response.json())
    return response;
  }

  getRoleByTitle(title: string): Observable<Role> {
    var response = this.authHttp.get(environment.apiRoot + "role/title/" + title)
      .map(response => <Role> response.json())
    return response;
  }

  createRole(req: {title: string}): Observable<Role>{
    var response = this.authHttp.post(environment.apiRoot + "role/add", req)
      .map(response => <Role> response.json())
    return response;
  }

}
