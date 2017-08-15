//TIM
//
//TODO: create a function that will go through company userProxy
//      and find all the employee's and grab their information.
//
import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';
import { environment } from '../../environments/environment';

import { AuthHttp } from '../classes/auth-http';

import { Observable } from 'rxjs/Observable';
import { User } from '../classes/user';

@Injectable()
export class TeamService {

  authHttp: AuthHttp

constructor(private http:Http){
  this.authHttp = new AuthHttp(http);
}

getTeamById(id: string): Observable<User> {
  var response = this.authHttp.get(environment.apiRoot + "Team/" + id)
  .map(response => <User> response.json())
  return response;

}
updateTeamById(id: string, request: any): Observable<User> {
  var response = this.authHttp.put(environment.apiRoot + "Team/" + id, request)
  .map(response => <User> response.json())
  return response;

}




}
