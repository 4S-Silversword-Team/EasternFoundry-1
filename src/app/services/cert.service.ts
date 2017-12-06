import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { AuthHttp } from '../classes/auth-http'

import { Observable } from 'rxjs/Observable'
import { Cert } from '../classes/cert'

@Injectable()
export class CertService {

  authHttp: AuthHttp

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getCerts(): Promise<Cert[]> {
    var response = this.authHttp.get(environment.apiRoot + "certs/" )
      .map(response => <[Cert]> response.json())

    var certPromise: Promise<[Cert]> = response.toPromise();
    return certPromise;
  }

  getCertbyID(id: string): Observable<Cert> {
    var response =  this.authHttp.get(environment.apiRoot + "certs/" + id)
    .map(response => <Cert> response.json());
    return response;
  }

  updateCert(id: string, request: any): Observable<Cert> {
    var response = this.authHttp.put(environment.apiRoot + "certs/" + id, request)
      .map(response => <Cert> response.json());
    return response;
  }

  createCert(request: any): Observable<Cert> {
    var response = this.authHttp.post(environment.apiRoot + "certs/add", request)
      .map(response => <Cert> JSON.parse(JSON.stringify(response)));
    return response;
  }
}
