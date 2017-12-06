import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { AuthHttp } from '../classes/auth-http'

import { Observable } from 'rxjs/Observable'
import { Agency } from '../classes/agency'

@Injectable()
export class AgencyService {

  authHttp: AuthHttp

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getAgencies(): Promise<Agency[]> {
    var response = this.authHttp.get(environment.apiRoot + "agencies/" )
      .map(response => <[Agency]> response.json())

    var agencyPromise: Promise<[Agency]> = response.toPromise();
    return agencyPromise;
  }

  getAgencybyID(id: string): Observable<Agency> {
    var response =  this.authHttp.get(environment.apiRoot + "agencies/" + id)
    .map(response => <Agency> response.json());
    return response;
  }

  updateAgency(id: string, request: any): Observable<Agency> {
    var response = this.authHttp.put(environment.apiRoot + "agencies/" + id, request)
      .map(response => <Agency> response.json());
    return response;
  }

  createAgency(request: any): Observable<Agency> {
    var response = this.authHttp.post(environment.apiRoot + "agencies/add", request)
      .map(response => <Agency> JSON.parse(JSON.stringify(response)));
    return response;
  }
}
