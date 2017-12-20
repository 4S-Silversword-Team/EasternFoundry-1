import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import {Http} from '@angular/http';
import { Chart } from 'angular-highcharts';
import { Title } from '@angular/platform-browser';

import { PastPerformance } from '../../classes/past-performance';

import { PastperformanceService } from '../../services/pastperformance.service';
import { AuthService} from '../../services/auth.service';
import { UserService} from '../../services/user.service';
import { RoleService} from '../../services/role.service';
import { CompanyService } from '../../services/company.service';
import { CompanyUserProxyService } from '../../services/companyuserproxy.service';

declare var $: any;

@Component({
  selector: 'app-past-performance',
  templateUrl: './past-performance.component.html',
  providers: [PastperformanceService, AuthService, UserService, RoleService, CompanyService, CompanyUserProxyService],
  styleUrls: ['./past-performance.component.css']
})
export class PastPerformanceComponent implements OnInit {

  currentPastPerformance: PastPerformance = new PastPerformance();
  isUserAdmin: boolean = false;
  userIsMember: boolean = false
  public performanceTitle: string = '';
  public agencyType: string[] = ['Pro', 'Amature'];
  public officeType: string[] = ['Pro', 'Amature'];
  public clearedType: string[] = ['Pro', 'Amature'];
  public ppImage: string;
  public ppInputWidth: number = 300;
  public employeeWidth: number = 600;
  public writeWidth: number = 800;
  public clientName: string = 'Air Force: 1st Fighter Wing';
  startDate: string;
  endDate: string;
  activeTab: any = {
    main: 0,
    employees: 0,
  };
  promiseFinished: boolean = false;
  privateCount = {
    affiliated: 0,
    notAffiliated: 0
  }
  affiliatedCount: number = 0;
  percentAffiliated: number = 0;
  occupations: any[] = [];
  categories: any[] = [];
  allCategories: any[];
  serviceChart: any;
  serviceChartNames = [];


