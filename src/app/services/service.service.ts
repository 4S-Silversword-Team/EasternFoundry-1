import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { AuthHttp } from '../classes/auth-http'

import { Observable } from 'rxjs/Observable'
import { Service } from '../classes/service'

@Injectable()
export class ServiceService {

  authHttp: AuthHttp

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getService(id: string): Observable<Service> {
    var response =  this.authHttp.get(environment.apiRoot + "services/" + id)
    .map(response => <Service> response.json())
    return response
  }

  updateService(id: string, request: any): Observable<Service> {
    var response = this.authHttp.put(environment.apiRoot + "services/" + id, request)
      .map(response => <Service> response.json())
    return response;
  }

  createService(request: any): Observable<Service> {
    var response = this.authHttp.post(environment.apiRoot + "services/add", request)
      .map(response => <Service> JSON.parse(JSON.stringify(response)));
    return response;
  }

  getServicebyID(id: string): Observable<Service> {
    var response = this.authHttp.get(environment.apiRoot + "services/" + id)
      .map(response => <Service> response.json())
    return response;
  }

  getTempService(id: string): Service {
    let temp: Service = new Service()
    temp._id = '1'
    temp.name = 'Computer and Mathematical'
    temp.feature = [
      {
        title: 'Computer Programmers',
        score: 80
      },{
        title: 'Computer System Analysts',
        score: 88
      },{
        title: 'SoftwareDev Applications',
        score: 40
      },{
        title: 'Web Developers',
        score: 12
      },{
        title: 'UI Desingers',
        score: 91
      }
    ]
    temp.skills = [
      'Javascript',
      'jQuery',
      'Angular',
      'React',
      'ES5',
      'ES6',
      'ES7',
      'ES 2015',
      'HTML/DHTML',
      'AJAX/XHR',
      'ASP',
      'JSP',
      'JAVA',
      'C#',
      'Objective-c',
      'Swift 1',
      'Swift 3',
      'SQL'
    ]
    return temp;
  }

}
