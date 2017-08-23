import {Http} from '@angular/http';

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
  promiseFinished: boolean = false
  toolSearch: string = ''
  allTools: any[] = []

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
    private http: Http,
    private router: Router,
    public location: Location
  ) {
    this.http.get('../../onet-tools.json')
        .subscribe(res => this.allTools = res.json());
    if (this.router.url !== '/user-profile-create') {
        this.userService.getUserbyID(this.route.snapshot.params['id']).toPromise().then((result) => {
        this.currentUser = result;
        function stringToBool(val) {
          return (val + '').toLowerCase() === 'true';
        };
        //here's the logic to check the skillsengine tools against the resume text!
        if (this.currentUser.resumeText) {
        for (let tool of this.currentUser.tools) {
          if (tool.title.length > 1) {
            if (this.currentUser.resumeText.toLowerCase().indexOf(tool.title.toLowerCase()) >= 0) {
              if (this.currentUser.foundTools == null) {
                this.currentUser.foundTools = [
                  {
                    title: '',
                    category: '',
                    classification: '',
                    score: 0
                  }
                ]
                this.currentUser.foundTools[0] = tool
              } else {
                this.currentUser.foundTools.push(tool)
              }
            }
          }
        }
      }

        //right now when a user is created the json assigns the string value "true" or "false" to booleans instead of the actual true or false.
        //i can't figure out how to fix that in the backend so now it just gets cleaned up when it hits the frontend
        if (typeof this.currentUser.disabled === "string") {
          this.currentUser.disabled = stringToBool(this.currentUser.disabled)
        }
        for (var i = 0; i < this.currentUser.positionHistory.length; i++) {
          if (typeof this.currentUser.positionHistory[i].isGovernment === "string") {
            this.currentUser.positionHistory[i].isGovernment = stringToBool(this.currentUser.positionHistory[i].isGovernment)
          }
          if (typeof this.currentUser.positionHistory[i].isPM === "string") {
            this.currentUser.positionHistory[i].isPM = stringToBool(this.currentUser.positionHistory[i].isPM)
          }
          if (typeof this.currentUser.positionHistory[i].isKO === "string") {
            this.currentUser.positionHistory[i].isKO = stringToBool(this.currentUser.positionHistory[i].isKO)
          }
          if ( this.currentUser.positionHistory[i].EndDate == null) {
            this.currentUser.positionHistory[i].EndDate = "Current"
          }

        }
        if (this.currentUser.education[0].DegreeType[0] == null) {
          this.currentUser.education[0].DegreeType.push({Name: ''})
        }

        this.promiseFinished = true;
      });
    }
  }

  ngOnInit() {
  }

  saveChanges() {
    console.log('This button doesnt do anything!')
  }

  addTool(tool) {
    console.log('tool title: ' + tool.title)
    console.log('tool scpre: ' + tool.score)
    this.currentUser.foundTools.push(tool);
  }

  toolIsValid(tool) {
    if (tool.title.toLowerCase().includes(this.toolSearch.toLowerCase())) {
      if (!this.currentUser.foundTools.includes(tool)) {
        return true
      }
    }
    return false
  }
//hey! figure this whole dumb thing out!
  // updateToolList(search){
  //   console.log(search)
  //   var toolSearch = this.toolSearch
  //   var toolsDisplayed = this.toolsDisplayed
  //   var foundTools = this.currentUser.foundTools
  //   function isGoodTool(tool) {
  //     if (tool.title.toLowerCase().includes(toolSearch.toLowerCase())) {
  //       if (!toolsDisplayed.includes(tool)) {
  //         if (!foundTools.includes(tool)) {
  //           return true
  //         }
  //       }
  //     }
  //     return false
  //   }
  //   this.toolsDisplayed = this.filteredTools.filter(isGoodTool)
  // }

  deleteTool(i) {
    this.currentUser.foundTools.splice(i, 1);
  }

  addJob() {
    this.currentUser.positionHistory.push(
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
        isGovernment: false,
        agencyExperience: [
         {
            main: {
              title: '',
              data: [
                {
                    title: '',
                    score: 50
                }
              ]
            },
            offices: [
              {
                title: '',
                data: [
                  {
                      title: '',
                      score: 50
                  }
                ]
              }
            ]
          }
        ],
        isPM: false,
        isKO: false,
        Description: ''
      }
    );
  }

  deleteJob(i) {
    this.currentUser.positionHistory.splice(i, 1);
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
      CertificationName: '',
      DateEarned: ''
    });
  }

  deleteCertificate(i) {
    this.currentUser.certification.splice(i, 1);
  }

  addAgency(job) {
    job.agencyExperience.push({
      main: {
        title: '',
        data: [{
          title: 'Years Agency Experience',
          score: 100
        }]
      },
      offices: [{
        title: '',
        data: [{
          title: 'Years Agency Experience',
          score: 100
        }]
      }]
    });
  }

  deleteAgency(job, i) {
    job.agencyExperience.splice(i, 1);
  }
  addOffice(agency) {
    agency.offices.push({
      title: '',
      data: [{
        title: 'Years Agency Experience',
        score: 100
      }]
    });
  }

  deleteOffice(agency, i) {
    agency.offices.splice(i, 1);
  }


  currentYear() {
    let year = new Date().getFullYear()
    return year;
  }

  updateProfile(model) {
    for (var i = 0; i < this.currentUser.positionHistory.length; i++) {
      if (this.currentUser.positionHistory[i].isGovernment) {
        this.currentUser.positionHistory[i].agencyExperience[0].main.title = this.currentUser.positionHistory[i].Employer
      }
      for (var x = 0; x < this.currentUser.positionHistory[i].agencyExperience.length; x++) {
        const endDate = +this.currentUser.positionHistory[i].EndDate.slice(0, 4);
        const startDate = +this.currentUser.positionHistory[i].StartDate.slice(0, 4);
        const yearsWorked = (endDate - startDate)
        this.currentUser.positionHistory[i].agencyExperience[0].main.data[0].score = yearsWorked
      }
    }
    // Mongo cannot update a model if _id field is present in the data provided for the update, so we delete it
    delete model['_id']
    this.userService.updateUser(this.route.snapshot.params['id'], model).toPromise().then(result => console.log(result));
    window.scrollTo(0, 0);
    this.router.navigate(['user-profile', this.route.snapshot.params['id']]);
  }


}
