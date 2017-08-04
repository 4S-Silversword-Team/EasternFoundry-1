import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PastperformanceService } from '../../services/pastperformance.service';
import { Location } from '@angular/common'

import { PastPerformance } from '../../classes/past-performance'
import { UserService } from '../../services/user.service'
import { CompanyService } from '../../services/company.service'
import { UserPastPerformanceProxyService } from '../../services/userpastperformanceproxy.service'



@Component({
  selector: 'app-past-performance-edit',
  providers: [PastperformanceService, UserService, CompanyService, UserPastPerformanceProxyService],
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
  newUserSelected: string;

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
    private companyService: CompanyService,
    private userPastPerformanceProxyService: UserPastPerformanceProxyService
  ) {
    if ( this.router.url !== 'past-performance-create' ) {
      this.pastPerformanceService.getPastPerformancebyID(this.route.snapshot.params['id']).toPromise().then(res => {this.currentPastPerformance = res; this.myCallback(); this.myCallback2() });
    }
  }

  ngOnInit() {
  }

  myCallback() {
    this.userProfiles = [];
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

  myCallback2() {
    this.allCompanyEmployees = [];
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

  uploadImage() {

  }
  updatePP(model) {
    // Mongo cannot update a model if _id field is present in the data provided for the update, so we delete it
    delete model['_id'];
    this.pastPerformanceService.updatePP(this.route.snapshot.params['id'], model).toPromise().then(result => console.log(result));
    window.scrollTo(0, 0);
    this.router.navigate(['past-performance', this.route.snapshot.params['id']]);
  }
  addEmployee(employeeId) {
    let request = {
        "user": employeeId,
        "pastPerformance": this.route.snapshot.params['id'],
        "startDate": "01/01/2001",
        "endDate": "01/02/2001",
        "stillAffiliated": false,
        "role": "programmer"
    }
    console.log(request)
    this.userPastPerformanceProxyService.addUserPPProxy(request).then(() => {
      this.pastPerformanceService.getPastPerformancebyID(this.route.snapshot.params['id']).toPromise().then(res => {this.currentPastPerformance = res; this.myCallback(); this.myCallback2() });
    })
  }

  // addEmployee(modelEmployees: Array<Object>){
  //   modelEmployees.push({title: "", stillwith: false})
  // }
  deleteArrayIndex(modelArray: Array<Object>, i: number){
    modelArray.splice(i, 1);
  }
  back() {
    this.location.back()
  }

}
