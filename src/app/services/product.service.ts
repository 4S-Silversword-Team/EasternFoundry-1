import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { AuthHttp } from '../classes/auth-http'

import { Observable } from 'rxjs/Observable'
import { Product } from '../classes/product'

@Injectable()
export class ProductService {

  authHttp: AuthHttp

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getProductbyID(id: string): Observable<Product> {
    var response =  this.authHttp.get(environment.apiRoot + "products/" + id)
    .map(response => <Product> response.json());
    return response;
  }

  updateProduct(id: string, request: any): Observable<Product> {
    var response = this.authHttp.put(environment.apiRoot + "products/" + id, request)
      .map(response => <Product> response.json());
    return response;
  }

  createProduct(request: any): Observable<Product> {
    var response = this.authHttp.post(environment.apiRoot + "products/add", request)
      .map(response => <Product> JSON.parse(JSON.stringify(response)));
    return response;
  }

  getProducts(): Promise<Product[]> {
    var response = this.authHttp.get(environment.apiRoot + "products/" )
    .map(response => <[Product]> response.json())
    var productPromise: Promise<[Product]> = response.toPromise();
    return productPromise
  }

  deleteProduct(id: string): Observable<any> {
    var response = this.authHttp.delete(environment.apiRoot + "products/" + id)
      .map(response => <Product> JSON.parse(JSON.stringify(response)));
    return response;
  }

}
