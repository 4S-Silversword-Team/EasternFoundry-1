import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { AuthHttp } from '../classes/auth-http'

import { Observable } from 'rxjs/Observable'
import { Token } from '../classes/token'

@Injectable()
export class TokenService {

  authHttp: AuthHttp

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getTokenByID(id: string): Observable<Token> {
    var response =  this.authHttp.get(environment.apiRoot + "tokens/" + id)
    .map(response => <Token> response.json());
    return response;
  }

  getTokenByHash(hash: string){
    var response = this.authHttp.get(environment.apiRoot + "tokens/hash/" + hash)
      .map(response => response.json())
    return response;
  }

  createToken(request: any): Observable<Token> {
    var response = this.authHttp.post(environment.apiRoot + "tokens/add", request)
      .map(response => <Token> JSON.parse(JSON.stringify(response)));
    return response;
  }

  deleteToken(id: string): Observable<any> {
    var response = this.authHttp.delete(environment.apiRoot + "tokens/" + id)
      .map(response => <Token> JSON.parse(JSON.stringify(response)));
    return response;
  }

}
