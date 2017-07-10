import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../../classes/user'
import { UserService } from '../../services/user.service'
import {isUndefined} from "util";

declare var $: any;

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  providers: [ UserService ]
})
export class ProfileEditComponent implements OnInit {

  currentUser: User = new User()
  newSkill: string = ''
  expColors: string[] = ['rgb(0,178,255)', 'rgb(69,199,255)', 'rgb(138,220,255)', 'rgb(198,241,255)' ];
  strengthChartDatas: any[] = []
  strengthChartLabels: string[] = []
  availabilityData: any = {
    values: [],
    dates: []
  }

  customTrackBy(index: number, obj: any): any {
    return  index;
  }

  // currentAccount: Company = new Company()
  // products: Product[] = []
  // services: Service[] = []
  // pastperformances: PastPerformance[] = []
  // infoInputWidth: number = 350;
  //
  // agencyType: string[] = ['Pro', 'Amature'];
  // officeType: string[] = ['Pro', 'Amature'];
  // clearedType: string[] = ['Pro', 'Amature'];
  // ppImage: string;
  // ppInputWidth: number = 300;
  //
  // writeWidth: number = 800;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location
  ) {
    // this.currentUser = this.userService.getUserbyID(this.route.snapshot.params['id'])
    if (this.router.url !== 'user-profile-create') {
      this.userService.getUserbyID(this.route.snapshot.params['id']).toPromise().then((result) => {
        this.currentUser = result[0];
      });
    };
    if (typeof this.currentUser.education === 'undefined') {
      console.log('this works');
      this.currentUser.education = [
        {
          School: 'My University',
          ReferenceLocation: {
            CountryCode: 'US',
            CountrySubDivisionCode: 'MyState',
            CityName: 'MyTown'
          },
          EducationLevel: [
            {
              Name: 'bachelors'
            }
          ],
          AttendanceStatusCode: 'Prior',
          AttendanceEndDate: '2002-05-01',
          EducationScore: ['4.0'],
          DegreeType: [
            {
              Name: 'Bachelor'
            }
          ],
          DegreeDate: '2002-05-01',
          MajorProgramName: ['Computer Science'],
          MinorProgramName: ['Business'],
          Comment: 'Comment Here'
        }
      ];
    }
  }

  ngOnInit() {
  }

  saveChanges() {
    console.log('This button doesnt do anything!')
  }

  addSkill() {
    if (this.newSkill !== '') {
      this.currentUser.personcompetency.push({
        CompetencyName: this.newSkill,
        CompetencyLevel: 'good'
      });
      this.newSkill = '';
    };
  }

  deleteSkill(i) {
    this.currentUser.personcompetency.splice(i, 1);
  }

  addJob() {
    this.currentUser.positionhistory.push(
      {
        Year: this.currentYear(),
        Employer: '',
        PositionTitle: '',
        ReferenceLocation: {
          CountryCode: '',
          CountrySubDivisionCode: '',
          CityName: ''
        },
        StartDate: '',
        EndDate: '',
        CurrentIndicator: false,
        Industry: {
          Name: ''
        },
        Description: ''
      }
    );
  }

  deleteJob(i) {
    this.currentUser.positionhistory.splice(i, 1);
  }


  addDegree() {
    this.currentUser.education.push(
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
        AttendanceStatusCode: '',
        AttendanceEndDate: '',
        EducationScore: [''],
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
    );
  }

  deleteDegree(i) {
    this.currentUser.education.splice(i, 1);
  }

  addClearance() {
    this.currentUser.clearance.push(
      {
        type: '',
        awarded: '',
        expiration: ''
      }
    );
  }

  deleteClearance(i) {
    this.currentUser.clearance.splice(i, 1);
  }


  addAward() {
    this.currentUser.award.push(
      ''
    );
  }

  deleteAward(i) {
    this.currentUser.award.splice(i, 1);
  }

  addCertificate() {
    this.currentUser.certification.push({
      CertificationName: '',
      DateEarned: ''
    });
  }

  deleteCertificate(i) {
    this.currentUser.certification.splice(i, 1);
  }


  currentYear() {
    let year = new Date().getFullYear()
    return year;
  }

  updateProfile(model) {
    // Mongo cannot update a model if _id field is present in the data provided for the update, so we delete it
    delete model['_id']
    this.userService.updateUser(this.route.snapshot.params['id'], model).toPromise().then(result => console.log(result));
    window.scrollTo(0, 0);
    this.router.navigate(['user-profile', this.route.snapshot.params['id']]);

  }


}
