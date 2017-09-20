import {Http} from '@angular/http';

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../../classes/user'
import { UserService } from '../../services/user.service'
import { Tool } from '../../classes/tool'
import { ToolService } from '../../services/tool.service'
import { ToolSubmissionService } from '../../services/toolsubmission.service'
import {isUndefined} from "util";
import { AuthService} from "../../services/auth.service"
import { s3Service } from "../../services/s3.service"

import { environment } from "../../../environments/environment"



declare var $: any;

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  providers: [ UserService, AuthService, ToolService, ToolSubmissionService, s3Service ]
})
export class ProfileEditComponent implements OnInit {

  @ViewChild('fileInput') fileInput;

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
  filteredTools: any[] = []
  filteredToolsFromProfile: any[] = []
  validNames: string[] = []
  toolSubmitted: boolean = false
  fieldsFilled = false
  months: any[] = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'
  ]
  employmentCheck: any[] = []

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
    public location: Location,
    private auth: AuthService,
    private toolService: ToolService,
    private toolSubmissionService: ToolSubmissionService,
    private s3Service: s3Service
  ) {
    auth.isLoggedIn().then(res => {
      !res ? this.router.navigateByUrl("/login"): afterLogin()
    }).catch(reason => {console.log("login check failed. redirecting"); this.router.navigateByUrl("/login")})
    // this.currentUser = this.userService.getUserbyID(this.route.snapshot.params['id'])
    let afterLogin = () => {
      this.auth.getLoggedInUser() == this.route.snapshot.params['id']? console.log("welcome to your profile edit page"): (() => { console.log("login check failed. redirecting"); this.router.navigateByUrl("/login")})()
      this.toolService.getTools().then(val => {
        this.allTools = val
      });

    if (this.router.url !== '/user-profile-create') {
        this.userService.getUserbyID(this.route.snapshot.params['id']).toPromise().then((result) => {
        this.currentUser = result;
        if(!this.currentUser.positionHistory[0]){
          console.log("NO POS HISTORY.") //TODO create backend functionality for default pos history

        }
        function stringToBool(val) {
          return (val + '').toLowerCase() === 'true';
        };

        //this is the code that makes sure the availability bar lines up with the current date & starts on the current month
        //i haven't fully tested it, it may not work properly on dummy data.
        //i may need to duplicate it elsewhere, but for the moment it's a decent way to keep the bar updated

        var date = new Date(),
            locale = "en-us",
            month = date.toLocaleString(locale, { month: "long" }).slice(0,3);
        var year = new Date().getFullYear()
        //if one of your jobs is tagged as "current", it assumes you're unavailable and vice versa
        var avail = true
        for (let pos of this.currentUser.positionHistory) {
          if (pos.EndDate.toLowerCase() == "current"){
            avail = false
          }

        }

        var currentDate = month + ', ' + year.toString().slice(2,4)
        while (this.currentUser.availability.length > 1 && this.currentUser.availability[0].date != currentDate) {
          this.currentUser.availability.splice(0,1)
        }
        if (this.currentUser.availability[0].date != currentDate) {
          this.currentUser.availability.splice(0,1)
          this.currentUser.availability.push({
            date: currentDate,
            available: avail
          })
        }
        while (this.currentUser.availability.length < 7){
          var lastNum = this.currentUser.availability.length
          var nextNum = this.months.indexOf(this.currentUser.availability[this.currentUser.availability.length - 1].date.slice(0,3)) + 1
          if (nextNum >= this.months.length) {
            nextNum = 0
            year = year + 1
          }
          this.currentUser.availability.push({
            date: this.months[nextNum] + ', ' + year.toString().slice(2,4),
            available: avail
          })
        }

        for (let index of this.currentUser.availability) {
          this.availabilityData.dates.push(index.date)
          this.availabilityData.values.push(index.available)
        }

        //here's the logic to check the skillsengine tools against the resume text!
        if (this.currentUser.resumeText && this.currentUser.foundTools[0] == undefined) {
          for (let tool of this.currentUser.tools) {
            if (tool.title.length > 1) {
              if (this.currentUser.resumeText.toLowerCase().indexOf(tool.title.toLowerCase()) >= 0) {
                var toolToAdd = {
                  title: '',
                  category: '',
                  classification: '',
                  position: []
                }
                toolToAdd.title = tool.title
                toolToAdd.category = tool.category
                toolToAdd.classification = tool.classification
                if (this.currentUser.foundTools == null) {
                  this.currentUser.foundTools = [
                    {
                      title: '',
                      category: '',
                      classification: '',
                      position: []
                    }
                  ]
                  this.currentUser.foundTools[0] = toolToAdd
                } else {
                  this.currentUser.foundTools.push(toolToAdd)
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
            if (typeof this.currentUser.positionHistory[i].isPM === "string") {
              this.currentUser.positionHistory[i].isPM = stringToBool(this.currentUser.positionHistory[i].isPM)
            }
            if (typeof this.currentUser.positionHistory[i].isKO === "string") {
              this.currentUser.positionHistory[i].isKO = stringToBool(this.currentUser.positionHistory[i].isKO)
            }
            if (this.currentUser.positionHistory[i].EndDate == null) {
              this.currentUser.positionHistory[i].EndDate = "Current"
            }
          }
          if (this.currentUser.education[0] == null){
            this.currentUser.education[0] = {
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
          }
          if (this.currentUser.education[0].DegreeType[0] == null) {
            this.currentUser.education[0].DegreeType.push({Name: ''})
          }
          this.checkFields()
          this.promiseFinished = true;
        });
      }
    }
  }

  ngOnInit() {
  }


  uploadPhoto() {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      let formData = new FormData();
      let file = fileBrowser.files[0]
      console.log(file)
      formData.append("bucket", environment.bucketName);
      formData.append("key", "userPhotos/"+this.currentUser._id+"_0");
      formData.append("file", file);
      this.s3Service.postPhoto(formData).toPromise().then(result => {
        console.log("Photo upload success",result) ;
        this.currentUser.avatar = "http://s3.amazonaws.com/" + environment.bucketName + "/userPhotos/"+this.currentUser._id+"_0";
        this.updateProfile(this.currentUser, true);
      }).catch((reason) =>console.log("reason ", reason));
    }
  }

  checkFields(){
    var profileCheck = true
    if (!this.currentUser.firstName || !this.currentUser.lastName || !this.currentUser.username || !this.currentUser.cell || !this.currentUser.address.city || !this.currentUser.address.state){
      profileCheck = false
    }

    var degreesCheck = true
    for (let degree of this.currentUser.education) {
      if (!degree.DegreeType[0].Name || !degree.MajorProgramName || !degree.School || !degree.AttendanceEndDate) {
        degreesCheck = false
      }
    }

    var positionCheck = true
    for (let job of this.currentUser.positionHistory) {
      if (!job.PositionTitle || !job.EndDate || !job.StartDate || !job.Employer) {
        positionCheck = false
      }
    }

    var certCheck = true
    for (let cert of this.currentUser.certification) {
      if (!cert.CertificationName || !cert.DateEarned) {
        certCheck = false
      }
    }

    var clearCheck = true
    for (let clear of this.currentUser.clearance) {
      if (!clear.clearanceType || !clear.awarded || !clear.expiration) {
        clearCheck = false
      }
    }

    var awardCheck = true
    for (let award of this.currentUser.award) {
      if (award.length < 1) {
        awardCheck = false
      }
    }

    if (
      profileCheck &&
      degreesCheck &&
      positionCheck &&
      certCheck &&
      clearCheck &&
      awardCheck
    ) {
      this.fieldsFilled = true
    }
    else {
      this.fieldsFilled = false
    }
  }

  editPhoto() {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      if(!this.currentUser._id){console.log("no id"); return;}
      const uid = this.currentUser._id;
      let formData = new FormData();
      let file = fileBrowser.files[0]
      let myArr = this.currentUser.avatar.split("_")
      let i: any = myArr[myArr.length - 1]
      i = parseInt(i);
      console.log(file)
      formData.append("bucket", environment.bucketName);
      formData.append("key", "userPhotos/"+uid+"_"+(i+1).toString());
      formData.append("file", file);
      this.s3Service.postPhoto(formData).toPromise().then(result => {
        console.log("Photo upload success",result);
        this.currentUser.avatar = "http://s3.amazonaws.com/" + environment.bucketName + "/userPhotos/"+uid+"_"+(i+1).toString()
        this.updateProfile(this.currentUser, true);
        this.s3Service.deletePhoto("/userPhotos/"+uid+"_"+(i).toString()).toPromise().then( res => console.log("Old photo deleted " + res))
      }).catch((reason) =>console.log("reason ", reason));
    }

  }


  saveChanges() {
    console.log('This button doesnt do anything!')
  }

  availabilitySwitch(index, i){
    index = !index
    console.log(index)
  }

  addTool(tool) {
    this.currentUser.foundTools.push(tool);
  }

  toolIsNotListedAlready(tool){
    if (!this.validNames.includes(tool.title.toLowerCase())) {
      return true
    } else {
      return false
    }
  }
  toolIsValid(tool) {
    var toolNames = []
    for (let tool of this.currentUser.foundTools) {
      toolNames.push(tool.title.toLowerCase())
    }
    if (tool.title.toLowerCase().includes(this.toolSearch.toLowerCase())) {
      if (!toolNames.includes(tool.title.toLowerCase())) {
        this.validNames.push(tool.title.toLowerCase())
        return true
      }
    }
    return false
  }

  updateToolList(search){
    this.validNames = []
    var toolSearch = this.toolSearch
    var foundTools = this.currentUser.foundTools
    function isGoodTool(tool) {
      if (tool.title.toLowerCase().includes(toolSearch.toLowerCase())) {
        for (let t of foundTools) {
          if (t.title.toLowerCase() == tool.title.toLowerCase()) {
            return false
          }
        }
        return true
      }
      return false
    }
    var tools1 = this.currentUser.tools.filter(isGoodTool)
    function isGoodTool2(tool) {
      if (tool.title.toLowerCase().includes(toolSearch.toLowerCase())) {
        if (foundTools.includes(tool)) {
          return false
        }
        for (let t of tools1) {
          if (t.title.toLowerCase() == tool.title.toLowerCase()) {
            return false
          }
        }
        return true
      }
      return false
    }
    this.filteredToolsFromProfile = tools1
    this.filteredTools = this.allTools.filter(isGoodTool2)
    // for (let tool of this.filteredTools){
    //   for (let position of tool.positions){
    //     for (let occupation of this.currentUser.occupations) {
    //       if (position.toLowerCase() == occupation.title.toLowerCase()){
    //
    //       }
    //     }
    //   }
    // }
  }

  setEmployment(job, num){
    console.log(job.employmentType)
    job.employmentType = num
    console.log(job.employmentType)
  }

  submitNewTool(tool){
    var newTool = {
      userName: '',
      userId: '',
      toolName: ''
    }
    newTool.userName = this.currentUser.firstName + ' ' + this.currentUser.lastName
    newTool.userId = this.currentUser._id
    newTool.toolName = this.toolSearch
    this.toolSubmissionService.createToolSubmission(newTool).toPromise();
    this.toolSubmitted = true;

  }

  deleteTool(i) {
    this.currentUser.foundTools.splice(i, 1);
    this.checkFields()
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
        employmentType: 3,
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
    this.checkFields()
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
    this.checkFields()
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
    this.checkFields()
  }


  addAward() {
    this.currentUser.award.push(
      ''
    );
  }

  deleteAward(i) {
    this.currentUser.award.splice(i, 1);
    this.checkFields()
  }

  addCertificate() {
    this.currentUser.certification.push({
      CertificationName: '',
      DateEarned: ''
    });
  }

  deleteCertificate(i) {
    this.currentUser.certification.splice(i, 1);
    this.checkFields()
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
    this.checkFields()
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
    this.checkFields()
  }


  currentYear() {
    let year = new Date().getFullYear()
    return year;
  }

  currentMonth() {
    var date = new Date(),
        locale = "en-us",
        month = date.toLocaleString(locale, { month: "long" });
    return month;
  }

  updateProfile(model, noNav?: boolean) {
    function moveObject (array, old_index, new_index) {
      if (new_index >= array.length) {
          var k = new_index - array.length;
          while ((k--) + 1) {
              array.push(undefined);
          }
      }
      array.splice(new_index, 0, array.splice(old_index, 1)[0]);
    };

    //this SHOULD automatically arrange jobs by date so more recent ones are on top. it doesnt seem to work 100% but it kind of works?
    for (var i = 0; i < this.currentUser.positionHistory.length; i++) {
      if (this.currentUser.positionHistory[i].EndDate == "Current") {
        moveObject(this.currentUser.positionHistory, i, 0)
      } else {
        if (this.currentUser.positionHistory[i+1]) {
          while (+this.currentUser.positionHistory[i].EndDate.replace("-", "").replace("-", "") < +this.currentUser.positionHistory[i+1].StartDate.replace("-", "").replace("-", "")) {
            moveObject(this.currentUser.positionHistory, i, i+1)
          }
        }
        if (i > 1) {
          while (+this.currentUser.positionHistory[i].StartDate.replace("-", "").replace("-", "") > +this.currentUser.positionHistory[i-1].EndDate.replace("-", "").replace("-", "")) {
            moveObject(this.currentUser.positionHistory, i, i-1)
          }
        }
      }
    }
    for (var i = 0; i < this.currentUser.positionHistory.length; i++) {
      if (this.currentUser.positionHistory[i].employmentType == 0) {
        this.currentUser.positionHistory[i].agencyExperience[0].main.title = this.currentUser.positionHistory[i].Employer
      }
      for (var x = 0; x < this.currentUser.positionHistory[i].agencyExperience.length; x++) {
        var endDate = 0
        if (this.currentUser.positionHistory[i].EndDate.slice(0, 4) == "Curr") {
          endDate = 2017;
        } else {
          endDate = +this.currentUser.positionHistory[i].EndDate.slice(0, 4);
        }
        const startDate = +this.currentUser.positionHistory[i].StartDate.slice(0, 4);
        var yearsWorked = (endDate - startDate)
        this.currentUser.positionHistory[i].agencyExperience[0].main.data[0].score = yearsWorked
      }
    }
    // Mongo cannot update a model if _id field is present in the data provided for the update, so we delete it
    delete model['_id']
    this.userService.updateUser(this.route.snapshot.params['id'], model).toPromise().then(result => {console.log(result); this.currentUser = result});
    if(!noNav) {
      window.scrollTo(0, 0);
      this.router.navigate(['user-profile', this.route.snapshot.params['id']]);
    }
  }


}
