import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http'
import { environment } from '../../environments/environment'

import { AuthHttp } from '../classes/auth-http'

import { Observable } from 'rxjs/Observable'
import { User } from '../classes/user'

@Injectable()
export class UserService {

  authHttp: AuthHttp
  current_user: any

  constructor(private http:Http) {
    this.authHttp = new AuthHttp(http)
  }

  getUsers(): Promise<User[]> {
    var response = this.authHttp.get(environment.apiRoot + "profiles/" )
      .map(response => <[User]> response.json())

    var userPromise: Promise<[User]> = response.toPromise();
    return userPromise;
  }

  getUserbyID(id: string): Observable<User> {
    var response = this.authHttp.get(environment.apiRoot + "profiles/" + id)
      .map(response => <User> response.json())
    return response;
  }

  updateUser(id: string, request: any): Observable<User> {
    var response = this.authHttp.put(environment.apiRoot + "profiles/" + id, request)
      .map(response => <User> response.json())
    return response;
  }




    // let temp: User = new User()
    // temp.id = '1'
    // temp.firstname = 'Andrew'
    // temp.lastname = 'Chang'
    // temp.jobtitle = 'CEO'
    // temp.office = '4s-Silverword Software & Serviecs LLC'
    // temp.employer = ''
    // temp.email = 'chang@eastern-foundry.com'
    // temp.contactNumber = '12345678912'
    // temp.city = 'Washington, DC'
    // temp.state = 'US'
    // temp.zip = '20001'
    // temp.avatar = '../../assets/img/user-account1.png'
    // temp.lastupdated = 'Dec, 2016'
    // temp.information_accuracy = 4.5
    // temp.degree = [
    //   {
    //     type: 'master',
    //     concentration: 'human resource',
    //     school: 'harvard university',
    //     graduationDate: 'Aug, 2010'
    //   },
    //   {
    //     type: 'bachelor',
    //     concentration: 'human resource',
    //     school: 'harvard university',
    //     graduationDate: 'Aug, 2010'
    //   }
    // ]
    // temp.certificate = [
    //   {
    //     degree: 'master of human resource control',
    //     dateEarned: 'Aug, 2010'
    //   },
    //   {
    //     degree: 'bachelor of human resource control',
    //     dateEarned: 'Aug, 2010'
    //   }
    // ]
    // temp.clearance = [
    //   {
    //     type: 'clearance type 1',
    //     awarded: 'Dec, 2013',
    //     expiration: 'Dec, 2016'
    //   }
    // ]
    // temp.award = [
    //   'Award 1',
    //   'Award 2'
    // ]
    // temp.capability = [
    //   {
    //     name: 'web developer',
    //     score: 30
    //   },
    //   {
    //     name: 'human resource manager',
    //     score: 90
    //   },
    //   {
    //     name: 'CEO',
    //     score: 95
    //   }
    // ]
    // temp.skill = ['Javascript', 'HTML', 'ES6', 'Human Resource Manage']
    // temp.interest = 'Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog'
    // temp.agencyexperience = {
    //   main: {
    //     title: 'Air force',
    //     data: [
    //     {
    //       title: 'Years Agency experience',
    //       score: 90
    //     },{
    //       title: '$ (M) of agency revenue',
    //       score: 48
    //     },{
    //       title: 'Proposals written',
    //       score: 100
    //     },{
    //       title: 'Relationships',
    //       score: 30
    //     }
    //   ]},
    //   office1: {
    //     title: 'office1',
    //     data:[
    //     {
    //       title: 'Years Agency experience',
    //       score: 90
    //     },{
    //       title: '$ (M) of agency revenue',
    //       score: 48
    //     },{
    //       title: 'Proposals written',
    //       score: 100
    //     },{
    //       title: 'Relationships',
    //       score: 30
    //     }
    //   ]},
    //   office2: {
    //     title: 'office2',
    //     data: [
    //     {
    //       title: 'Years Agency experience',
    //       score: 90
    //     },{
    //       title: '$ (M) of agency revenue',
    //       score: 48
    //     },{
    //       title: 'Proposals written',
    //       score: 100
    //     },{
    //       title: 'Relationships',
    //       score: 30
    //     }
    //   ]}
    // }
    // temp.career = [
    //   {
    //     'year': 2015,
    //     'detail':
    //       {
    //           'title': 'INDEPENDENT CONTRACTOR',
    //           'from': '2013-Present',
    //           'company': 'Independent',
    //           'career': 'Adding functionality to existing applications including adding new data columns to the atabase, building/rebuilding Com + Middleware components and TSQL Stored Procedure updates. Modify user interface components to accept new and changing data elements Dbugging problems that arise in production applications, such as browser compatibility issues and javascript errors.'
    //       }
    //   },
    //   {
    //     'year': 2013,
    //     'detail':
    //       {
    //           'title': 'INDEPENDENT CONTRACTOR',
    //           'from': '2013-Present',
    //           'company': 'QUALITY ASSURANCE',
    //           'career': 'Adding functionality to existing applications including adding new data columns to the atabase, building/rebuilding Com + Middleware components and TSQL Stored Procedure updates. Modify user interface components to accept new and changing data elements Dbugging problems that arise in production applications, such as browser compatibility issues and javascript errors.'
    //       }
    //   },
    //   {
    //     'year': 2008,
    //     'detail':
    //       {
    //           'title': 'JR AUTOMATION ANALYST',
    //           'from': '2013-Present',
    //           'company': '4stay Housing',
    //           'career': 'Adding functionality to existing applications including adding new data columns to the atabase, building/rebuilding Com + Middleware components and TSQL Stored Procedure updates. Modify user interface components to accept new and changing data elements Dbugging problems that arise in production applications, such as browser compatibility issues and javascript errors.'
    //       }
    //   }
    // ]
    // temp.strength = [
    //   {
    //     skill: 'human resource management',
    //     score: 90
    //   },
    //   {
    //     skill: 'web Developer',
    //     score: 30
    //   },
    //   {
    //     skill: 'CEO',
    //     score: 95
    //   }
    // ]
    // temp.availability = [
    //   {
    //     date: 'Feb, 17',
    //     available: true
    //   },
    //   {
    //     date: 'Mar, 17',
    //     available: false
    //   },
    //   {
    //     date: 'Apr, 17',
    //     available: true
    //   },
    //   {
    //     date: 'May, 17',
    //     available: true
    //   },
    //   {
    //     date: 'Jun, 17',
    //     available: false
    //   },
    //   {
    //     date: 'Jul, 17',
    //     available: true
    //   },
    //   {
    //     date: 'Aug, 17',
    //     available: true
    //   }
    // ]
    // if(id == '2') {
    //   temp.id = '2'
    //   temp.firstname = 'Geoff'
    //   temp.lastname = 'Orazem'
    //   temp.jobtitle = 'CSO'
    //   temp.email = 'geoff@eastern-foundry.com'
    //   temp.avatar = '../../assets/img/user-account2.png'
    // }
    // return temp

}
