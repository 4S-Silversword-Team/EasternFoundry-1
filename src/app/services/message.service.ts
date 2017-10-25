import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { AuthHttp } from '../classes/auth-http'

import { Observable } from 'rxjs/Observable'
import { Message } from '../classes/message'

@Injectable()
export class MessageService {

  authHttp: AuthHttp

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getMessagebyID(id: string): Observable<Message> {
    var response =  this.authHttp.get(environment.apiRoot + "messages/" + id)
    .map(response => <Message> response.json());
    return response;
  }

  getMailbox(id: string): Observable<Message> {
    var response =  this.authHttp.get(environment.apiRoot + "messages/user/" + id)
    .map(response => <Message> response.json());
    return response;
  }

  getUnread(id: string): Observable<number> {
    var response =  this.authHttp.get(environment.apiRoot + "messages/user/" + id + "/unread")
    .map(response => <number> response.json());
    return response;
  }

  getUnreadBugReports(id: string): Observable<number> {
    var response =  this.authHttp.get(environment.apiRoot + "messages/user/" + id + "/bugs")
    .map(response => <number> response.json());
    return response;
  }

  updateMessage(id: string, request: any): Observable<Message> {
    var response = this.authHttp.put(environment.apiRoot + "messages/" + id, request)
      .map(response => <Message> response.json());
    return response;
  }

  markAsRead(id: string): Observable<Message> {
    var response = this.authHttp.get(environment.apiRoot + "messages/" + id + '/read')
      .map(response => <Message> response.json());
    return response;
  }

  createMessage(request: any): Observable<Message> {
    var response = this.authHttp.post(environment.apiRoot + "messages/add", request)
      .map(response => <Message> JSON.parse(JSON.stringify(response)));
    return response;
  }

}
