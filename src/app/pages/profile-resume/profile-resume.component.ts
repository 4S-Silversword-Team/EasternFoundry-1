import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Http} from '@angular/http';
import { Title } from '@angular/platform-browser';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../../classes/user'

import { UserService } from '../../services/user.service'
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service'
// import * as jsPDF  from 'jspdf';
import * as html2canvas from 'html2canvas';


declare var $: any;

@Component({
  selector: 'app-profile-resume',
  templateUrl: './profile-resume.component.html',
  providers: [UserService, CompanyService, AuthService],
  // host: {'(window:keydown)': 'hotkeys($event)'},
  styleUrls: ['./profile-resume.component.css']
})
export class ProfileResumeComponent implements OnInit {

  currentUser: User = new User()
  promiseFinished: Boolean = false
  jobTitle: String = ''
  agencyExperience: {
    title: string,
    years: number,
    offices: {
      title: string,
      years: number,
    }[]
  }[] = []

  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private auth: AuthService,
    private http: Http,
    private titleService: Title,

  ) {

    this.userService.getUserbyID(this.route.snapshot.params['id']).toPromise().then((result) => {
      this.currentUser = result;
      this.titleService.setTitle(this.currentUser.firstName + ' ' + this.currentUser.lastName + "'s Resume - Federal Foundry Forge")

      var toolsToPush = []
      for (let tool of this.currentUser.foundTools) {
        var matchFound = false
        for (let position of tool.position) {
          for (let toolDone of toolsToPush) {
            if (position == toolDone.title) {
              toolDone.score += 7
              matchFound = true
            }
          }
          if (!matchFound) {
            var newPosition = {
              title: position,
              score: 7
            }
            toolsToPush.push(newPosition)
          }
        }
      }
      for (let tool of toolsToPush) {
        for (let o of this.currentUser.occupations) {
          if (tool.title == o.title) {
            tool.score += (o.score / 5)
          }
        }
      }
      toolsToPush.sort(function(a,b){
        return parseFloat(b.score) - parseFloat(a.score);
      })
      // if ()
      this.jobTitle = toolsToPush[0].title
      if (this.jobTitle.slice(-1) == 's'){
        this.jobTitle = this.jobTitle.substring(0, this.jobTitle.length-1)
      }

      for (let p of this.currentUser.positionHistory) {
        for (let a of p.agencyExperience) {
          console.log(p.Employer + ' - ' + a.main.title)
          if (a.main.title){
            console.log(p.EndDate.slice(0, 4) + ' - ' + p.StartDate.slice(0, 4))
            var agencyFound = false
            for (let existing of this.agencyExperience) {
              if (a.main.title == existing.title){
                agencyFound = true
                if (p.EndDate == 'Current'){
                  var endYear = new Date().getFullYear()
                } else {
                  var endYear = +p.EndDate.slice(0, 4)
                }
                var startYear = +p.StartDate.slice(0, 4)
                var years = (endYear - startYear)
                if (years == 0){
                  years = 1
                }
                existing.years += years
                break
              }
            }
            if (!agencyFound){
              if (p.EndDate == 'Current'){
                var endYear = new Date().getFullYear()
              } else {
                var endYear = +p.EndDate.slice(0, 4)
              }
              var startYear = +p.StartDate.slice(0, 4)
              var yearsWorked = endYear - startYear
              var offices = []
              for (let o of a.offices) {
                var officeFound = false
                for (let e of this.agencyExperience) {
                  for (let existing of e.offices) {
                    if (o.title == existing.title) {
                      console.log('office!!!!!!')
                      officeFound = true
                      if (p.EndDate == 'Current') {
                        var endYear = new Date().getFullYear()
                      } else {
                        var endYear = +p.EndDate.slice(0, 4)
                      }
                      var startYear = +p.StartDate.slice(0, 4)
                      var years = (endYear - startYear)
                      console.log(years)
                      if (years == 0){
                        years = 1
                      }
                      existing.years += years
                      break
                    }
                  }
                }
                if (!officeFound){
                  if (p.EndDate == 'Current'){
                    var endYear = new Date().getFullYear()
                  } else {
                    var endYear = +p.EndDate.slice(0, 4)
                  }
                  var startYear = +p.StartDate.slice(0, 4)
                  var yearsWorked = endYear - startYear
                  if (yearsWorked == 0){
                    yearsWorked = 1
                  }
                  offices.push({
                    title: o.title,
                    years: yearsWorked,
                  })
                }
              }
              this.agencyExperience.push({
                title: a.main.title,
                years: yearsWorked,
                offices: offices
              })
            }
          }
        }
      }
      console.log(this.agencyExperience)
      this.promiseFinished = true;
    });
  }

  ngOnInit() {
  }

  generateResume(){
    html2canvas(document.getElementById('resume-box'), {
      allowTaint: true,
      taintTest: false,
      onrendered: function(canvas) {
        document.getElementById('resume-pic').appendChild(canvas);
      }
    })
    // let doc = new jsPDF();
    // doc.text("Hello", 20, 20);
    // doc.autoPrint();
  }

}
