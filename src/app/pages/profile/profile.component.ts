import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../../classes/user'
import { UserService } from '../../services/user.service'
import { AuthService } from '../../services/auth.service'

import { Highcharts } from 'angular-highcharts';

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
  chart: Highcharts;
  agencyExperience: any[] = []
  isActiveProfile: boolean = false


  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private auth: AuthService
  ) {
//    console.log(this);
    // this.currentUser = this.userService.getTempUser();
    this.auth.isLoggedIn().then(() => this.auth.getLoggedInUser() == this.route.snapshot.params['id']? this.isActiveProfile = true: this.isActiveProfile = false).catch((reason) => "User Login Check failed")

    this.userService.getUserbyID(this.route.snapshot.params['id']).toPromise().then((result) => {
      this.currentUser = result;
      myCallback();
    });

    var myCallback = () => {
      let index: number = 0
      this.availabilityData.values = []
      this.availabilityData.dates = []
      for (let job of this.currentUser.positionHistory) {
        for (let exp of job.agencyExperience) {
          for (let data of exp.main.data) {
            let color = index / exp.main.data.length * 155
            color = Math.floor(color)
            this.expColors[exp.main.title] = this.expColors[index++]
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
            if (agency.main.title !== "") {
              if (agency.main.title == i.main.title) {
                i.main.data[0].score = (i.main.data[0].score + agency.main.data[0].score)
                nameMatch = true
              }
            }
          }
          if (nameMatch == false) {
            if (this.agencyExperience[0] == null) {
              this.agencyExperience[0] = job.agencyExperience[0]
            } else {
              this.agencyExperience.push(agency)
            }
          }
        }
      }
      console.log(this.agencyExperience[0].main)
      console.log(this.agencyExperience[1].main)
      console.log(this.agencyExperience[2].main)
      function stringToBool(val) {
        return (val + '').toLowerCase() === 'true';
      };

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
      this.promiseFinished = true;
    }
    this.generateToolChart();
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

  getCapaChartValues(tempUser: User): number[] {
    let temp: number[] = []
    for (let index of tempUser.occupations) {
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
            temp.push(data.score);
          }
        }
      }
    }
    return temp;
  }

  currentYear() {
    let year = new Date().getFullYear();
    return year;
  }

  back() {
    this.location.back();
  }

  editProfile() {
    this.router.navigate(['user-profile-edit', this.currentUser['_id']]);
  }

    generateToolChart(){
      console.log("tool chart generation is \"implemented\" but i need to figure out how to log in locally to test it....");
//     var data_prof = new Map();
//     var data_peop = new Map();
// //    var tool = [];
//     var tools = [];
//     var prof = [];
//     var peop = [];
//     var numPeop = 0;
//     console.log(this.currentUser);
// //    console.log(this.currentUser[0].userProfile);
//   //   for(const i of this.currentUser){
//   //     numPeop++;
//   //     var member = i;;
//   //     for( var j = 0; j < member.tools.length; j++){
//   //       if( parseInt(member.tools[j].score) > 30 || data_prof.has(member.tools[j].title) ){
//   //         if( data_prof.has(member.tools[j].title) ){
//   //           data_prof.set(member.tools[j].title, data_prof.get(member.tools[j].title) + parseInt(member.tools[j].score));
//   //           data_peop.set(member.tools[j].title, data_peop.get(member.tools[j].title) + 1);
//   //         }
//   //         if( !data_prof.has(member.tools[j].title) ){
//   //           data_prof.set(member.tools[j].title, parseInt(member.tools[j].score));
//   //           data_peop.set(member.tools[j].title, 1);
//   //           tools.push(member.tools[j].title);
//   //         }
//   //     }
//   //   }
//   // }
//   // for( var k = 0; k < gen_work_act.length; k++){
//   //   data_prof.set( tools[k], ( data_prof.get(tools[k])/data_peop.get(tools[k]) ) );
//   //   prof[k] = data_prof.get( tools[k] );
//   //   peop[k] = data_peop.get( tools[k] );
//   // }
//
//     var options = {
//
//           chart: {
//               type: 'bar',
//               backgroundColor: '#FDF5EB',
//               renderTo: "tool_chart"
//           },
//           title: {
// //              text: 'Skills'
//                 text:''
//           },
//           xAxis: [{
// //              categories: skill,
//               categories: tools,
//               options : {
//                   endOnTick: false
//               },
//
//
//           }],
//           yAxis: [{ // Primary yAxis
// //            tickInterval: Math.round(100/numPeop),
// //            tickAmount: numPeop,
// //            max: 100,
//               // endOnTick:false ,
//               max:100,
//               min:0,
//               endOnTick: false,
//               alignTicks: false,
//
//               ceiling: 100,
//               labels: {
//                   format: '{value}%',
//                   style: {
//                       color: Highcharts.getOptions().colors[1]
//                   },
//               },
//               title: {
//                   text: 'Proficiency',
//                   style: {
//                       color: Highcharts.getOptions().colors[1]
//                   }
//               },
//           }, { // Secondary yAxis
//               max: numPeop,
//               tickInterval: 1,
// //            tickAmount: numPeop,
// //              endOnTick:false ,
//               min:0,
//               endOnTick: false,
//               alignTicks: false,
//
//               title: {
//                   text: 'Number of Employees',
//                   style: {
//                       color: Highcharts.getOptions().colors[0]
//                   }
//               },
//               labels: {
//                   step: 1,
//                   format: '{value:.0f}',
//                   style: {
//                       color: Highcharts.getOptions().colors[0]
//                   }
//               },
//               opposite: true
//           }],
//           tooltip: {
//               shared: true
//           },
//           series: [{
//               name: 'People',
//               type: 'column',
//               yAxis: 1,
//               data: peop,
//               tooltip: {
//                   valueSuffix: ' '
//               }
//
//           }, {
//               name: 'Proficiency',
//               type: 'column',
//               data: prof,
//               tooltip: {
//                   valueSuffix: '%'
//               }
//           }]
//     };
//     this.chart = new Highcharts.chart(options);
   }
//





}
