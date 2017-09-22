import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { AuthHttp } from '../classes/auth-http'

import { Observable } from 'rxjs/Observable'

@Injectable()
export class s3Service {

  authHttp: AuthHttp

  constructor(private http: Http) {
    this.authHttp = new AuthHttp(http)
  }

  postPhoto(request: any){
    console.log("Post Photo Service initiated");
    var response = this.authHttp.postNoAuthNoJson("http://s3.amazonaws.com/" + environment.bucketName, request)
      .map(response => response);
    return response;
  }

  deletePhoto(objectName: string){
    var response = this.authHttp.deleteNoAuthNoJson("http://s3.amazonaws.com/" + environment.bucketName + objectName)
      .map(response => response);
    return response;
  }
}
