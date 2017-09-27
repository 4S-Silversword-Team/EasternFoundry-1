import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../../classes/user'
import { UserService } from '../../services/user.service'
import { AuthService } from '../../services/auth.service'


declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  providers: [UserService, AuthService],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: User = new User()
  expColors: string[] = ['rgb(0,178,255)', 'rgb(69,199,255)', 'rgb(138,220,255)', 'rgb(198,241,255)' ];
  strengthChartDatas: any[] = []
  strengthChartLabels: string[] = []
  promiseFinished: boolean = false
  availabilityData: any = {
    values: [],
    dates: []
  }
  agencyExperience: any[] = []
  isActiveProfile: boolean = false
  currentJob: any = null
  positionHistory: any[] = []
  occupations: any[] = []
  months: any[] = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Nov', 'Dec'
  ]

  yearsOfSchool: number = 0;
  yearsOfWork: number = 0;
  professionalPoints: number = 0;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private auth: AuthService
  ) {

    // this.currentUser = this.userService.getTempUser();
    this.auth.isLoggedIn().then(() => this.auth.getLoggedInUser() == this.route.snapshot.params['id']? this.isActiveProfile = true: this.isActiveProfile = false).catch((reason) => "User Login Check failed")

    this.userService.getUserbyID(this.route.snapshot.params['id']).toPromise().then((result) => {
      this.currentUser = result;
      if (!this.currentUser.finished && this.isActiveProfile){
        this.router.navigateByUrl("/user-profile-edit/" + this.currentUser._id)
      } else {
        myCallback();
      }
    });

    var myCallback = () => {
      let index: number = 0
      this.availabilityData.values = []
      this.availabilityData.dates = []

      for (let job of this.currentUser.positionHistory) {
        if (job.EndDate) {
          if (job.EndDate == "Current") {
            this.currentJob = job
          } else {
            if (this.currentJob == null) {
              this.currentJob = job
            } else if (this.currentJob.endDate != "Current"){
              var jobYear = +job.EndDate.slice(0, 4);
              var currentYear = +this.currentJob.EndDate.slice(0, 4);
              if (jobYear > currentYear) {
                this.currentJob = job
              } else if (jobYear == currentYear) {
                var jobMonth = +job.EndDate.slice(5, 2);
                var currentMonth = +this.currentJob.EndDate.slice(5, 2);
                if (jobMonth > currentMonth) {
                  this.currentJob = job
                }
              }
            }
          }
          for (let exp of job.agencyExperience) {
            for (let data of exp.main.data) {
              let color = 4
              color = Math.floor(color)
              this.expColors[exp.main.title] = this.expColors[index++]
            }
          }
        }
      }

      let temp: number[] = []
      if(this.currentUser.abilities) {
        for (let index of this.currentUser.abilities) {
          this.strengthChartLabels.push(index[0])
          temp.push(+index[1])
        }
      }

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
      this.strengthChartDatas.push({data: temp, label: 'Strength'})

      for (let job of this.currentUser.positionHistory) {
        job.Year = +job.StartDate.slice(0, 4);
        for (let agency of job.agencyExperience) {
          var nameMatch = false

          for (let i of this.agencyExperience) {
            if (agency.main.title.length !=- "") {
              if (agency.main.title == i.main.title) {
                i.main.data[0].score = (i.main.data[0].score + agency.main.data[0].score)
                nameMatch = true
              }
            }
          }
          if (nameMatch == false && job.agencyExperience[0].main.title.length > 0) {
            if (this.agencyExperience[0] == null) {
              this.agencyExperience[0] = job.agencyExperience[0]
            } else {
              this.agencyExperience.push(agency)
            }
          }
        }
      }

      var toolsToPush = []
      for (let tool of this.currentUser.foundTools) {
        var matchFound = false
        for (let position of tool.position) {
          for (let toolDone of toolsToPush) {
            if (position == toolDone.title) {
              toolDone.score += 5
              matchFound = true
            }
          }
          if (!matchFound) {
            var newPosition = {
              title: '',
              score: 0
            }
            newPosition.title = position
            newPosition.score = 5
            toolsToPush.push(newPosition)
          }
        }
      }
      if (toolsToPush.length < 2) {
        for (let o of this.currentUser.occupations) {
          var newOccupation = {
            title: '',
            score: 0
          }
          newOccupation.title = o.title
          newOccupation.score = o.score
          this.occupations.push(newOccupation)

        }
      } else {
        for (let tool of toolsToPush) {
          for (let o of this.currentUser.occupations) {
            if (tool.title == o.title) {
              tool.score += (o.score / 5)
            }
          }
          if (tool.score > 50) {
            this.occupations.push(tool)
          }
        }
      }
      // for (let o of this.occupations) {
      //   console.log(o.title + ' ' + o.score)
      // }

      function stringToBool(val) {
        return (val + '').toLowerCase() === 'true';
      };

      //right now when a user is created the json assigns the string value "true" or "false" to booleans instead of the actual true or false.
      //i can't figure out how to fix that in the backend so now it just gets cleaned up when it hits the frontend
      if (typeof this.currentUser.disabled === "string") {
        this.currentUser.disabled = stringToBool(this.currentUser.disabled)
      }
      for (var i = 0; i < this.currentUser.positionHistory.length; i++) {
        for (var x = 0; x < this.currentUser.positionHistory[i].agencyExperience.length; x++) {
          if (typeof this.currentUser.positionHistory[i].agencyExperience[x].main.isPM === "string") {
            this.currentUser.positionHistory[i].agencyExperience[x].main.isPM = stringToBool(this.currentUser.positionHistory[i].agencyExperience[x].main.isPM)
          }
          if (typeof this.currentUser.positionHistory[i].agencyExperience[x].main.isKO === "string") {
            this.currentUser.positionHistory[i].agencyExperience[x].main.isKO = stringToBool(this.currentUser.positionHistory[i].agencyExperience[x].main.isKO)
          }
          for (var y = 0; y < this.currentUser.positionHistory[i].agencyExperience[x].offices.length; y++) {
            if (typeof this.currentUser.positionHistory[i].agencyExperience[x].offices[y].isPM === "string") {
              this.currentUser.positionHistory[i].agencyExperience[x].offices[y].isPM = stringToBool(this.currentUser.positionHistory[i].agencyExperience[x].offices[y].isPM)
            }
            if (typeof this.currentUser.positionHistory[i].agencyExperience[x].offices[y].isKO === "string") {
              this.currentUser.positionHistory[i].agencyExperience[x].offices[y].isKO = stringToBool(this.currentUser.positionHistory[i].agencyExperience[x].offices[y].isKO)
            }
          }
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

      // for (let e of this.currentUser.education) {
      //   var years =
      // }
      // yearsOfSchool
      for (let j of this.currentUser.positionHistory) {
        if (j.EndDate !== "Current") {
          var endYear = +j.EndDate.slice(0, 4)
          var startYear = +j.StartDate.slice(0, 4)
        } else {
          var endYear = new Date().getFullYear()
          var startYear = +j.StartDate.slice(0, 4)
        }
        this.yearsOfWork += (endYear - startYear)

        if (j.EndDate !== "Current") {
          var endMonth = +(((+j.EndDate.slice(5, 7))/12).toFixed(2))
          var startMonth = +(((+j.StartDate.slice(5, 7))/12).toFixed(2))
        } else {
          var endMonth = new Date().getMonth()
          var endMonth = +((+endMonth/12).toFixed(2))
          var startMonth = +(((+j.StartDate.slice(5, 7))/12).toFixed(2))
        }
        this.yearsOfWork += (endMonth - startMonth)
      }
      this.professionalPoints = (this.yearsOfWork + this.currentUser.certification.length) * 50
      console.log(this.professionalPoints)
      this.promiseFinished = true;
    }

  }

  ngOnInit() {
  }

  // getCapaChartValues(tempUser: User): number[] {
  //   let temp: number[] = []
  //   for (let index of tempUser.skills) {
  //     temp.push(+index[1])
  //   }
  //   return temp
  // }

  // getCapaChartValues(tempUser: User): number[] {
  //   let temp: number[] = []
  //   if (tempUser.occupations) {
  //     for (let index of tempUser.occupations) {
  //       temp.push(index.score)
  //     }
  //   }
  //   return temp
  // }

  getCapaChartValues(occupations): number[] {
    let temp: number[] = []
    for (let index of occupations) {
      temp.push(index.score)
    }
    return temp
  }


  getCapaChartColor(score: number): string {
    let temp: string
    var color: number = score/100*155
    color = Math.floor(color)
    temp = 'rgb(' + color.toString() + ',' + color.toString() + ',' + color.toString() + ')'
    return temp
  }

  expMainValues(tempUser: User, jobNum, agencyNum): number[] {
    let temp: number[] = []
    for (let data of this.agencyExperience[agencyNum].main.data) {
      temp.push(data.score * 10)
    }
    return temp
  }

  expSub1Values(tempUser: User, jobNum, agencyNum, officeNum): number[] {
    let temp: number[] = []
    for (let data of this.currentUser.positionHistory[jobNum].agencyExperience[agencyNum].offices[officeNum].data) {
      temp.push(data.score)
    }
    return temp
  }

  expSub2Values(tempUser: User): number[] {
    let temp: number[] = []
    for (let job of this.currentUser.positionHistory) {
      for (let exp of job.agencyExperience) {
        for (let office of exp.offices) {
          for (let data of office.data) {
            temp.push(data.score)
          }
        }
      }
    }
    return temp
  }

  currentYear() {
    let year = new Date().getFullYear()
    return year
  }

  back() {
    this.location.back()
  }

  editProfile() {
    this.router.navigate(['user-profile-edit', this.currentUser['_id']]);
  }

}
