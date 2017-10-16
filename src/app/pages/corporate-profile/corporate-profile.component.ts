import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from '../../classes/user';
import { Product } from '../../classes/product';
import { PastPerformance } from '../../classes/past-performance';
import { Company } from '../../classes/company';
import { Service } from '../../classes/service';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Chart } from 'angular-highcharts';


import { UserService } from '../../services/user.service';
import { CompanyService } from '../../services/company.service';
import { ProductService } from '../../services/product.service';
import { ServiceService } from '../../services/service.service';
import { PastperformanceService } from '../../services/pastperformance.service';
import  { AuthService } from "../../services/auth.service";
import  { RoleService} from "../../services/role.service";

declare var $: any;
declare var Swiper: any;
// var renderChart: boolean;
// renderChart = false;
@Component({
  selector: 'app-corporate-profile',
  providers: [UserService, ProductService, ServiceService, PastperformanceService, CompanyService, AuthService, RoleService],
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
  CQAC = {
    certs: [],
    awards: [],
    clearances: []
  };
  currentTab = 1;
  promiseFinished: boolean = false;
  team: User[]  = [];
  renderChart: boolean;
  chart: any;
  activeTab: number = 0;
  productTab: number = 0;
  productCustomerTab: number = 0;
  serviceTab: number = 0;
  ppTab: number = 0;
  isUserAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private userService: UserService,
    private companyService: CompanyService,
    private productService: ProductService,
    private serviceService: ServiceService,
    private ppService: PastperformanceService,
    private auth: AuthService,
    private  roleService: RoleService
  ) {
    // console.log("testing1");
    // console.log(this);
    this.renderChart = false;
    // this.currentAccount = this.companyService.getTestCompany()
    // Need to use companyservice.getCompanyByID
    this.companyService.getCompanyByID(this.route.snapshot.params['id']).toPromise().then(company => { this.currentAccount = company; myCallback(); });
    // this.companyService.getCompanyByID(this.route.params["id"] ).toPromise().then(company => this.currentAccount = company)
    const myCallback = () => {
      if (auth.isLoggedIn()) {
        this.getAdminStatus()
      } else {
      }
      const myCallback2 = () => {
        console.log("In myCallback2")
        for (const i of this.users) {
          for (const j of i.certification) {
            this.CQAC.certs.push({
              CertificationName: j.CertificationName,
              DateEarned: j.DateEarned
            });
          }
          for (const j of i.award) {
            this.CQAC.awards.push(j);
          }
          for (const j of i.clearance) {
            this.CQAC.clearances.push({
              clearanceType: j.clearanceType,
              awarded: j.awarded,
              expiration: j.expiration
            });
          }
        }
        this.changeToTeam();
        this.promiseFinished = true;
      };

      if (this.currentAccount.userProfileProxies) {
        //loop through user proxies
        for (let proxy of this.currentAccount.userProfileProxies){
          //if leader: push into users
          if (proxy.leader){
            this.users.push(proxy.userProfile)
          }
        }
        //After loop is finished myCallback2()
        myCallback2()
      }

      if (this.currentAccount.product) {
        for (const i of this.currentAccount.product) {
          this.productService.getProductbyID(i.toString()).toPromise().then(res => {
            this.products.push(res)
          });
        }
      }

      if (this.currentAccount.service) {
        for (const i of this.currentAccount.service) {
          this.serviceService.getServicebyID(i.toString()).toPromise().then(res => {
            this.services.push(res)
          });
        }
      }

      if (this.currentAccount.pastPerformanceProxies) {
        for (const i of this.currentAccount.pastPerformanceProxies.map(proxy => proxy.pastPerformance)) {
          // this.pastperformances.push(ppService.getPastPerformancebyID(i.pastperformanceid))
          this.pastperformances.push(i);
          //this.ppService.getPastPerformancebyID(i.toString()).toPromise().then(res => {this.pastperformances.push(res)}); // Might try to continue the for loop before the promise resolves.
          // let myCallback = () => {console.log(this.pastperformances);}
        }
      }

//TIM

//
  };
  }

  ngOnInit() {
  }

  switchTab(newTab) {
    if (this.activeTab == newTab) {
      this.activeTab = 7
    } else {
      this.activeTab = newTab
    }
    console.log(newTab)
  }

  getAdminStatus() {
    var userId = this.auth.getLoggedInUser()
    this.userService.getUserbyID(userId).toPromise().then((user) =>{
      var currentUserProxy = user.companyUserProxies.filter((proxy) => {
        return proxy.company
      }).filter((proxy) => {
        return proxy.company._id == this.route.snapshot.params['id']
      })[0]
      if (user.power >= 4){
        this.isUserAdmin = true;
        console.log("I'm SUPER admin")
      }
      if(currentUserProxy){
        this.roleService.getRoleByID(currentUserProxy.role).toPromise().then((role) => {
          if (role.title && role.title == "admin") {
            this.isUserAdmin = true;
            console.log("I'm admin")
          }
        })
      }
    })
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
  }


changeToTeam(){

  this.currentTab = 1;
  this.showTeam();
}






  showTeam() {
    var data_prof = new Map();
    var data_peop = new Map();
    var skill = [];
    var prof = [];
    var peop = [];
    var numPeop = 0;

    for(const i of this.currentAccount.userProfileProxies){
      numPeop++;
      var member = i.userProfile;
      if (member) {
        var occupations = []
        var toolsToPush = []
        for (let tool of member.foundTools) {
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
          for (let o of member.occupations) {
            var newOccupation = {
              title: '',
              score: 0
            }
            newOccupation.title = o.title
            newOccupation.score = o.score
            occupations.push(newOccupation)

          }
        } else {
          for (let tool of toolsToPush) {
            for (let o of member.occupations) {
              if (tool.title == o.title) {
                tool.score += (o.score / 5)
              }
            }
            occupations.push(tool)
            // if (tool.score > 50) {
            // }
          }
        }
        occupations.sort(function(a,b){
          return parseFloat(b.score) - parseFloat(a.score);
        })

        for (var j = 0; j < 10; j++) {
          if (data_prof.has(occupations[j].title)) {
            // NOTE: the graphs that come out of this are kind of wonky. it may just be bad data from old user profiles.
            // we'll see if it clears up when all the profiles in the database have full data on them
            data_prof.set(occupations[j].title, data_prof.get(occupations[j].title) + occupations[j].score);
            data_peop.set(occupations[j].title, data_peop.get(occupations[j].title) + 1);
          }
          if (!data_prof.has(occupations[j].title)) {
            data_prof.set(occupations[j].title, occupations[j].score);
            data_peop.set(occupations[j].title, 1);
            skill.push(occupations[j].title);
          }
        }
      }
    }
    for(var k = 0; k < 10; k++){
      data_prof.set( skill[k], ( data_prof.get( skill[k] )/data_peop.get( skill[k] ) ) );
      prof[k] = data_prof.get( skill[k] );
      peop[k] = data_peop.get( skill[k] );
    }

    this.chart = new Chart({
      chart: {
          type: 'bar',
          backgroundColor: 'rgba(0, 100, 200, 0.00)',
          renderTo: "team_chart",
      },
      title: {
          text: 'Skills'
      },
      xAxis: [{
          categories: skill,
          options : {
              endOnTick: false
          },
      }],
      yAxis: [{ // Primary yAxis
//            tickInterval: Math.round(100/numPeop),
//            tickAmount: numPeop,
//            max: 100,
          // endOnTick:false ,
          max:100,
          min:0,
          endOnTick: false,
          alignTicks: false,

          ceiling: 100,
          labels: {
              format: '{value}%',
              style: {
                  color: '#434348'
              },
          },
          title: {
              text: 'Proficiency',
              style: {
                  color: '#434348'
              }
          },
      }, { // Secondary yAxis
          max: numPeop,
          tickInterval: 1,
//            tickAmount: numPeop,
//              endOnTick:false ,
          min:0,
          endOnTick: false,
          alignTicks: false,

          title: {
              text: 'Number of Employees',
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
    });
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
    window.scrollTo(0, 0);
    this.router.navigate(['user-profile', id]);
  }

  toPastPerformance(id: string) {
    window.scrollTo(0, 0);
    this.router.navigate(['past-performance', id]);
  }

  toPastPerformanceCreate(query: string) {
    window.scrollTo(0, 0);
    this.router.navigate(['past-performance-create'], { queryParams: { company: query } });
  }

  editCompany() {
    window.scrollTo(0, 0);
    this.router.navigate(['corporate-profile-edit', this.currentAccount['_id']]);
  }

}
