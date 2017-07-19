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
  creatingNewUser = false
  newSkill: string = ''
  expColors: string[] = ['rgb(0,178,255)', 'rgb(69,199,255)', 'rgb(138,220,255)', 'rgb(198,241,255)' ];
  strengthChartDatas: any[] = []
  strengthChartLabels: string[] = []
  availabilityData: any = {
    values: [],
    dates: []
  }
  promiseFinished: boolean = false

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
    if (this.router.url !== '/user-profile-create') {
      console.log(this.router.url);
        this.userService.getUserbyID(this.route.snapshot.params['id']).toPromise().then((result) => {
        this.currentUser = result[0];
        this.promiseFinished = true;
      });
    } else {
      this.currentUser = this.userService.getBlankUser();
      this.creatingNewUser = true;
      console.log(this.creatingNewUser);
      this.promiseFinished = true;
    };
  }

  ngOnInit() {
  }

  saveChanges() {
    console.log('This button doesnt do anything!')
  }

  addSkill() {
    if (this.newSkill !== '') {
      this.currentUser.personCompetency.push({
        competencyName: this.newSkill,
        competencyLevel: 'good'
      });
      this.newSkill = '';
    };
  }

  deleteSkill(i) {
    this.currentUser.personCompetency.splice(i, 1);
  }

  addJob() {
    this.currentUser.positionHistory.push(
      {
        year: this.currentYear(),
        employer: '',
        positionTitle: '',
        referenceLocation: {
          countryCode: '',
          countrySubDivisionCode: '',
          cityName: ''
        },
        startDate: '',
        endDate: '',
        currentIndicator: false,
        industry: {
          name: ''
        },
        description: ''
      }
    );
  }

  deleteJob(i) {
    this.currentUser.positionHistory.splice(i, 1);
  }


  addDegree() {
    this.currentUser.education.push(
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
        attendanceStatusCode: '',
        attendanceEndDate: '',
        educationScore: [''],
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
    );
  }

  deleteDegree(i) {
    this.currentUser.education.splice(i, 1);
  }

  addClearance() {
    this.currentUser.clearance.push(
      {
        clearanceType: '',
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
      certificationName: '',
      dateEarned: ''
    });
  }

  deleteCertificate(i) {
    this.currentUser.certification.splice(i, 1);
  }


  currentYear() {
    const year = new Date().getFullYear()
    return year;
  }

  updateProfile(model) {
    // Mongo cannot update a model if _id field is present in the data provided for the update, so we delete it
    if (this.creatingNewUser === false) {
      delete model['_id']
      this.userService.updateUser(this.route.snapshot.params['id'], model).toPromise().then(result => console.log(result));
      window.scrollTo(0, 0);
      this.router.navigate(['user-profile', this.route.snapshot.params['id']]);
    } else {
    }

  }


}
