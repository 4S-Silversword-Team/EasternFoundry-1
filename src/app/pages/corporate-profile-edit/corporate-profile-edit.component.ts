import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Company } from '../../classes/company';
import { Product } from '../../classes/product';
import { Service } from '../../classes/service';
import { PastPerformance } from '../../classes/past-performance';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CompanyService } from '../../services/company.service';
import { ProductService } from '../../services/product.service';
import { ServiceService } from '../../services/service.service';
import { PastperformanceService } from '../../services/pastperformance.service';
import { UserService } from '../../services/user.service'
import { CompanyUserProxyService } from '../../services/companyuserproxy.service'

declare var $: any;

@Component({
  selector: 'app-corporate-profile-edit',
  templateUrl: './corporate-profile-edit.component.html',
  styleUrls: ['./corporate-profile-edit.component.css'],
  providers: [ ProductService, ServiceService, PastperformanceService, CompanyService, UserService, CompanyUserProxyService]
})
export class CorporateProfileEditComponent implements OnInit {

  currentAccount: Company = new Company();
  products: Product[] = [];
  services: Service[] = [];
  userProfiles: any[] = [];
  userProfilesAll: any[] = [];
  newUserSelected: string;
  pastperformances: PastPerformance[] = [];
  infoInputWidth: number = 350;

