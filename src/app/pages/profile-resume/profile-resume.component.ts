import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Http} from '@angular/http';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Chart } from 'angular-highcharts';
import { PastPerformance } from '../../classes/past-performance';
import { User } from '../../classes/user'

import { UserService } from '../../services/user.service'
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service'
import * as jsPDF  from 'jspdf'
import * as html2canvas from 'html2canvas';


declare var $: any;

@Component({
  selector: 'app-profile-resume',
  templateUrl: './profile-resume.component.html',
  providers: [UserService, CompanyService, AuthService],
  host: {'(window:keydown)': 'hotkeys($event)'},
  styleUrls: ['./profile-resume.component.css']
})
export class ProfileResumeComponent implements OnInit {

  currentUser: User = new User()
  promiseFinished: Boolean = false
  jobTitle: String = ''

  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private auth: AuthService,
    private http: Http,

  ) {

    this.userService.getUserbyID(this.route.snapshot.params['id']).toPromise().then((result) => {
      this.currentUser = result;
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
