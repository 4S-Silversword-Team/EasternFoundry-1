import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { Observable } from 'rxjs/Observable'
import {CompanyPastperformanceProxy} from "../classes/company-pastperformance-proxy"
import {AuthHttp} from '../classes/auth-http'

@Injectable()
export class CompanyPastperformanceProxyService {
  authHttp: AuthHttp

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getCompanyPPProxies(): Promise<CompanyPastperformanceProxy[]> {
    var response = this.authHttp.get(environment.apiRoot + "companypastperformanceproxy/" )
      .map(response => <[CompanyPastperformanceProxy]> response.json())

    var promise: Promise<[CompanyPastperformanceProxy]> = response.toPromise();
    return promise
  }

  getCompanyPPProxiesByID(id: string): Observable<CompanyPastperformanceProxy> {
    var response = this.authHttp.get(environment.apiRoot + "companypastperformanceproxy/" + id)
      .map(response => <CompanyPastperformanceProxy> response.json())
    return response;
  }

  updateCompanyPPProxies(id: string, request: any): Observable<CompanyPastperformanceProxy> {
    var response = this.authHttp.put(environment.apiRoot + "companypastperformanceproxy/" + id, request)
      .map(response => <CompanyPastperformanceProxy> response.json())
    return response;
  }
  addCompanyPPProxy(request: any): Promise<Response> {
    return this.authHttp.post(environment.apiRoot + "companypastperformanceproxy/add", request).toPromise();
  }
  deleteCompanyPPProxy(id: string): Promise<Response> {
    return this.authHttp.delete(environment.apiRoot + "companypastperformanceproxy/" + id).toPromise();
  }
}