  agencyType: string[] = ['Pro', 'Amature'];
  officeType: string[] = ['Pro', 'Amature'];
  clearedType: string[] = ['Pro', 'Amature'];
  ppImage: string;
  ppInputWidth: number = 300;
  creatingNew: boolean = false;
  writeWidth: number = 800;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private companyService: CompanyService,
    private productService: ProductService,
    private serviceService: ServiceService,
    private ppService: PastperformanceService,
    private userService: UserService,
    private companyUserProxyService: CompanyUserProxyService
  ) {
    if ( this.router.url !== '/corporate-profile-create' ) {
      this.companyService.getCompanyByID(this.route.snapshot.params['id']).toPromise().then((result) => { this.currentAccount = result; myCallback(); });
      // .subscribe(result => this.currentAccount =result).
      // this.currentAccount = this.companyService.getTestCompany()
      const myCallback = () => {
      for (const i of this.currentAccount.product) {
        productService.getProductbyID(i.productId).toPromise().then(res => {this.products.push(res)});
      }

      for (const i of this.currentAccount.service) {
        this.serviceService.getServicebyID(i.serviceId).toPromise().then(res => {this.services.push(res)});
      }

      for (const i of this.currentAccount.pastPerformance) {
        // this.pastperformances.push(ppService.getPastPerformancebyID(i.pastperformanceid))
        ppService.getPastPerformancebyID(i.pastPerformanceId).toPromise().then(res => this.pastperformances.push(res)); // Might try to continue the for loop before the promise resolves.
      }
      this.refreshEmployees();
    };
    }
    else {
      console.log('New Account!')
      this.currentAccount = companyService.getEmptyCompany();
      this.creatingNew = true;
    }
  }

  ngOnInit() {
  }

  addEmployee(employeeId) {

    let request = {
      "userProfile": employeeId,
      "company": this.route.snapshot.params['id'],
      "startDate": "01/01/2001",
      "endDate": "01/02/2001",
      "stillAffiliated": false
    }
    this.companyUserProxyService.addCompanyUserProxy(request).then(() =>
    this.companyService.getCompanyByID(this.route.snapshot.params['id']).toPromise().then((result) => { this.currentAccount.userProfileProxies = result.userProfileProxies; this.refreshEmployees(); }));
  }

  deleteEmployee(proxyId){
    this.companyUserProxyService.deleteCompanyUserProxy(proxyId).then(() =>
    this.companyService.getCompanyByID(this.route.snapshot.params['id']).toPromise().then((result) => { this.currentAccount.userProfileProxies = result.userProfileProxies; this.refreshEmployees(); }));
  }

  switchLeadership(employeeId) {
    var idFound = false;
    for (var i = 0; i < this.currentAccount.leadership.length; i++) {
      if (employeeId == this.currentAccount.leadership[i].userId) {
        this.currentAccount.leadership.splice(i, 1);
        idFound = true;
      }
    }
    if (idFound == false) {
      this.currentAccount.leadership.push(employeeId)
    }
  }

  isLeadership(employeeId) {
    var idFound = false;
    for (var i = 0; i < this.currentAccount.leadership.length; i++) {
      if (employeeId == this.currentAccount.leadership[i].userId) {
        idFound = true;
      }
    }
    if (idFound == true) {
      return true
    } else {
      return false
    }
  }


  updateEmployee(proxyId,key, value){
    let req = {};
    req[key] = value;
    this.companyUserProxyService.updateCompanyUserProxies(proxyId, req).toPromise().then(() =>
    // this.companyService.getCompanyByID(this.route.snapshot.params['id']).toPromise().then((result) => { this.currentAccount.userProfileProxies = result.userProfileProxies; this.refreshEmployees(); }))
    {});
  }

  refreshEmployees() {
    this.userProfiles = []
    for (const i of this.currentAccount.userProfileProxies) {
      this.userProfiles.push({
        "name": i.userProfile.firstName + " " + i.userProfile.lastName,
        "userId": i.userProfile._id,
        "proxyId": i._id,
        "username": i.userProfile.username,
        "startDate": new Date(i.startDate).toDateString(),
        "endDate": new Date(i.endDate).toDateString(),
        "stillAffiliated": i.stillAffiliated
      })
    }
    this.userService.getUsers().then(res => {
      this.userProfilesAll = res.filter((user) => {
        return !this.userProfiles.map(function(employee) {
          return employee.userId;
        }).includes(user._id)
      })
    })
  }

  addProduct() {
    this.products.push(
      {
        _id: "1",
        name: "product 1",
        feature: [
          {
            name: "feature 1",
            score: 10
          }
        ],
        description: "",
        moreInfoLink: "",
        viewDemoLink: "",
        customization: true,
        training: false,
        maintenance: true,
        customers: {
          defense: [
            {
              avatar: "./assets/img/customer1.png",
              name: "customer 1"
            }
          ],
          civilian: [
            {
              avatar: "./assets/img/customer5.png",
              name: "customer 1"
            }
          ],
          commercial: [
            {
              avatar: "./assets/img/customer6.png",
              name: "customer 1"
            }
          ]
        }
      }
    );
  }

  addService() {
    this.services.push(
      {
        _id: "1",
        name: "Service",
        feature: [
          {
            title: "",
            score: 0
          }
        ],
        skills: [
          "",
          ""
        ]
      }
    )
  }

  updateCompany(model) {
    // Mongo cannot update a model if _id field is present in the data provided for the update, so we delete it
    if (this.creatingNew == true) {
      delete model['_id'];
      //this is the code to create the new products/services - it creates them, but it doesn't link them to the company because i can't figure out how to get the _id immediately after creation
      //
      // var serviceDone = false
      // for (const i of this.products) {
      //   const productModel = i
      //   delete productModel['_id'];
      //   this.productService.createProduct(productModel).toPromise().then(result => {
      //     console.log('product result id is: ' + result)
      //     if (this.currentAccount.product[0] == null) {
      //       this.currentAccount.product[0] = {productId: String(result._id)}
      //     } else {
      //       this.currentAccount.product.push({productId: String(result._id)})
      //     }
      //     if (serviceDone == false) {
      //       for (const i of this.services) {
      //         const serviceModel = i
      //         delete serviceModel['_id'];
      //         this.serviceService.createService(serviceModel).toPromise().then(result => {
      //           console.log('service result id is: ' + result._id)
      //           this.currentAccount.service.push({serviceId: String(result._id)})
      //         });
      //       }
      //       serviceDone = true;
      //     }
      //   });
      // }
      this.companyService.createCompany(model).toPromise().then(result => {
        console.log(result)
        window.scrollTo(0, 0);
        this.router.navigate(['companies']);
      });
    } else {
      for (const i of this.currentAccount.product) {
        const productModel = this.products[this.currentAccount.product.indexOf(i)]
        delete productModel['_id'];
        this.productService.updateProduct(i.productId, productModel).toPromise().then(result => console.log(result));
      }
      for (const i of this.currentAccount.service) {
        const serviceModel = this.services[this.currentAccount.service.indexOf(i)]
        delete serviceModel['_id'];
        this.serviceService.updateService(i.serviceId, serviceModel).toPromise().then(result => console.log(result));
      }
      delete model['_id'];
      this.companyService.updateCompany(this.route.snapshot.params['id'], model).toPromise().then(result => console.log(result));
      window.scrollTo(0, 0);
      this.router.navigate(['corporate-profile', this.route.snapshot.params['id']]);
    }
  }


}
