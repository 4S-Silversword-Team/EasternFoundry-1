import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { AuthHttp } from '../classes/auth-http'

import { Observable } from 'rxjs/Observable'
import { ResetToken } from '../classes/reset-token'

@Injectable()
export class ResetTokenService {

  authHttp: AuthHttp

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getResetTokenByID(id: string): Observable<ResetToken> {
    var response =  this.authHttp.get(environment.apiRoot + "resettokens/" + id)
    .map(response => <ResetToken> response.json());
    return response;
  }

  getResetTokenByHash(hash: string){
    var response = this.authHttp.get(environment.apiRoot + "resettokens/hash/" + hash)
      .map(response => response.json())
    return response;
  }

  createResetToken(request: any): Observable<ResetToken> {
    var response = this.authHttp.post(environment.apiRoot + "resettokens/add", request)
      .map(response => <ResetToken> JSON.parse(JSON.stringify(response)));
    return response;
  }

  deleteResetToken(id: string): Observable<any> {
    var response = this.authHttp.delete(environment.apiRoot + "resettokens/" + id)
      .map(response => <ResetToken> JSON.parse(JSON.stringify(response)));
    return response;
  }

}
