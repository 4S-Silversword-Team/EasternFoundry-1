import {Http} from '@angular/http';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../../classes/user';
import { AppService } from '../../services/app.service';

import { UserService } from '../../services/user.service';
import { ToolService } from '../../services/tool.service';
import { CertService } from '../../services/cert.service';
import { AgencyService } from '../../services/agency.service';
import { AuthService } from '../../services/auth.service'
import { CompanyService } from '../../services/company.service';
import { ProductService } from '../../services/product.service';
import { ServiceService } from '../../services/service.service';
import { PastperformanceService } from '../../services/pastperformance.service';
import { CompanyUserProxyService } from '../../services/companyuserproxy.service';
import { CompanyPastperformanceProxyService } from '../../services/companypastperformanceproxy.service';
import { UserPastPerformanceProxyService } from '../../services/userpastperformanceproxy.service';



@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: [ AppService, ProductService, ServiceService, PastperformanceService, CompanyService, UserService, AgencyService, CompanyUserProxyService, CompanyPastperformanceProxyService, UserPastPerformanceProxyService, CertService, ToolService]
})
export class AdminComponent implements OnInit {

  userId: string
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
  allPPs: any[] = [];
  allPPUserProxies: any[] = [];
  allPPCompanyProxies: any[] = [];
  userToDelete: any = {
    on: false
  }
  companyToDelete: any = {
    on: false
  }
  companyUserProxyToDelete: any = {
    on: false
  }
  ppUserProxyToDelete: any = {
    on: false
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appService: AppService,
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
    private userPastPerformanceProxyService: UserPastPerformanceProxyService,
    private auth: AuthService,
    private http: Http,
  ) {

    this.userService.getUsers().then(res => {
      this.allUsers = res
      this.companyService.getCompanies().then(res => {
        this.allCompanies = res
        this.ppService.getPastPerformances().then(res => {
          this.allPPs = res
          this.companyUserProxyService.getCompanyUserProxies().then(res => {
            this.allCompanyUserProxies = res
            this.userPastPerformanceProxyService.getUserPPProxies().then(res => {
              this.allPPUserProxies = res
              this.companyPastPerformanceProxyService.getCompanyPPProxies().then(res => {
                this.allPPCompanyProxies = res
                if (!auth.isLoggedIn()) {
                  this.router.navigateByUrl("/login")
                } else {
                  this.getAdminStatus()
                }
              })
            })
          })
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

    // this.toolService.getTools().then(val => this.sortedObjects = val );

    // this.userService.getUsers().then(val => this.users = val );
  }

  getAdminStatus() {
    this.userId = this.auth.getLoggedInUser()
    this.userService.getUserbyID(this.userId).toPromise().then((user) =>{
      if (user.power >= 4){
        this.isUserAdmin = true;
        console.log("you're good")
      } else {
        console.log('nice try')
        this.router.navigateByUrl("/login")
      }
    })
  }
  deleteUserPrep(user, i) {
    this.userToDelete.user = user
    this.userToDelete.on = true
    this.userToDelete.index = i
  }

  deleteUser(user, i){
    this.userService.deleteUser(user._id).toPromise().then((res) => {
      console.log("its dead")
      this.userToDelete.on = false
      this.userToDelete.user = null
      this.userToDelete.index = null
      this.allUsers.splice(i, 1)
    })
  }

  sendEmail(){
    var mail = ({
      senderEmail: 'federalfoundryforge@gmail.com',
      recipientEmail: 'johnestes4@gmail.com',
      subject: 'emails oh dang',
      contactMessage: 'exciting right dude'
    });

    this.appService.sendEmail(mail).toPromise().then((res) => {
      console.log('email sent i think! check!')
    })
  }

  deleteCompanyPrep(company, i) {
    this.companyToDelete.company = company
    this.companyToDelete.on = true
    this.companyToDelete.index = i
  }
  deleteCompany(company, i){
    this.companyService.deleteCompany(company._id).toPromise().then((res) => {
      console.log("its dead")
      this.companyToDelete.on = false
      this.allCompanies.splice(i, 1)
    })
  }

  deleteCompanyUserProxyPrep(proxy, i) {
    this.companyUserProxyToDelete.proxy = proxy
    this.companyUserProxyToDelete.on = true
    this.companyUserProxyToDelete.index = i
  }

  deleteCompanyUserProxy(proxy, i){
    this.companyUserProxyService.deleteCompanyUserProxy(proxy._id).then((res) => {
      console.log("its dead")
      this.companyUserProxyToDelete.on = false
      this.allCompanyUserProxies.splice(i, 1)
    })
  }

  deletePPUserProxyPrep(proxy, i) {
    this.ppUserProxyToDelete.proxy = proxy
    this.ppUserProxyToDelete.on = true
    this.ppUserProxyToDelete.index = i
  }

  deletePPUserProxy(proxy, i){
    this.userPastPerformanceProxyService.deleteUserPPProxy(proxy._id).then((res) => {
      console.log("its dead")
      this.ppUserProxyToDelete.on = false
      this.allPPUserProxies.splice(i, 1)
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

  // sort() {
  //   console.log('god help us.')
  //     while (this.sortCounter < this.toSort.length) {
  //       var matchFound = false
  //       for (let i of this.sortedObjects) {
  //         if (this.toSort[this.sortCounter].title == i.title) {
  //           i.position.push(this.toSort[this.sortCounter].position[0])
  //           var codeMatch = false
  //           for (let c of i.code) {
  //             if (c.substring(0,2) == this.toSort[this.sortCounter].code[0].substring(0,2)) {
  //               codeMatch = true
  //             }
  //           }
  //           if (!codeMatch) {
  //             i.code.push(this.toSort[this.sortCounter].code[0])
  //           }
  //           matchFound = true
  //         }
  //       }
  //       if (!matchFound) {
  //         this.sortedObjects.push(this.toSort[this.sortCounter])
  //       }
  //       this.sortCounter++
  //     }
  //
  //     // console.log('DONE. We have sorted ' + this.sortedTools.length + ' so far.')
  //     // for (let g of this.govtNames) {
  //     //   var matchFound = false
  //     //   for (let s of this.sortedObjects){
  //     //     if (g.name.toLowerCase() == s.agency.toLowerCase()) {
  //     //       matchFound = true
  //     //     }
  //     //   }
  //     //   if (!matchFound) {
  //     //     console.log('addin a new one!')
  //     //     this.sortedObjects.push({
  //     //       agency: g.name,
  //     //       subagencies: [],
  //     //       alternatives: g.alternatives
  //     //     })
  //     //   }
  //     // }
  //   console.log('DONE. We have sorted ' + this.sortedObjects.length + ' so far.')
  // }

  // uploadSortedObjects() {
  //   if ((this.sortedObjects.length - this.uploadCounter) >= 4000 ){
  //     for (var i = 0; i < 4000; i++) {
  //       this.toolService.createTool(this.sortedObjects[this.uploadCounter]).toPromise();
  //       this.uploadCounter++
  //     }
  //   } else {
  //     while (this.uploadCounter < this.sortedObjects.length) {
  //       this.toolService.createTool(this.sortedObjects[this.uploadCounter]).toPromise();
  //       this.uploadCounter++
  //     }
  //   }
  //   console.log('DONE. We have finished ' + this.uploadCounter + ' so far.')
  // }

  // addToolCode() {
  //   if ((this.sortedObjects.length - this.uploadCounter) >= 2000 ){
  //     for (var i = 0; i < 2000; i++) {
  //       if (!this.sortedObjects[this.uploadCounter].code){
  //
  //       }
  //       this.certService.createCert(this.sortedObjects[this.uploadCounter]).toPromise();
  //       this.uploadCounter++
  //     }
  //   } else {
  //     while (this.uploadCounter < this.sortedObjects.length) {
  //       this.certService.createCert(this.sortedObjects[this.uploadCounter]).toPromise();
  //       this.uploadCounter++
  //     }
  //   }
  //   console.log('DONE. We have finished ' + this.uploadCounter + ' so far.')
  // }

}
