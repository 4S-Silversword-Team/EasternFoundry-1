import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PastperformanceService } from '../../services/pastperformance.service';
import { Location } from '@angular/common'

import { PastPerformance } from '../../classes/past-performance'
import { UserService } from '../../services/user.service'
import { CompanyUserProxyService } from '../../services/companyuserproxy.service'
import { CompanyService } from '../../services/company.service'



@Component({
  selector: 'app-past-performance-edit',
  providers: [PastperformanceService, UserService, CompanyUserProxyService, CompanyService],
  templateUrl: './past-performance-edit.component.html',
  styleUrls: ['./past-performance-edit.component.css']
})
export class PastPerformanceEditComponent implements OnInit {

  currentPastPerformance: PastPerformance = new PastPerformance()

  agencyType: string[] = ['Pro', 'Amature'];
  officeType: string[] = ['Pro', 'Amature'];
  clearedType: string[] = ['true', 'false'];
  userProfiles: any[] = [];
  allCompanyEmployees: any[] = [];

  ppImage: string;
  ppInputWidth: number = 300;
  employeeWidth: number = 600;
  writeWidth: number = 800;
  rate: number = 0

  constructor(
    private pastPerformanceService: PastperformanceService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private userService: UserService,
    private companyUserProxyService: CompanyUserProxyService,
    private companyService: CompanyService
  ) {
    if ( this.router.url !== 'past-performance-create' ) {
      this.pastPerformanceService.getPastPerformancebyID(this.route.snapshot.params['id']).toPromise().then(res => {this.currentPastPerformance = res; myCallback(); myCallback2() });
      let myCallback = () => {
        for (const i of this.currentPastPerformance.userProfileProxies){
          this.userProfiles.push({
            "name": i.user.firstName + " " + i.user.lastName,
            "userId": i.user._id,
            "proxyId": i._id,
            "startDate": i.startDate,
            "endDate": i.endDate,
            "stillAffiliated": i.stillAffiliated,
            "role": i.role
          })
        }
      }

      let myCallback2 = () => {
      var allCompanyEmployees = [];

      for (const companyProxy of this.currentPastPerformance.companyProxies) {
        var myCompany;

        this.companyService.getCompanyByID(companyProxy.company._id).toPromise().then((res) => {myCompany = res; (() => {
          for (const userProfileProxy of myCompany.userProfileProxies) {
            allCompanyEmployees.push(userProfileProxy.userProfile)
          }
          this.allCompanyEmployees = allCompanyEmployees.filter((employee) => {
            return !this.currentPastPerformance.userProfileProxies.map((userProxy) => userProxy.user._id).includes(employee._id)
          })
        })()});

      }
    }


    }
  }

  ngOnInit() {
  }

  uploadImage() {

  }
  updatePP(model) {
    // Mongo cannot update a model if _id field is present in the data provided for the update, so we delete it
    delete model['_id'];
    this.pastPerformanceService.updatePP(this.route.snapshot.params['id'], model).toPromise().then(result => console.log(result));
    window.scrollTo(0, 0);
    this.router.navigate(['past-performance', this.route.snapshot.params['id']]);
  }
  addEmployee(modelEmployees: Array<Object>){
    modelEmployees.push({title: "", stillwith: false})
  }
  deleteArrayIndex(modelArray: Array<Object>, i: number){
    modelArray.splice(i, 1);
  }
  back() {
    this.location.back()
  }

}
