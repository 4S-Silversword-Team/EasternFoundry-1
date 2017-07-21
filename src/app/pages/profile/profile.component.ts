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
      this.currentUser = result[0];
      myCallback()
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
      for (let index of this.currentUser.strength) {
        this.strengthChartLabels.push(index.skill)
        temp.push(index.score)
      }
      for (let index of this.currentUser.availability) {
        this.availabilityData.dates.push(index.date)
        this.availabilityData.values.push(index.available)
      }
      this.strengthChartDatas.push({data: temp, label: 'Strength'})
      for (let job of this.currentUser.positionHistory) {
        job.Year = +job.StartDate.slice(0, 4);
      }

      this.promiseFinished = true;
    }

  }

  ngOnInit() {
  }

  getCapaChartValues(tempUser: User): number[] {
    let temp: number[] = []
    for (let index of tempUser.capability) {
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

  expMainValues(tempUser: User): number[] {
    let temp: number[] = []
    for (let job of this.currentUser.positionHistory) {
      for (let exp of job.agencyExperience) {
        for (let data of exp.main.data) {
          temp.push(data.score)
        }
      }
    }
    return temp
  }

  expSub1Values(tempUser: User): number[] {
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
