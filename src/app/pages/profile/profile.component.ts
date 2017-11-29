import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import {Http} from '@angular/http';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { Chart } from 'angular-highcharts';
import { User } from '../../classes/user';

import { UserService } from '../../services/user.service';
import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  providers: [UserService, CompanyService, AuthService],
  host: {'(window:keydown)': 'hotkeys($event)'},
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  currentUser: User = new User();
  expColors: string[] = ['rgb(0,178,255)', 'rgb(69,199,255)', 'rgb(138,220,255)', 'rgb(198,241,255)' ];
  capaChartDatas: any[] = [];
  capaChartLabels: string[] = [];
  promiseFinished: boolean = false;
  availabilityData: any = {
    values: [],
    dates: []
  };
  agencyExperience: any[] = [];
  subagencyCountForChart = 0;
  isActiveProfile: boolean = false;
  currentJob: any = null;
  positionHistory: any[] = [];
  occupations: any[] = [];
  categories: any[] = [];
  months: any[] = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  degreeType: any[] = [
    {
      name: 'Associate',
      years: 2
    },
    {
      name: 'Bachelor\'s',
      years: 4
    },
    {
      name: 'Master\'s',
      years: 6
    },
    {
      name: 'Ph.D.',
      years: 8
    },
    {
      name: 'Other',
      years: 2
    },
  ];
  charts: any[] = [];
  agencyChart: any;
  skillChart: any;
  serviceChart: any;
  serviceChartNames = [];
  yearsOfSchool: number = 0;
  yearsOfWork: number = 0;
  professionalPoints: number = 0;
  activeTab: any = {
    main: 0,
    skill: 0,
    service: 0,
  };
  pastPerformances: any[] = [];
  allCategories: any[];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private auth: AuthService,
    private http: Http,
    private titleService: Title,

  ) {

    this.userService.getUserbyID(this.route.snapshot.params['id']).toPromise().then((result) => {
      this.currentUser = result;
      this.titleService.setTitle(this.currentUser.firstName + ' ' + this.currentUser.lastName + '\'s Profile - Federal Foundry Forge');
      if (this.auth.isLoggedIn()) {
        if (this.auth.getLoggedInUser() == this.route.snapshot.params['id']) {
          this.isActiveProfile = true;
          if (!this.currentUser.finished){
            this.router.navigateByUrl('/user-profile-edit/' + this.currentUser._id);
          }
        } else {
          this.isActiveProfile = false;
        }
      }
      this.http.get('../../../assets/occupations.json')
      .map((res: any) => res.json())
      .subscribe(
        (data: any) => {
          this.allCategories = data;
        },
        err => console.log(err), // error
        () => myCallback() // complete
      );
    });

    const myCallback = () => {
      let index: number = 0;
      this.availabilityData.values = [];
      this.availabilityData.dates = [];
      function stringToBool(val) {
        return (val + '').toLowerCase() === 'true';
      };

      if (this.currentUser.finished) {
      for (const job of this.currentUser.positionHistory) {
        if (job.EndDate) {
          if (job.EndDate === 'Current') {
            this.currentJob = job;
          } else {
            if (this.currentJob == null) {
              this.currentJob = job;
            } else if (this.currentJob.endDate != 'Current'){
              const jobYear = +job.EndDate.slice(0, 4);
              const currentYear = +this.currentJob.EndDate.slice(0, 4);
              if (jobYear > currentYear) {
                this.currentJob = job;
              } else if (jobYear === currentYear) {
                const jobMonth = +job.EndDate.slice(5, 2);
                const currentMonth = +this.currentJob.EndDate.slice(5, 2);
                if (jobMonth > currentMonth) {
                  this.currentJob = job;
                }
              }
            }
          }
          for (const exp of job.agencyExperience) {
            for (const data of exp.main.data) {
              let color = 4;
              color = Math.floor(color);
              this.expColors[exp.main.title] = this.expColors[index++];
            }
          }
        }
      }

      const temp: number[] = [];
      if (this.currentUser.abilities) {
        for (const index of this.currentUser.abilities) {
          this.capaChartLabels.push(index[0]);
          temp.push(+index[1]);
        }
      }

      const date = new Date(),
          locale = 'en-us',
          month = date.toLocaleString(locale, { month: 'long' }).slice(0, 3);
      let year = new Date().getFullYear();
      //if one of your jobs is tagged as "current", it assumes you're unavailable and vice versa
      let avail = true;
      if (this.currentUser.positionHistory){
        for (const pos of this.currentUser.positionHistory) {
          if (pos.EndDate) {
            if (pos.EndDate.toLowerCase() == 'current'){
              avail = false;
            }
          }
        }
      }

      const currentDate = month + ', ' + year.toString().slice(2, 4);
      while (this.currentUser.availability.length > 1 && this.currentUser.availability[0].date != currentDate) {
        this.currentUser.availability.splice(0, 1);
      }
      if (this.currentUser.availability[0]) {
        if (this.currentUser.availability[0].date !== currentDate) {
          this.currentUser.availability.splice(0, 1);
          this.currentUser.availability.push({
            date: currentDate,
            available: avail
          });
        }
      }
      while (this.currentUser.availability.length > 0 && this.currentUser.availability.length < 7){
        let nextNum = this.months.indexOf(this.currentUser.availability[this.currentUser.availability.length - 1].date.slice(0, 3)) + 1;
        if (nextNum >= this.months.length) {
          nextNum = 0;
          year = year + 1;
        }
        this.currentUser.availability.push({
          date: this.months[nextNum] + ', ' + year.toString().slice(2, 4),
          available: avail
        });
      }
      for (const index of this.currentUser.availability) {
        this.availabilityData.dates.push(index.date);
        this.availabilityData.values.push(index.available);
      }
      this.capaChartDatas.push({data: temp, label: 'Strength'});

      for (const job of this.currentUser.positionHistory) {
        job.Year = +job.StartDate.slice(0, 4);
        let endYear = 0;
        if (job.EndDate.slice(0, 4) == 'Curr') {
          endYear = new Date().getFullYear();
        } else {
          endYear = +job.EndDate.slice(0, 4);
        }
        for (const agency of job.agencyExperience) {
          const newAgency: any = agency;
          newAgency.years = (endYear - job.Year);
          newAgency.jobs = 1;
          newAgency.subagencies = [];
          if (newAgency.years == 0) {
            newAgency.years = 1;
          }

          for (const s of agency.offices) {
            const newSubagency: any = s;
            newSubagency.years = newAgency.years;
            newSubagency.jobs = 1;
            if (newSubagency.years == 0) {
              newSubagency.years = 1;
            }
            let nameMatch = false;
            for (const i of newAgency.subagencies) {
              if (newSubagency.title == i.title) {
                nameMatch = true;
                i.years += newSubagency.years;
                i.jobs++;
              }
            }
            if (nameMatch == false && newSubagency.title.length > 0) {
              if (newAgency.subagencies[0] == null) {
                newAgency.subagencies[0] = newSubagency;
                this.subagencyCountForChart++;
              } else {
                newAgency.subagencies.push(newSubagency);
                this.subagencyCountForChart++;
              }
            }
          }

          let nameMatch = false;
          for (const i of this.agencyExperience) {
            if (newAgency.main.title == i.main.title) {
              // console.log('merging ' + newAgency.main.title + ' & ' + i.main.title)
              nameMatch = true;
              i.years += newAgency.years;
              i.jobs++;
            }
          }

          if (nameMatch == false && job.agencyExperience[0].main.title.length > 0) {
            if (this.agencyExperience[0] == null) {
              // console.log('setting first one as ' + newAgency.main.title)
              this.agencyExperience[0] = newAgency;
            } else {
              // console.log('pushing in ' + newAgency.main.title)
              this.agencyExperience.push(newAgency);
            }
          }
        }
      }

      const toolsToPush = [];
      for (const tool of this.currentUser.foundTools) {
        let matchFound = false;
        for (const position of tool.position) {
          for (const toolDone of toolsToPush) {
            if (position == toolDone.title) {
              toolDone.score += 7;
              matchFound = true;
            }
          }
          if (!matchFound) {
            const newPosition = {
              title: position,
              score: 7
            };
            toolsToPush.push(newPosition);
          }
        }
      }
      if (toolsToPush.length < 2) {
        for (const o of this.currentUser.occupations) {
          const newOccupation = {
            title: o.title,
            score: o.score
          };
          this.occupations.push(newOccupation);
        }
      } else {
        for (const tool of toolsToPush) {
          for (const o of this.currentUser.occupations) {
            if (tool.title == o.title) {
              tool.score += (o.score / 5);
            }
          }
        }
        toolsToPush.sort(function(a, b){
          return parseFloat(b.score) - parseFloat(a.score);
        });
        for (let i = 0; i < 10; i++) {
          this.occupations.push(toolsToPush[i]);
        }
      }
      for (const t of toolsToPush) {
        let newName;
        let newCode;
        for (const i of this.allCategories) {
          if (t.title == i.title){
            newName = i.category;
            newCode = i.code.substring(0, 2);
          }
        }
        const newCategory = {
          code: newCode,
          name: newName,
          score: 5
        };
        let match = false;
        for (const c of this.categories) {
          if (newCategory.name == c.name) {
            match = true;
            c.score = Math.round(c.score + (t.score / 5));
          }
        }
        if (!match){
          this.categories.push(newCategory);
        }
      }
      const serviceData = [];
      let catPointsTotal = 0;
      for (const c of this.categories) {
        catPointsTotal += c.score;
      }
      for (const c of this.categories) {
        const percent = 360 * (c.score / catPointsTotal);
        serviceData.push({
          name: c.name,
          y: percent
        });
      }

      this.serviceChart = new Chart({
        chart: {
          type: 'pie',
          backgroundColor: 'rgba(0, 100, 200, 0.00)',
          renderTo: 'service_chart'
        },
        title: {
          text: 'Capabilities'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },

        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
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

      //right now when a user is created the json assigns the string value "true" or "false" to booleans instead of the actual true or false.
      //i can't figure out how to fix that in the backend so now it just gets cleaned up when it hits the frontend
      if (typeof this.currentUser.disabled === 'string') {
        this.currentUser.disabled = stringToBool(this.currentUser.disabled);
      }
      for (let i = 0; i < this.currentUser.positionHistory.length; i++) {
        for (let x = 0; x < this.currentUser.positionHistory[i].agencyExperience.length; x++) {
          if (typeof this.currentUser.positionHistory[i].agencyExperience[x].main.isPM === 'string') {
            this.currentUser.positionHistory[i].agencyExperience[x].main.isPM = stringToBool(this.currentUser.positionHistory[i].agencyExperience[x].main.isPM);
          }
          if (typeof this.currentUser.positionHistory[i].agencyExperience[x].main.isKO === 'string') {
            this.currentUser.positionHistory[i].agencyExperience[x].main.isKO = stringToBool(this.currentUser.positionHistory[i].agencyExperience[x].main.isKO);
          }
          for (let y = 0; y < this.currentUser.positionHistory[i].agencyExperience[x].offices.length; y++) {
            if (typeof this.currentUser.positionHistory[i].agencyExperience[x].offices[y].isPM === 'string') {
              this.currentUser.positionHistory[i].agencyExperience[x].offices[y].isPM = stringToBool(this.currentUser.positionHistory[i].agencyExperience[x].offices[y].isPM);
            }
            if (typeof this.currentUser.positionHistory[i].agencyExperience[x].offices[y].isKO === 'string') {
              this.currentUser.positionHistory[i].agencyExperience[x].offices[y].isKO = stringToBool(this.currentUser.positionHistory[i].agencyExperience[x].offices[y].isKO);
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
        };
      }
      if (this.currentUser.education[0].DegreeType[0] == null) {
        this.currentUser.education[0].DegreeType.push({Name: ''});
      }

      for (const j of this.currentUser.positionHistory) {
        if (j.EndDate !== 'Current') {
          const endYear = +j.EndDate.slice(0, 4);
          const startYear = +j.StartDate.slice(0, 4);
        } else {
          const endYear = new Date().getFullYear();
          const startYear = +j.StartDate.slice(0, 4);
        }
        this.yearsOfWork += (endYear - startYear);

        if (j.EndDate !== 'Current') {
          const endMonth = +(((+j.EndDate.slice(5, 7)) / 12).toFixed(2));
          const startMonth = +(((+j.StartDate.slice(5, 7)) / 12).toFixed(2));
        } else {
          let endMonth = new Date().getMonth();
          const endMonth = +((+endMonth / 12).toFixed(2));
          const startMonth = +(((+j.StartDate.slice(5, 7)) / 12).toFixed(2));
        }
        this.yearsOfWork += (endMonth - startMonth);
      }
      for (const d of this.currentUser.education) {
        for (const t of this.degreeType) {
          if (d.DegreeType[0]) {
            if (d.DegreeType[0].Name == t.name) {
              this.yearsOfSchool += t.years;
            }
          }
        }
      }
      this.professionalPoints = Math.round(Math.sqrt((this.yearsOfSchool * 2) + this.yearsOfWork + this.currentUser.certification.length) * 50);

      // here is some CHART CALCULATION!

        const data_prof = new Map();
        const data_peop = new Map();
        const data_prof_sub = new Map();
        const data_peop_sub = new Map();
        const agencyNames = [];
        const subagencyNames = [];
        const prof = [];
        const peop = [];
        for (let j = 0; j < this.agencyExperience.length; j++) {
          if (data_prof.has(this.agencyExperience[j].main.title)) {
            data_prof.set(this.agencyExperience[j].main.title, data_prof.get(this.agencyExperience[j].main.title) + (this.agencyExperience[j].years * this.agencyExperience[j].jobs));
            data_peop.set(this.agencyExperience[j].main.title, data_peop.get(this.agencyExperience[j].main.title) + this.agencyExperience[j].jobs);
          }
          if (!data_prof.has(this.agencyExperience[j].main.title)) {
            data_prof.set(this.agencyExperience[j].main.title, (this.agencyExperience[j].years * this.agencyExperience[j].jobs));
            data_peop.set(this.agencyExperience[j].main.title, this.agencyExperience[j].jobs);
            agencyNames.push(this.agencyExperience[j].main.title);
          }

          for (let x = 0; x < this.agencyExperience[j].subagencies.length; x++) {
            if (data_prof_sub.has(this.agencyExperience[j].subagencies[x].title)) {
              data_prof_sub.set(this.agencyExperience[j].subagencies[x].title, data_prof.get(this.agencyExperience[j].subagencies[x].title) + (this.agencyExperience[j].subagencies[x].years * this.agencyExperience[j].subagencies[x].jobs));
              data_peop_sub.set(this.agencyExperience[j].subagencies[x].title, data_peop.get(this.agencyExperience[j].subagencies[x].title) + this.agencyExperience[j].subagencies[x].jobs);
            }
            if (!data_prof_sub.has(this.agencyExperience[j].subagencies[x].title)) {
              data_prof_sub.set(this.agencyExperience[j].subagencies[x].title, (this.agencyExperience[j].subagencies[x].years * this.agencyExperience[j].subagencies[x].jobs));
              data_peop_sub.set(this.agencyExperience[j].subagencies[x].title, this.agencyExperience[j].subagencies[x].jobs);
              subagencyNames.push(this.agencyExperience[j].subagencies[x].title);
            }
          }
        }

        for (let k = 0; k < agencyNames.length; k++){
          data_prof.set( agencyNames[k], ( data_prof.get( agencyNames[k] ) / data_peop.get( agencyNames[k] ) ) );
          prof[k] = data_prof.get( agencyNames[k] );
          peop[k] = data_peop.get( agencyNames[k] );
        }
        this.agencyChart = new Chart({
          chart: {
            type: 'bar',
            backgroundColor: 'rgba(0, 100, 200, 0.00)',
            renderTo: 'team_chart'
          },
          title: {
            text: 'Agency Experience'
          },
          xAxis: [{
            categories: agencyNames,
            options : {
              endOnTick: false
            },
          }],
          yAxis: [{ // Primary yAxis
            min: 0,
            tickInterval: 1,
            endOnTick: false,
            alignTicks: false,
            labels: {
              format: '{value}',
              style: {
                color: '#434348'
              },
            },
            title: {
              text: 'Years Experience',
              style: {
                color: '#434348'
              }
            }
          },
          {
           // Secondary yAxis
            tickInterval: 1,
            min: 0,
            endOnTick: false,
            alignTicks: false,
            title: {
              text: '',
              style: {
                  color: '#7cb5ec'
            }
            },
            labels: {
              step: 1,
              format: '{value:.0f}',
              style: {
                color: '#7cb5ec'
              }
            },
            opposite: true
          }],
          tooltip: {
            shared: true
          },
          series: [{
            name: 'Times Worked With',
            type: 'column',
            yAxis: 1,
            data: peop,
            tooltip: {
              valueSuffix: ' times'
            }
          }, {
            name: 'Years',
            type: 'column',
            data: prof,
            tooltip: {
              valueSuffix: ' years'
            }
          }]
        });

        this.showTeam();
        this.calculateSkillChart();
        this.calculateCapaChart();
        this.pastPerformances = this.currentUser.pastPerformanceProxies.map(proxy => proxy.pastPerformance);
        this.promiseFinished = true;
      } else {
        this.promiseFinished = true;
      }
    };
  }

  ngOnInit() {
  }

  hotkeys(event){
    // console.log(event.keyCode);
    if (this.activeTab.main == 3) {
      if (event.keyCode == 37 && this.activeTab.skill == 1 && this.activeTab.service > 0){
        this.activeTab.service--;
      } else if (event.keyCode == 39 && this.activeTab.skill == 1 && this.serviceChartNames[this.activeTab.service + 1]){
        this.activeTab.service++;
      }
    }
  }

  switchTab(newTab) {
    // if (this.activeTab.main == newTab) {
    //   this.activeTab.main = 7
    // } else {
    // }
    this.activeTab.main = newTab;
  }

  showTeam() {
    const occupations = [];
    const toolsToPush = [];
    for (const tool of this.currentUser.foundTools) {
      let matchFound = false;
      for (const position of tool.position) {
        for (const toolDone of toolsToPush) {
          if (position == toolDone.title) {
            toolDone.score += 5;
            matchFound = true;
          }
        }
        if (!matchFound) {
          const newPosition = {
            title: '',
            score: 0
          };
          newPosition.title = position;
          newPosition.score = 5;
          toolsToPush.push(newPosition);
        }
      }
    }
    if (toolsToPush.length < 2) {
      for (const o of this.currentUser.occupations) {
        const newOccupation = {
          title: '',
          score: 0
        };
        newOccupation.title = o.title;
        newOccupation.score = o.score;
        occupations.push(newOccupation);

      }
    } else {
      for (const tool of toolsToPush) {
        for (const o of this.currentUser.occupations) {
          if (tool.title == o.title) {
            tool.score += (o.score / 5);
          }
        }
        occupations.push(tool);
      }
    }
    occupations.sort(function(a, b){
      return parseFloat(b.score) - parseFloat(a.score);
    });
    const sortedOccupations: any[] = [];
    for (const o of occupations){
      for (const c of this.allCategories) {
        if (o.title == c.title) {
          if (o.score > 10) {
            let match = false;
            for (const s of sortedOccupations) {
              if (s.title == c.category) {
                match = true;
                const occupationMatch = false;
                if (!s.occupations.includes(o)){
                  s.occupations.push(o);
                }
              }
            }
            if (!match) {
              sortedOccupations.push({
                title: c.category,
                occupations: [o]
              });
            }
          }
        }
      }
    }
    for (const s of sortedOccupations){
      this.serviceChartNames.push(s.title);
      // console.log(s.title + " - " + s.occupations.length)
      const data_prof = new Map();
      const data_peop = new Map();
      const skill = [];
      const prof = [];
      const peop = [];
      for (let j = 0; j < 10; j++) {
        // console.log(j + ' - ' + occupations[j].title)
        if (j < s.occupations.length && s.occupations[j].title){
          if (data_prof.has(s.occupations[j].title)) {
            // NOTE: the graphs that come out of this are kind of wonky. it may just be bad data from old user profiles.
            // we'll see if it clears up when all the profiles in the database have full data on them
            data_prof.set(s.occupations[j].title, data_prof.get(s.occupations[j].title) + s.occupations[j].score);
            data_peop.set(s.occupations[j].title, data_peop.get(s.occupations[j].title) + 1);
          }
          if (!data_prof.has(occupations[j].title)) {
            data_prof.set(s.occupations[j].title, s.occupations[j].score);
            data_peop.set(s.occupations[j].title, 1);
            skill.push(s.occupations[j].title);
          }
        }
      }
    for (let k = 0; k < 10; k++){
      if (k < s.occupations.length && skill[k]) {
        data_prof.set( skill[k], ( data_prof.get( skill[k] ) / data_peop.get( skill[k] ) ) );
        prof[k] = data_prof.get( skill[k] );
        peop[k] = data_peop.get( skill[k] );
      }
    }
    this.charts.push(this.generateChart(s.title, skill, peop, prof));
    }
  }

  generateChart(title, xCategories, series1, series2){
    const chart = new Chart({
      chart: {
        type: 'column',
        backgroundColor: 'rgba(0, 100, 200, 0.00)',
      },
      title: {
        text: title
      },
      xAxis: {
        categories: xCategories,
        options : {
          endOnTick: true
        },
      },
      yAxis: {
        max: 100,
        min: 0,
        tickInterval: 1,
        endOnTick: false,
        alignTicks: false,
        title: {
          text: 'Score'
        }
      },
      series: [{
        name: 'Score',
        data: series2,
        tooltip: {
          valueSuffix: ' points'
        }
      }]
    });
    return chart;
  }


  calculateSkillChart() {
      const data_prof = new Map();
      const data_peop = new Map();
      const skill = [];
      const prof = [];
      const peop = [];
      const tools = this.currentUser.foundTools;
      // var tools = this.currentUser.foundTools.sort(function(a,b){
      //   return b.score - a.score;
      // })

      for (let j = 0; j < tools.length; j++) {
        // console.log(j + ' - ' + occupations[j].title)
        if (tools[j].title){
          if (data_prof.has(tools[j].title)) {
            // NOTE: the graphs that come out of this are kind of wonky. it may just be bad data from old user profiles.
            // we'll see if it clears up when all the profiles in the database have full data on them
            data_prof.set(tools[j].title, data_prof.get(tools[j].title) + tools[j].score);
          }
          if (!data_prof.has(tools[j].title)) {
            data_prof.set(tools[j].title, tools[j].score);
            skill.push(tools[j].title);
          }
        }
      }
    for (let k = 0; k < tools.length; k++){
      if (skill[k]) {
        data_prof.set( skill[k], ( data_prof.get( skill[k] )) );
        prof[k] = data_prof.get( skill[k] );
      }
    }
    this.skillChart = new Chart({
      chart: {
        type: 'column',
        backgroundColor: 'rgba(0, 100, 200, 0.00)',
      },
      title: {
        text: 'Tools'
      },
      xAxis: {
        categories: skill,
        options : {
          endOnTick: true
        },
      },
      yAxis: {
        min: 0,
        tickInterval: 1,
        endOnTick: false,
        alignTicks: false,
        title: {
          text: 'Score'
        }
      },
      series: [{
        name: 'Score',
        data: prof,
        tooltip: {
          valueSuffix: ' points'
        }
      }]
    });
  }

  calculateCapaChart() {
    const temp: number[] = [];
    this.capaChartLabels = [];
    this.capaChartDatas = [];
    if (this.occupations) {
      for (const index of this.occupations) {
        this.capaChartLabels.push(index.title);
        temp.push(+index.score);
      }
    }
    this.capaChartDatas.push({data: temp, label: 'Score'});
  }

  getCapaChartValues(occupations): number[] {
    const temp: number[] = [];
    for (const index of occupations) {
      temp.push(index.score);
    }
    return temp;
  }

  getCapaChartColor(score: number): string {
    let temp: string;
    let color: number = score / 100 * 155;
    color = Math.floor(color);
    temp = 'rgb(' + color.toString() + ',' + color.toString() + ',' + color.toString() + ')';
    return temp;
  }

  expMainValues(tempUser: User, jobNum, agencyNum): number[] {
    const temp: number[] = [];
    for (const data of this.agencyExperience[agencyNum].main.data) {
      temp.push(data.score * 10);
    }
    return temp;
  }

  expSub1Values(tempUser: User, jobNum, agencyNum, officeNum): number[] {
    const temp: number[] = [];
    for (const data of this.currentUser.positionHistory[jobNum].agencyExperience[agencyNum].offices[officeNum].data) {
      temp.push(data.score);
    }
    return temp;
  }

  expSub2Values(tempUser: User): number[] {
    const temp: number[] = [];
    for (const job of this.currentUser.positionHistory) {
      for (const exp of job.agencyExperience) {
        for (const office of exp.offices) {
          for (const data of office.data) {
            temp.push(data.score);
          }
        }
      }
    }
    return temp;
  }

  getServiceChartData(): number[] {
    const temp: number[] = [];
    for (const i of this.categories) {
      temp.push(i.score);
    }
    return temp;
  }

  getServiceChartLabel(): string[] {
    const temp: string[] = [];
    for (const i of this.categories) {
      temp.push(i.name);
    }
    return temp;
  }

  currentYear() {
    const year = new Date().getFullYear();
    return year;
  }

  back() {
    this.location.back();
  }

  editProfile() {
    this.router.navigate(['user-profile-edit', this.currentUser['_id']]);
  }

}