  constructor(
    private pastPerformanceService: PastperformanceService,
    private companyService: CompanyService,
    private companyUserProxyService: CompanyUserProxyService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private auth: AuthService,
    private userService: UserService,
    private roleService: RoleService,
    private http: Http,
    private titleService: Title,

  ) {
    this.currentPastPerformance.id = this.route.snapshot.params['id'];
    // this.currentPastPerformance = this.pastPerformanceService.getPastPerformancebyID(this.currentPastPerformance.id)
    this.pastPerformanceService.getPastPerformancebyID(this.currentPastPerformance.id).toPromise().then(res => {
      this.currentPastPerformance = res ;
      this.titleService.setTitle(this.currentPastPerformance.title + ' - Federal Foundry Forge');

      this.startDate = new Date(this.currentPastPerformance.startDate).toDateString();
      this.endDate = new Date(this.currentPastPerformance.endDate).toDateString();

      if (auth.isLoggedIn()) {
        this.getAdminStatus();
      }

      const companyPromises = [];
      for (const u of this.currentPastPerformance.userProfileProxies) {
        u.stillAffiliated = false
        for (const c of u.user.companyUserProxies) {
          companyPromises.push(this.companyUserProxyService.getCompanyUserProxiesByID(c).toPromise().then(res => {
            const proxy: any = res;
            if (proxy) {
              if (proxy.company._id === this.currentPastPerformance.companyProxies[0].company._id) {
                // console.log(u.user.firstName + ' went from ' + u.stillAffiliated + ' to ' + proxy.stillAffiliated)
                u.stillAffiliated = true;
              }
            }
          }));
        }
        if (u.user._id == this.auth.getLoggedInUser()) {
          this.userIsMember = true
          console.log(this.userIsMember)
        }
      }
      Promise.all(companyPromises).then(res => {
        this.http.get('../../../assets/occupations.json')
        .map((res: any) => res.json())
        .subscribe(
          (data: any) => {
            this.allCategories = data;
          },
          err => console.log(err), // error
          () => myCallback() // complete
        );
        for (const i of this.currentPastPerformance.userProfileProxies){
          if (i.stillAffiliated){
            this.affiliatedCount++;
            if (!i.user.public) {
              this.privateCount.affiliated++;
            }
          } else {
            if (!i.user.public) {
              this.privateCount.notAffiliated++;
            }
          }
        }
        this.percentAffiliated = (this.affiliatedCount / this.currentPastPerformance.userProfileProxies.length) * 100;
        this.promiseFinished = true;
      });
      const myCallback = () => {
        const toolsToPush = [];
        for (const u of this.currentPastPerformance.userProfileProxies){
          for (const tool of u.user.foundTools) {
            for (const position of tool.position) {
              for (const toolDone of toolsToPush) {
                if (position === toolDone.title) {
                  toolDone.score += 7;
                }
              }
              const newPosition = {
                title: position,
                score: 7
              };
              // console.log(u.user.firstName + ' - ' + newPosition.title)
              toolsToPush.push(newPosition);
            }
          }
        }
        for (const tool of toolsToPush) {
          for (const u of this.currentPastPerformance.userProfileProxies){
            for (const o of u.user.occupations) {
              if (tool.title === o.title) {
                tool.score += (o.score / 5);
              }
            }
          }
        }
        toolsToPush.sort(function(a, b){
          return parseFloat(b.score) - parseFloat(a.score);
        });
        for (let i = 0; i < toolsToPush.length; i++) {
          this.occupations.push(toolsToPush[i]);
          // console.log(toolsToPush[i].score)
        }
      for (const t of toolsToPush) {
        // console.log(code.substring(0,2) + " - " + t.title)
        let newName;
        let newCode;
        for (const i of this.allCategories) {
          if (t.title === i.title) {
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
            if (newCategory.name === c.name) {
              match = true;
              c.score = Math.round(c.score + (t.score / 5));
            }
          }
          if (!match){
            this.categories.push(newCategory);
          }
        }
        // for (let o of this.occupations) {
        //   console.log(o.title + ' ' + o.score)
        // }
        const serviceData = [];
        let catPointsTotal = 0;
        for (const c of this.categories) {
          catPointsTotal += c.score;
        }
        const other = {
          name: 'Other',
          y: 0,
        };
        this.categories.sort(function(a,b){
          return parseFloat(b.score) - parseFloat(a.score);
        })
        this.categories = this.categories.slice(0,5)
        for (const c of this.categories) {
          const percent = 360 * (c.score / catPointsTotal);
          if (((c.score / catPointsTotal) * 100) >= 1){
            serviceData.push({
              name: c.name,
              y: percent
            });
          } else {
            other.y = other.y + percent;
          }
        }
        if (other.y > 0) {
          serviceData.push(other)
        }

        this.serviceChart = new Chart({
          chart: {
              type: 'pie',
              backgroundColor: 'rgba(0, 100, 200, 0.00)',
              renderTo: 'service_chart'
          },
          title: {
              text: 'Ability Profile'
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
      };

      // console.log(this.currentPastPerformance.userProfileProxies[0].user.companyUserProxies)
      // for (let i of this.currentPastPerformance.userProfileProxies){
      //
      // }
    });

  }

  back() {
    this.location.back();
  }

  editPastPerformance() {
    this.router.navigate(['past-performance-edit', this.currentPastPerformance['_id']]);
  }

  switchTab(newTab) {
    this.activeTab.main = newTab;
  }

  getAdminStatus() {
    const userId = this.auth.getLoggedInUser();
    // get user
    this.userService.getUserbyID(userId).toPromise().then((user) => {
      // get the company ids where the user is admin
      let superUser = false;
      if (user.power) {
        if (user.power > 3) {
          this.isUserAdmin = true;
          superUser = true;
        }
      }
      if (!superUser) {
        const relevantCompanyIds = user.companyUserProxies.filter(async (proxy) => {
          let returnVal;
          proxy.role.title === 'admin' ? returnVal = true : returnVal = false;
          // await this.roleService.getRoleByID(proxy.role).toPromise().then(async (roleObj) => {
          //   await proxy.role.title == "admin"? returnVal = true: returnVal = false;
          // })
          return returnVal;
        }).map((proxy) => proxy.company['_id']);
        console.log('Relevant companies', relevantCompanyIds);
        // then get the company ids associated with the past performance
        const ppCompanyIds = this.currentPastPerformance.companyProxies.map((cproxy) => cproxy.company['_id']);
        console.log('pp companies', ppCompanyIds);
        // finally check if the two sets have anything in common.
        for (const companyId of ppCompanyIds){
          if (relevantCompanyIds.indexOf(companyId) >= 0){
            this.isUserAdmin = true;
            console.log('I\'m a pp admin');
          }
        }
      }
    });
  }

  ngOnInit() {
  }

}
