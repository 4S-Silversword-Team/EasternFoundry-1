import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Http} from '@angular/http';
import { Title } from '@angular/platform-browser';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Chart } from 'angular-highcharts';

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
  serviceChart: any;
  categoryChart: any;
  occupations: any[] = []
  categories: any[] = []
  allCategories: any[] = []
  contactString : string = ''

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
      this.http.get('../../../assets/occupations.json')
      .map((res: any) => res.json())
      .subscribe(
        (data: any) => {
          this.allCategories = data;
        },
        err => console.log(err), // error
        () => myCallback() // complete
      );

      var myCallback = () => {
      if (this.currentUser.phone[0].Number) {
        this.contactString += (this.currentUser.phone[0].Number + ', ')
      }
      this.contactString += this.currentUser.username
      if (this.currentUser.address.city) {
        this.contactString += (', ' + this.currentUser.address.city)
      }
      if (this.currentUser.address.state) {
        this.contactString += (', ' + this.currentUser.address.state)
      }

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
      for (let t of toolsToPush) {
        var newName
        var newCode
        for (let i of this.allCategories) {
          if (t.title == i.title){
            newName = i.category
            newCode = i.code.substring(0,2)
          }
        }
        var newCategory = {
          code: newCode,
          name: newName,
          score: 5
        }
        var match = false
        for (let c of this.categories) {
          if (newCategory.name == c.name) {
            match = true
            c.score = Math.round(c.score + (t.score / 5))
          }
        }
        if (!match){
          this.categories.push(newCategory)
        }
      }
      var serviceData = []
      var catPointsTotal = 0
      this.categories.sort(function(a,b){
        return parseFloat(b.score) - parseFloat(a.score);
      })
      this.categories = this.categories.slice(0,5)
      for (let c of this.categories) {
        catPointsTotal += c.score
      }
      for (let c of this.categories) {
        var percent = 360*(c.score/catPointsTotal)
        serviceData.push({
          name: c.name,
          y: percent
        })
      }
      var govCount = 0
      var contractorCount = 0
      var commercialCount = 0
      for (let job of this.currentUser.positionHistory) {
        if (job.employmentType == 0) {
          govCount++
        } else if (job.employmentType == 1) {
          contractorCount++
        } else if (job.employmentType == 2) {
          commercialCount++
        }
      }
      var totalCount = govCount + contractorCount + commercialCount
      var categoryData = []
      if (govCount > 0) {
        categoryData.push({
          name: 'Government',
          y: 360*(govCount / totalCount)
        })
      }
      if (contractorCount > 0) {
        categoryData.push({
          name: 'Contractor',
          y: 360*(contractorCount / totalCount)
        },)
      }
      if (commercialCount > 0) {
        categoryData.push({
          name: 'Commercial',
          y: 360*(commercialCount / totalCount)
        })
      }

      this.serviceChart = new Chart({
        chart: {
          type: 'pie',
          backgroundColor: 'rgba(0, 100, 200, 0.00)',
          renderTo: "service_chart",
        },
        annotations: {
          labelOptions: {
            style: {
              fontSize: '42px'
            }
          },
          labels: {
            overflow: 'elipses'
          }
        },
        credits: {
          enabled: false
        },
        title: {
          text: null
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            size: '100%',
            allowPointSelect: false,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              connectorPadding: 0,
              connectorWidth: 1,
              crop: true,
              distance: 5,
              format: '<b>{point.name}</b>',
              style: {
                  color: 'black'
              }
            }
          }
        },
        series: [{
          name: 'Focus',
          colorByPoint: true,
          data: serviceData,
        }]
      });
      this.categoryChart = new Chart({
        chart: {
          type: 'pie',
          backgroundColor: 'rgba(0, 100, 200, 0.00)',
          renderTo: "category_chart"
        },
        credits: {
          enabled: false
        },
        title: {
          text: null
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },

        plotOptions: {
          pie: {
            size: '100%',
            allowPointSelect: false,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              connectorPadding: 0,
              connectorWidth: 1,
              crop: false,
              distance: -2,
              format: '<b>{point.name}</b>',
              style: {
                  color: 'black'
              }
            }
          }
        },
        series: [{
          name: 'Focus',
          colorByPoint: true,
          data: categoryData,
        }]
      });

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
    }
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
