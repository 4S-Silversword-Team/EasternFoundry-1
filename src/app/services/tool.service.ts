import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { AuthHttp } from '../classes/auth-http'

import { Observable } from 'rxjs/Observable'
import { Tool } from '../classes/tool'

@Injectable()
export class ToolService {

  authHttp: AuthHttp

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getToolbyID(id: string): Observable<Tool> {
    var response =  this.authHttp.get(environment.apiRoot + "tools/" + id)
    .map(response => <Tool> response.json());
    return response;
  }

  updateTool(id: string, request: any): Observable<Tool> {
    var response = this.authHttp.put(environment.apiRoot + "tools/" + id, request)
      .map(response => <Tool> response.json());
    return response;
  }

  createTool(request: any): Observable<Tool> {
    var response = this.authHttp.post(environment.apiRoot + "tools/add", request)
      .map(response => <Tool> JSON.parse(JSON.stringify(response)));
    return response;
  }
}
