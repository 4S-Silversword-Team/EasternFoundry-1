/*
  Eastern Foundry Base HTTP.
  Implements:
    - Authorization header. All services accessing a protected resource must use this class instead Http
*/

import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class AuthHttp {
  http: Http

  constructor(http: Http) {
    this.http = http
  }

  createAuthorizationHeader(headers:Headers) {
    headers.append('Authorization', localStorage.getItem('token'));
    headers.append('id', localStorage.getItem('uid'));
  }

  get(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

  postNoJson(url, data) {
    let headers = new Headers();
    headers.delete('Content-Type');
    this.createAuthorizationHeader(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

  postNoAuthNoJson(url, data) {
    let headers = new Headers();
    headers.delete('Content-Type');
    return this.http.post(url, data, {
      headers: headers
    });
  }

  deleteNoAuthNoJson(url) {
    let headers = new Headers();
    headers.delete('Content-Type');
    return this.http.delete(url, {
      headers: headers
    });
  }

  patch(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.patch(url, data, {
      headers: headers
    });
  }

  put(url, data) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.put(url, data, {
      headers: headers
    });
  }

  delete(url) {
    let headers = new Headers();
    this.createAuthorizationHeader(headers);
    return this.http.delete(url, {
      headers: headers
    });
  }

}
