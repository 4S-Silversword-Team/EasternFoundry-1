import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../../classes/user'
import { UserService } from '../../services/user.service'


declare var $: any;

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  providers: [ UserService ]
})
export class ProfileEditComponent implements OnInit {

  currentUser: User = new User()
  newSkill: string = ""
  customTrackBy(index: number, obj: any): any {
    return  index;
  }
  expColors: string[] = ['rgb(0,178,255)', 'rgb(69,199,255)', 'rgb(138,220,255)', 'rgb(198,241,255)' ];
  strengthChartDatas: any[] = []
  strengthChartLabels: string[] = []
  availabilityData: any = {
    values: [],
    dates: []
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


    }
  }

  ngOnInit() {
  }

  saveChanges() {
    console.log("Saving changes does not yet do things!")
  }

  addSkill() {
    if (this.newSkill !== "") {
      this.currentUser.skill.push(this.newSkill);
      this.newSkill = "";
    };
  }

  addJob() {
    this.currentUser.career.push(
      {
        year: 2015,
        detail:
          {
            title: '',
            from: '',
            company: '',
            career: ''
          }
      }
    );
  }

  addDegree() {
    this.currentUser.degree.push(
      {
        type: '',
        concentration: '',
        school: '',
        graduationDate: ''
      }
    );
  }

  deleteDegree(i) {
    this.currentUser.degree.splice(i, 1);
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

  addAward() {
    this.currentUser.award.push(
      ''
    );
  }

  deleteAward(i) {
    this.currentUser.award.splice(i, 1);
  }

  addCertificate() {
    this.currentUser.certificate.push({
      degree: '',
      dateEarned: ''
    });
  }


  currentYear() {
    let year = new Date().getFullYear()
    return year;
  }

  updateProfile(model) {
    // Mongo cannot update a model if _id field is present in the data provided for the update, so we delete it
    delete model["_id"]
    this.userService.updateUser(this.route.snapshot.params['id'], model).toPromise().then(result => console.log(result));
    window.scrollTo(0, 0);
    this.router.navigate(['user-profile', this.route.snapshot.params['id']]);
  }


}
