import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { AuthHttp } from '../classes/auth-http'

import { Observable } from 'rxjs/Observable'
import { ToolSubmission } from '../classes/tool-submission'

@Injectable()
export class ToolSubmissionService {

  authHttp: AuthHttp

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getToolSubmissions(): Promise<ToolSubmission[]> {
    var response = this.authHttp.get(environment.apiRoot + "toolsubmissions/" )
      .map(response => <[ToolSubmission]> response.json())

    var toolSubmissionPromise: Promise<[ToolSubmission]> = response.toPromise();
    return toolSubmissionPromise;
  }

  getToolSubmissionbyID(id: string): Observable<ToolSubmission> {
    var response =  this.authHttp.get(environment.apiRoot + "toolsubmissions/" + id)
    .map(response => <ToolSubmission> response.json());
    return response;
  }

  updateToolSubmission(id: string, request: any): Observable<ToolSubmission> {
    var response = this.authHttp.put(environment.apiRoot + "toolsubmissions/" + id, request)
      .map(response => <ToolSubmission> response.json());
    return response;
  }

  createToolSubmission(request: any): Observable<ToolSubmission> {
    var response = this.authHttp.post(environment.apiRoot + "toolsubmissions/add", request)
      .map(response => <ToolSubmission> JSON.parse(JSON.stringify(response)));
    return response;
  }
}
