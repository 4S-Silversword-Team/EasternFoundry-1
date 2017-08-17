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
    var response = this.authHttp.get(environment.apiRoot + "company/" + id)
      .map(response => <Company> response.json())
    return response;
  }

  updateCompany(id: string, request: any): Observable<Company> {
    var response = this.authHttp.put(environment.apiRoot + "company/" + id, request)
    .map(response => <Company> response.json())
    return response;
  }

  createCompany(request: any): Observable<any> {
    var response = this.authHttp.post(environment.apiRoot + "company/add", request)
      .map(response => <Company> JSON.parse(JSON.stringify(response)));
    return response;
  }


  getEmptyCompany(): Company {
    let temp: Company = new Company()
    temp._id = '1'
    temp.name = ''
    temp.email = ''
    temp.avatar = '../../assets/img/company-account.png'
    temp.contactNumber = ''
    temp.city = ''
    temp.state = ''
    temp.zip = ''
    temp.address = 'Washington, DC'
    temp.informationAccuracy = 5
    temp.lastUpdated = 'Dec, 2016'
    temp.leadership = null
    temp.product = null
    temp.service = null
    temp.pastPerformance = null
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
        vehicleType: '',
        quantity: 30
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
