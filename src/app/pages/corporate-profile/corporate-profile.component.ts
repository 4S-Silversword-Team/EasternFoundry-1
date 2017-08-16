import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from '../../classes/user';
import { Product } from '../../classes/product';
import { PastPerformance } from '../../classes/past-performance';
import { Company } from '../../classes/company';
import { Service } from '../../classes/service';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Highcharts } from 'angular-highcharts';


import { UserService } from '../../services/user.service';
import { CompanyService } from '../../services/company.service';
import { ProductService } from '../../services/product.service';
import { ServiceService } from '../../services/service.service';
import { PastperformanceService } from '../../services/pastperformance.service';
import { AuthService } from '../../services/auth.service'

declare var $: any;
declare var Swiper: any;
// var renderChart: boolean;
// renderChart = false;
@Component({
  selector: 'app-corporate-profile',
  providers: [UserService, ProductService, ServiceService, PastperformanceService, CompanyService],
  templateUrl: './corporate-profile.component.html',
  styleUrls: ['./corporate-profile.component.css']
})
export class CorporateProfileComponent implements OnInit, AfterViewInit {
  currentAccount: Company = new Company();
  users: User[] = [];
  products: Product[] = [];
  services: Service[] = [];
  pastperformances: PastPerformance[] = [];
  currentPP = 0;
  CQAC: string[] = [];
  currentTab = 1;
  promiseFinished: boolean = false;
  team: User[]  = [];
  renderChart: boolean;
  chart: Highcharts;
  loggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private userService: UserService,
    private companyService: CompanyService,
    private productService: ProductService,
    private serviceService: ServiceService,
    private auth: AuthService,
    private ppService: PastperformanceService,
  ) {

    auth.isLoggedIn().then(
      res => {
        !res ? this.loggedIn = false: this.loggedIn = true
      }
    )

    this.renderChart = false;
    // this.currentAccount = this.companyService.getTestCompany()
    // Need to use companyservice.getCompanyByID
    this.companyService.getCompanyByID(this.route.snapshot.params['id']).toPromise().then(company => { this.currentAccount = company; myCallback(); });
    // this.companyService.getCompanyByID(this.route.params["id"] ).toPromise().then(company => this.currentAccount = company)
    const myCallback = () => {
      for (const i of this.currentAccount.leadership) {
        this.userService.getUserbyID(i.userId).toPromise().then(user => { this.users.push(user); myCallback2();});
      }

    for (const i of this.currentAccount.product) {
      this.productService.getProductbyID(i.toString()).toPromise().then(res => {this.products.push(res)});
    }


    for (const i of this.currentAccount.service) {
      this.serviceService.getServicebyID(i.toString()).toPromise().then(res => {this.services.push(res)});
    }

    for (const i of this.currentAccount.pastPerformance) {
      // this.pastperformances.push(ppService.getPastPerformancebyID(i.pastperformanceid))
      this.ppService.getPastPerformancebyID(i.toString()).toPromise().then(res => {this.pastperformances.push(res)}); // Might try to continue the for loop before the promise resolves.
      // let myCallback = () => {console.log(this.pastperformances);}
    }

//TIM
    for (const i of this.currentAccount.userProfileProxies){
    //  console.log(this);
      // console.log("proxyID == " + i._id);
      // console.log("userID  == "+ i.userProfile.firstname);
      this.userService.getUserbyID(i.userProfile._id).toPromise().then(member => { this.team.push(member);});
      //console.log(this.team);
    }


//
    const myCallback2 = () => {

      for (const i of this.users) {
        for (const j of i.certification) {
          this.CQAC.push('Degree: ' + j.CertificationName + ', DateEarned: ' + j.DateEarned);
        }
        for (const j of i.award) {
          this.CQAC.push('Awarded: ' + j);
        }
        for (const j of i.clearance) {
          this.CQAC.push('Type: ' + j.clearanceType + ', Awarded: ' + j.awarded + ', Expiration: ' + j.expiration);
        }
      }
    };
    this.promiseFinished = true;
  };
//  this.showTeam();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if ($('.swiper-container').width() > 450) {
      const swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 3,
        paginationClickable: true,
        spaceBetween: 30,
        freeMode: true
      });
    } else if ($('.swiper-container').width() > 400) {
      const swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 2,
        paginationClickable: true,
        spaceBetween: 30,
        freeMode: true
      });
    } else {
      const swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 30,
        freeMode: true
      });
    }
    this.showTeam();
  }

  showTeam(){
    console.log("moved to team tab. implement the chat generation");
    this.currentTab = 1;
    this.renderChart = true;
    var data_prof = new Map();
    var data_peop = new Map();
    var skill = [];
    var prof = [];
    var peop = [];

    for(const i of this.team){
      for(var j = 0; j < i.strength.length; j++){
        if( data_prof.has(i.strength[j].skill) ){
          data_prof.set(i.strength[j].skill, data_prof.get(i.strength[j].skill)+i.strength[j].score);
          data_peop.set(i.strength[j].skill, data_peop.get(i.strength[j].skill) + 1)
        }
        if( !data_prof.has(i.strength[j].skill) ){
          data_prof.set(i.strength[j].skill, i.strength[j].score);
          data_peop.set(i.strength[j].skill, 1);
          skill.push(i.strength[j].skill);
        }
      }
    }
    for(var i = 0; i < skill.length; i++){
      data_prof.set( skill[i], ( data_prof.get( skill[i] )/data_peop.get( skill[i] ) ) );
      prof[i] = data_prof.get( skill[i] );
      peop[i] = data_peop.get( skill[i] );
    }




  //  var team_iter = data_prof.entries();
  //  console.log(team_iter.return);
    //for(var [x , y] of team_iter){
      // skill.push(i)
//this is why c is a good language. i could just make my own data structure
  console.log(skill[0]);
  console.log(prof);

    //}
    //console.log(data_prof);
    var options = {

          chart: {
              type: 'bar',
              backgroundColor: '#FDF5EB',
              renderTo: "team_chart"
          },
          title: {
              text: 'Skills'
          },
          xAxis: [{

              categories: skill,
              crosshair: true
          }],
          yAxis: [{ // Primary yAxis
              labels: {
                  format: '{value}%',
                  style: {
                      color: Highcharts.getOptions().colors[1]
                  }
              },
              title: {
                  text: 'Proficiency',
                  style: {
                      color: Highcharts.getOptions().colors[1]
                  }
              }
          }, { // Secondary yAxis
              title: {
                  text: 'Number of Employees',
                  style: {
                      color: Highcharts.getOptions().colors[0]
                  }
              },
              labels: {
                  step: 1,
                  format: '{value:.0f}',
                  style: {
                      color: Highcharts.getOptions().colors[0]
                  }
              },
              opposite: true
          }],
          tooltip: {
              shared: true
          },
          // legend: {
          //     layout: 'vertical',
          //     align: 'left',
          //     x: 375,
          //     verticalAlign: 'top',
          //     y: 0,
          //     floating: true,
          //     backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FDF5EB'
          // },
          series: [{
              name: 'People',
              type: 'column',
              yAxis: 1,
              data: peop,
              tooltip: {
                  valueSuffix: ' '
              }

          }, {
              name: 'Proficiency',
              type: 'column',
              data: prof,
              tooltip: {
                  valueSuffix: '%'
              }
          }]
    };
    this.chart = new Highcharts.chart(options);
  //  console.log(this.chart);
  }




  showService() {
    this.currentTab = 3;
    this.renderChart = false;
  }

  showProduct() {
    this.currentTab = 2;
    this.renderChart = false;
  }



  getServiceChartValue(id: string): number[] {
    const temp: number[] = [];
    for (const i of this.services) {
      if (i._id === id) {
        for (const j of i.feature) {
          temp.push(j.score);
        }
      }
    }
    return temp;
  }

  getServiceChartColor(score: number): string {
    let temp: string;
    let color: number = score / 100 * 155;
    color = Math.floor(color);
    temp = 'rgb(' + color.toString() + ',' + color.toString() + ',' + color.toString() + ')';
    return temp;
  }

  getProductChartData(id: string): number[] {
    const temp: number[] = [];
    for (const i of this.products) {
      if (i._id === id) {
        for (const j of i.feature) {
          temp.push(j.score);
        }
      }
    }
    return temp;
  }

  getProductChartLabel(id: string): string[] {
    const temp: string[] = [];
    for (const i of this.products) {
      if (i._id === id) {
        for (const j of i.feature) {
          temp.push(j.name);
        }
      }
    }
    return temp;
  }

  toUserProfile(id: string) {
    this.router.navigate(['user-profile', id]);
  }

  toPastPerformance(id: string) {
    this.router.navigate(['past-performance', id]);
  }

  editCompany() {
    this.router.navigate(['corporate-profile-edit', this.currentAccount['_id']]);
  }

}
