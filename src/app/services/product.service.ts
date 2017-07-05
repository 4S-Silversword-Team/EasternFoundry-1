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

  getProduct(id: string): Observable<Product> {
    var response =  this.authHttp.get(environment.apiRoot + "products/" + id)
    .map(response => <Product> response.json())
    return response
  }

  updateProduct(id: string, request: any): Observable<Product> {
    var response = this.authHttp.put(environment.apiRoot + "products/" + id, request)
      .map(response => <Product> response.json())
    return response;
  }

  getProductbyID(id: string): Observable<Product> {
    var response =  this.authHttp.get(environment.apiRoot + "products/" + id )
      .map(response => <Product> response.json())
    return response
  }


  getTempProduct(id: string): Product {
    let temp: Product = new Product()
    temp.id = '1'
    temp.name = 'product 1'
    temp.feature = [
      {
        name: 'feature 1',
        score: 10
      },{
        name: 'feature 2',
        score: 20
      },{
        name: 'feature 3',
        score: 30
      },{
        name: 'feature 4',
        score: 18
      },{
        name: 'feature 5',
        score: 60
      }
    ]
    temp.description = 'the quick brown fox jumps over lazy dog the quick brown fox jumps over lazy dog the quick brown fox jumps over lazy dog  the quick brown fox jumps over lazy dog the quick brown fox jumps over lazy dog the quick brown fox jumps over lazy dog the quick brown fox jumps over lazy dog the quick brown fox jumps over lazy dog the quick brown fox jumps over lazy dog the quick brown fox jumps over lazy dog the quick brown fox jumps over lazy dog'
    temp.moreinfolink = ''
    temp.viewdemolink = ''
    temp.customization = true
    temp.training = false
    temp.maintenance = true
    temp.customers = {
      defense: [
        {
          avatar: './assets/img/customer1.png',
          name: 'customer 1'
        },{
          avatar: './assets/img/customer2.png',
          name: 'customer 2'
        },{
          avatar: './assets/img/customer3.png',
          name: 'customer 3'
        },{
          avatar: './assets/img/customer4.png',
          name: 'customer 4'
        }
      ],
      civilian: [
        {
          avatar: './assets/img/customer5.png',
          name: 'customer 1'
        },{
          avatar: './assets/img/customer2.png',
          name: 'customer 2'
        },{
          avatar: './assets/img/customer3.png',
          name: 'customer 3'
        }
      ],
      commercial : [
        {
          avatar: './assets/img/customer6.png',
          name: 'customer 1'
        },{
          avatar: './assets/img/customer2.png',
          name: 'customer 2'
        }
      ]
    }
    if(id == '2') {
      temp.id = '2'
      temp.name = 'product 2'
      temp.feature = [
        {
          name: 'feature 1',
          score: 10
        },{
          name: 'feature 2',
          score: 20
        },{
          name: 'feature 3',
          score: 30
        },{
          name: 'feature 4',
          score: 18
        },{
          name: 'feature 5',
          score: 60
        },{
          name: 'feature 6',
          score: 10
        },{
          name: 'feature 7',
          score: 20
        },{
          name: 'feature 8',
          score: 30
        },{
          name: 'feature 9',
          score: 18
        },{
          name: 'feature 10',
          score: 60
        }
      ]
      temp.description = 'Second the quick brown fox jumps over lazy dog the quick brown fox jumps over lazy dog the quick brown fox jumps over lazy dog'
      temp.customers = {
        defense: [
          {
            avatar: './assets/img/customer2.png',
            name: 'customer 1'
          },{
            avatar: './assets/img/customer6.png',
            name: 'customer 2'
          },{
            avatar: './assets/img/customer4.png',
            name: 'customer 3'
          },{
            avatar: './assets/img/customer5.png',
            name: 'customer 4'
          }
        ],
        civilian: [
          {
            avatar: './assets/img/customer5.png',
            name: 'customer 1'
          },{
            avatar: './assets/img/customer2.png',
            name: 'customer 2'
          }
        ],
        commercial : [
          {
            avatar: './assets/img/customer6.png',
            name: 'customer 1'
          },{
            avatar: './assets/img/customer2.png',
            name: 'customer 2'
          }
        ]
      }
    }
    return temp
  }

}
