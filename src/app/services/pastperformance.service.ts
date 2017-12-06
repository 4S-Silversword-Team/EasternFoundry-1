import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { AuthHttp } from '../classes/auth-http'

import { Observable } from 'rxjs/Observable'
import { PastPerformance } from '../classes/past-performance'

@Injectable()
export class PastperformanceService {

  authHttp: AuthHttp

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getPastPerformances(): Promise<PastPerformance[]> {
    var response = this.authHttp.get(environment.apiRoot + "pastPerformance/" )
      .map(response => <[PastPerformance]> response.json())

    var pastPerformancePromise: Promise<[PastPerformance]> = response.toPromise();
    return pastPerformancePromise
  }

  getPastPerformancebyID(id: string): Observable<PastPerformance> {
    var response =  this.authHttp.get(environment.apiRoot + "pastPerformance/" + id)
    .map(response => <PastPerformance> response.json())
    return response
  }

  updatePP(id: string, request: any): Observable<PastPerformance>{
    var response = this.authHttp.put(environment.apiRoot + "PastPerformance/" + id, request)
    .map(response => <PastPerformance> response.json())
    return response;
  }

  createPastPerformance(request: any){
    var response = this.authHttp.post(environment.apiRoot + "PastPerformance/add", request)
    .map(response => response.json())
    return response;
  }

  // getPastPerformancebyID(id: string): PastPerformance {
  //   let temp: PastPerformance = new PastPerformance()
  //   temp.id = '1'
  //   temp.title = 'Energy app Development and Deployment'
  //   temp.client = 'Air Force'
  //   temp.topic = 'App Development'
  //   temp.startDate = 'Jan, 2016'
  //   temp.endDate = 'Dec, 2016'
  //   temp.cleared = false
  //   temp.location = 'Metro DC'
  //   temp.FTE = '8'
  //   temp.value = '$4M'
  //   temp.rating = 'Exceptional'
  //   temp.description = 'Description lorem the quick brown fox jumps over the lazy dog lorem the quick brown fox jumps over the lazy dog lorem the quick brown fox jumps over the lazy dog lorem the quick brown fox jumps over the lazy dog'
  //   temp.avatar = './assets/img/pp1.png'
  //   temp.employees = [
  //     {
  //       title: 'App developer1',
  //       stillWith: true
  //     },
  //     {
  //       title: 'App developer2',
  //       stillWith: false
  //     },
  //     {
  //       title: 'Web developer',
  //       stillWith: true
  //     },
  //     {
  //       title: 'Program Manager',
  //       stillWith: true
  //     }
  //   ]
  //   temp.synopsis = 'Synopsis lorem the quick brown fox jumps over the lazy dog lorem the quick brown fox jumps over the lazy dog lorem the quick brown fox jumps over the lazy dog lorem the quick brown fox jumps over the lazy dog'
  //   temp.technical = 'Synopsis lorem the quick brown fox jumps over the lazy dog lorem the quick brown fox jumps over the lazy dog lorem the quick brown fox jumps over the lazy dog lorem the quick brown fox jumps over the lazy dog'
  //   temp.management = 'Synopsis lorem the quick brown fox jumps over the lazy dog lorem the quick brown fox jumps over the lazy dog lorem the quick brown fox jumps over the lazy dog lorem the quick brown fox jumps over the lazy dog'
  //   temp.other = 'Synopsis lorem the quick brown fox jumps over the lazy dog lorem the quick brown fox jumps over the lazy dog lorem the quick brown fox jumps over the lazy dog lorem the quick brown fox jumps over the lazy dog'
  //   if(id == '2') {
  //     temp.id = '2'
  //     temp.title = 'Assessing USAF Quality Assurance Process'
  //     temp.topic = 'Computer System Analyics'
  //     temp.avatar = './assets/img/pp2.png'
  //   }
  //   return temp
  // }

}
