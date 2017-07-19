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
    let temp: User = new User();
    temp.firstName = '';
    temp.lastName = '';
    temp.cell = '';
    temp.office = '';
    temp.username = '';
    temp.avatar = '';
    temp.disabled = false;
    temp.dateofbirth = '';
    temp.gender = '';
    temp.workeligibility = [
      {
        CountryCode: '',
        Permanent: true
      }
    ];
    temp.email = [
      {
        Address: '',
        Label: ''
      }
    ];
    temp.address = {
      city: '',
      state: '',
      zip: ''
    };
    temp.phone = [
      {
        Number: '',
        Label: 'cell'
      },
      {
        Number: '',
        Label: 'mobile'
      },
      {
        Number: '',
        Label: 'work'
      },
      {
        Number: '',
        Label: 'other'
      }
    ];
    temp.education = [
      {
        School: '',
        ReferenceLocation: {
          CountryCode: '',
          CountrySubDivisionCode: '',
          CityName: ''
        },
        EducationLevel: [
          {
            Name: ''
          }
        ],
        AttendanceStatusCode: 'Prior',
        AttendanceEndDate: '',
        EducationScore: ['4.0'],
        DegreeType: [
          {
            Name: ''
          }
        ],
        DegreeDate: '',
        MajorProgramName: [''],
        MinorProgramName: [''],
        Comment: ''
      }
    ];
      temp.positionhistory = [
      {
        Year: 2016,
        Employer: '',
        PositionTitle: '',
        ReferenceLocation: {
          CountryCode: '',
          CountrySubDivisionCode: '',
          CityName: ''
        },
        StartDate: '',
        EndDate: '',
        CurrentIndicator: true,
        Industry: {
          Name: ''
        },
        Description: ''
      }
    ];
      temp.personcompetency = [
      {
        CompetencyName: '',
        CompetencyLevel: ''
      }
    ];
      temp.certification = [
      {
        CertificationName: '',
        DateEarned: ''
      }
    ];
      temp.License = [
      {
        LicenseName: ''
      }
    ];
      temp.EmploymentReferences = [
      {
        RefereeTypeCode: '',
        FormattedName: '',
        PositionTitle: '',
        PreferredPhone: '',
        PreferredEmail: ''
      }
    ];
      temp.lastupdated = '';
      temp.information_accuracy = 5;
      temp.clearance = [
      {
        type: '',
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
      temp.agencyexperience = {
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
