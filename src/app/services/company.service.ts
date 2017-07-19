import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { Observable } from 'rxjs/Observable'
import { Company } from '../classes/company'
import {AuthHttp} from '../classes/auth-http'

@Injectable()
export class CompanyService {
  authHttp: AuthHttp

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getCompanies(): Promise<Company[]> {
    var response = this.authHttp.get(environment.apiRoot + "company/" )
    .map(response => <[Company]> response.json())

    var companyPromise: Promise<[Company]> = response.toPromise();
    return companyPromise
  }

  getCompanyByID(id: string): Observable<Company> {
    var response =  this.authHttp.get(environment.apiRoot + "company/" + id )
    .map(response => <Company> response.json())
    return response
  }

  updateCompany(id: string, request: any): Observable<Company> {
    var response = this.authHttp.put(environment.apiRoot + "company/" + id, request)
    .map(response => <Company> response.json())
    return response;
  }

  getTestCompany(): Company {
    let temp: Company = new Company()
    temp.id = '1'
    temp.name = 'Eastern Foundry'
    temp.email = 'eastern@foundry.com'
    temp.avatar = '../../assets/img/company-account.png'
    temp.contactNumber = '(202) 725-7483'
    temp.address = 'Washington, DC'
    temp.informationAccuracy = 5
    temp.lastUpdated = 'Dec, 2016'
    temp.leadership = [
      {userId: '1'},
      {userId: '2'}
    ]
    temp.product = [
      {productId: '1'},
      {productId: '2'}
    ]
    temp.service = [
      {serviceId: '1'},
      {serviceId: '2'}
    ]
    temp.pastPerformance = [
      {pastPerformanceId: '1'},
      {pastPerformanceId: '2'}
    ]
    temp.agencyExperience = [
      {
        title: 'Years Agency experience',
        score: 90
      },
      {
        title: '$ (M) of agency revenue',
        score: 48
      },
      {
        title: 'Proposals written',
        score: 100
      },
      {
        title: 'Relationships',
        score: 30
      }
    ]
    temp.vehicles = [
      {
        vehicleType: 'Vehicle vehicleType 1',
        quantity: 3
      },
      {
        vehicleType: 'Vehicle vehicleType 2',
        quantity: 6
      },
      {
        vehicleType: 'Vehicle vehicleType 3',
        quantity: 10
      }
    ]
    temp.schedule = [
      {
        date: 'Dec, 2016',
        content: 'Schedule 1'
      },
      {
        date: 'Jan, 2017',
        content: 'Schedule 2'
      },
      {
        date: 'May, 2017',
        content: 'Schedule 3'
      }
    ]
    return temp
  }

}
