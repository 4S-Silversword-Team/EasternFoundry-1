import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { Observable } from 'rxjs/Observable'
import { CompanyUserProxy } from '../classes/company-user-proxy'
import {AuthHttp} from '../classes/auth-http'

@Injectable()
export class CompanyUserProxyService {
  authHttp: AuthHttp

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getCompanyUserProxies(): Promise<CompanyUserProxy[]> {
    var response = this.authHttp.get(environment.apiRoot + "companyuserproxy/" )
    .map(response => <[CompanyUserProxy]> response.json())

    var companyPromise: Promise<[CompanyUserProxy]> = response.toPromise();
    return companyPromise
  }

  getCompanyUserProxiesByID(id: string): Observable<CompanyUserProxy> {
    var response = this.authHttp.get(environment.apiRoot + "companyuserproxy/" + id)
      .map(response => <CompanyUserProxy> response.json())
    return response;
  }

  updateCompanyUserProxies(id: string, request: any): Observable<CompanyUserProxy> {
    var response = this.authHttp.put(environment.apiRoot + "companyuserproxy/" + id, request)
    .map(response => <CompanyUserProxy> response.json())
    return response;
  }
  addCompanyUserProxy(request: any): Promise<Response> {
    return this.authHttp.post(environment.apiRoot + "companyuserproxy/add", request).toPromise();
  }
  deleteCompanyUserProxy(id: string): Promise<Response> {
    return this.authHttp.delete(environment.apiRoot + "companyuserproxy/" + id).toPromise();
  }
}
