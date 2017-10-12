import {Http} from '@angular/http';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../../classes/user';

import { UserService } from '../../services/user.service';
import { ToolService } from '../../services/tool.service';
import { CertService } from '../../services/cert.service';
import { AgencyService } from '../../services/agency.service';
import { AuthService } from '../../services/auth.service'
import { CompanyService } from '../../services/company.service';
import { ProductService } from '../../services/product.service';
import { ServiceService } from '../../services/service.service';
import { PastperformanceService } from '../../services/pastperformance.service';
import { CompanyUserProxyService } from '../../services/companyuserproxy.service'
import { CompanyPastperformanceProxyService } from '../../services/companypastperformanceproxy.service'



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [ ProductService, ServiceService, PastperformanceService, CompanyService, UserService, AgencyService, CompanyUserProxyService, CompanyPastperformanceProxyService, CertService, ToolService]
})
export class AdminComponent implements OnInit {

  users: User[] = [];
  toSort: any[] = [];
  sortedObjects: any[] = [];
  sortCounter: number = 0;
  uploadCounter: number = 0;
  isUserAdmin: boolean = false;
  govtNames: any[] = [];
  allUsers: any[] = [];
  allCompanies: any[] = [];
  allCompanyUserProxies: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private toolService: ToolService,
    private agencyService: AgencyService,
    private certService: CertService,
    private companyService: CompanyService,
    private productService: ProductService,
    private serviceService: ServiceService,
    private ppService: PastperformanceService,
    private companyUserProxyService: CompanyUserProxyService,
    private companyPastPerformanceProxyService: CompanyPastperformanceProxyService,

    private auth: AuthService,
    private http: Http,
  ) {

    this.userService.getUsers().then(res => {
      this.allUsers = res
      this.companyService.getCompanies().then(res => {
        this.allCompanies = res
        this.companyUserProxyService.getCompanyUserProxies().then(res => {
          this.allCompanyUserProxies = res
          console.log(this.allCompanyUserProxies[0])
        if (!auth.isLoggedIn()) {
          this.router.navigateByUrl("/login")
        } else {
          this.getAdminStatus()
        }
        })
      })
    })

    // this.http.get('../../../assets/certs.json')
    //   .map((res: any) => res.json())
    //   .subscribe(
    //     (data: any) => {
    //         this.sortedObjects = data;
    //     },
    //     err => console.log(err), // error
    //     () => console.log(this.sortedObjects[0]) // complete
    // );

    // this.http.get('../../../assets/govtnames.json')
    //   .map((res: any) => res.json())
    //   .subscribe(
    //     (data: any) => {
    //         this.govtNames = data;
    //     },
    //     err => console.log(err), // error
    //     () => console.log(this.govtNames[0]) // complete
    // );

    // this.certService.getCerts().then(val => this.sortedObjects = val );
    console.log()

    // this.toolService.getTools().then(val => this.sortedObjects = val );
    //
    // this.userService.getUsers().then(val => this.users = val );
  }

  getAdminStatus() {
    var userId = this.auth.getLoggedInUser()
    this.userService.getUserbyID(userId).toPromise().then((user) =>{
      var currentUserProxy = user.companyUserProxies.filter((proxy)=> {
        return proxy.company
      }).filter((proxy) => {
        return proxy.company._id == this.route.snapshot.params['id']
      })[0]
      if (user.power >= 4){
        this.isUserAdmin = true;
        console.log("you're good")
      } else {
        console.log('nice try')
        this.router.navigateByUrl("/login")
      }
    })
  }

  deleteCompany(company, i){
    this.companyService.deleteCompany(company._id).toPromise().then((res) => {
      console.log("its dead")
      this.allCompanies.splice(i, 1)
    })
  }
  deleteCompanyUserProxy(proxy, i){
    this.companyUserProxyService.deleteCompanyUserProxy(proxy._id).then((res) => {
      console.log("its dead")
      this.allCompanyUserProxies.splice(i, 1)
    })
  }

  ngOnInit() {
  }

  goTo(id: string) {
    this.router.navigate(['user-profile', id]);
  }

// // these are my dev tools to sort the 68000 tools into the format we need. do not use unless you know what you're doing

//SORT TOOLS VERSION 2.0: THIS MERGED ALL THE SUBAGENCIES INTO THE SAME AGENCY ITEM WHILE ALSO BRINGING IN THE ALTERNATIVES FROM THE OLD GOVTNAMES ARRAY

// SORT V3: this is just uploading the certs, it's really not as cool as the previous two.

  sort() {
    console.log('god help us.')
    // no code here right now
    console.log('DONE. We have sorted ' + this.sortedObjects.length + ' so far.')
  }

  //     while (this.sortCounter < this.toSort.length) {
  //       var matchFound = false
  //       for (let i of this.sortedObjects) {
  //         if (this.toSort[this.sortCounter].agency == i.agency) {
  //           i.subagencies.push(this.toSort[this.sortCounter].subagencies[0])
  //           matchFound = true
  //         }
  //       }
  //       if (!matchFound) {
  //         this.toSort[this.sortCounter].alternatives = []
  //         for (let x of this.govtNames) {
  //
  //           if (this.toSort[this.sortCounter].agency.toLowerCase() == x.name.toLowerCase()) {
  //             // console.log(this.toSort[this.sortCounter].agency + ' MATCHES ' + x.name)
  //             this.toSort[this.sortCounter].alternatives = x.alternatives
  //           }
  //         }
  //         this.sortedObjects.push(this.toSort[this.sortCounter])
  //       }
  //       this.sortCounter++
  //     }
  //     for (let g of this.govtNames) {
  //       var matchFound = false
  //       for (let s of this.sortedObjects){
  //         if (g.name.toLowerCase() == s.agency.toLowerCase()) {
  //           matchFound = true
  //         }
  //       }
  //       if (!matchFound) {
  //         console.log('addin a new one!')
  //         this.sortedObjects.push({
  //           agency: g.name,
  //           subagencies: [],
  //           alternatives: g.alternatives
  //         })
  //       }
  //     }
  //   console.log('DONE. We have sorted ' + this.sortedObjects.length + ' so far.')
  // }

  uploadSortedObjects() {
    if ((this.sortedObjects.length - this.uploadCounter) >= 2000 ){
      for (var i = 0; i < 2000; i++) {
        this.certService.createCert(this.sortedObjects[this.uploadCounter]).toPromise();
        this.uploadCounter++
      }
    } else {
      while (this.uploadCounter < this.sortedObjects.length) {
        this.certService.createCert(this.sortedObjects[this.uploadCounter]).toPromise();
        this.uploadCounter++
      }
    }
    console.log('DONE. We have finished ' + this.uploadCounter + ' so far.')
  }

}
