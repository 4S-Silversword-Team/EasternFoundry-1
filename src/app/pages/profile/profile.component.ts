import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../../classes/user'
import { UserService } from '../../services/user.service'

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  providers: [UserService],
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


  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location
  ) {

    // this.currentUser = this.userService.getTempUser();


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
      for (let index of this.currentUser.abilities) {
        this.strengthChartLabels.push(index[0])
        temp.push(+index[1])
      }
      for (let index of this.currentUser.availability) {
        this.availabilityData.dates.push(index.date)
        this.availabilityData.values.push(index.available)
      }
      this.strengthChartDatas.push({data: temp, label: 'Strength'})
      for (let job of this.currentUser.positionHistory) {
        job.Year = +job.StartDate.slice(0, 4);
      }

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
      if (this.currentUser.education[0].DegreeType[0] == null) {
        this.currentUser.education[0].DegreeType.push({Name: ''})
      }
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
    for (let data of this.currentUser.positionHistory[jobNum].agencyExperience[agencyNum].main.data) {
      temp.push(data.score)
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
