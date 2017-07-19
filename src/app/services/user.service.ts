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

  registerUser(){

  }

  // createUser(id: string): Observable<User> {
  //
  // }



  getBlankUser(): User {
    const temp: User = new User();
    temp.firstName = '';
    temp.lastName = '';
    temp.cell = '';
    temp.office = '';
    temp.username = '';
    temp.avatar = '';
    temp.disabled = false;
    temp.anonymize = false;
    temp.gender = '';
    temp.workEligibility = [
      {
        countryCode: '',
        permanent: true
      }
    ];
    temp.email = [
      {
        address: '',
        label: ''
      }
    ];
    temp.address = {
      city: '',
      state: '',
      zip: ''
    };
    temp.phone = [
      {
        number: '',
        label: 'cell'
      },
      {
        number: '',
        label: 'mobile'
      },
      {
        number: '',
        label: 'work'
      },
      {
        number: '',
        label: 'other'
      }
    ];
    temp.education = [
      {
        school: '',
        referenceLocation: {
          countryCode: '',
          countrySubDivisionCode: '',
          cityName: ''
        },
        educationLevel: [
          {
            name: ''
          }
        ],
        attendanceStatusCode: 'Prior',
        attendanceEndDate: '',
        educationScore: ['4.0'],
        degreeType: [
          {
            name: ''
          }
        ],
        degreeDate: '',
        majorProgramName: [''],
        minorProgramName: [''],
        comment: ''
      }
    ];
      temp.positionHistory = [
      {
        year: 2016,
        employer: '',
        positionTitle: '',
        referenceLocation: {
          countryCode: '',
          countrySubDivisionCode: '',
          cityName: ''
        },
        startDate: '',
        endDate: '',
        currentIndicator: true,
        industry: {
          name: ''
        },
        description: ''
      }
    ];
      temp.personCompetency = [
      {
        competencyName: '',
        competencyLevel: ''
      }
    ];
      temp.certification = [
      {
        certificationName: '',
        dateEarned: ''
      }
    ];
      temp.license = [
      {
        licenseName: ''
      }
    ];
      temp.employmentReferences = [
      {
        refereeTypeCode: '',
        formattedName: '',
        positionTitle: '',
        preferredPhone: '',
        preferredEmail: ''
      }
    ];
      temp.lastUpdated = '';
      temp.informationAccuracy = 5;
      temp.clearance = [
      {
        clearanceType: '',
        awarded: '',
        expiration: ''
      }
    ];
      temp.award = [''];
      temp.capability = [
      {
        name: 'web developer',
        score: 30
      }
    ];
      temp.skill = [''];
      temp.interest = 'Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog Lorem the quick brown fox jumps over lazy dog';
      temp.agencyExperience = {
      main: {
        title: '',
          data: [
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
        ]},
      office1: {
        title: '',
          data: [
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
        ]},
        office2: {
          title: '',
          data: [
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
          ]}

      };
    temp.strength = [
      {
        skill: 'human resource management',
        score: 90
      },
      {
        skill: 'web developer',
        score: 30
      },
      {
        skill: 'CEO',
        score: 95
      }
    ];
      temp.availability = [
      {
        date: 'Feb, 17',
        available: true
      },
      {
        date: 'Mar, 17',
        available: true
      },
      {
        date: 'Apr, 17',
        available: true
      },
      {
        date: 'May, 17',
        available: true
      },
      {
        date: 'Jun, 17',
        available: false
      },
      {
        date: 'Jul, 17',
        available: true
      },
      {
        date: 'Aug, 17',
        available: true
      }
    ];

    return temp;
  }


}
