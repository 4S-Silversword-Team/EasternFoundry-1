import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
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
import { CompanyPastperformanceProxyService } from '../../services/companypastperformanceproxy.service'

import { AuthService } from '../../services/auth.service'
import { RoleService } from '../../services/role.service'
import { s3Service } from '../../services/s3.service'

import {environment} from "../../../environments/environment"

declare var $: any;

@Component({
  selector: 'app-corporate-profile-edit',
  templateUrl: './corporate-profile-edit.component.html',
  styleUrls: ['./corporate-profile-edit.component.css'],
  providers: [ ProductService, ServiceService, PastperformanceService, CompanyService, UserService, CompanyUserProxyService, CompanyPastperformanceProxyService, RoleService, s3Service]
})
export class CorporateProfileEditComponent implements OnInit {

  @ViewChild('fileInput') fileInput;

  currentAccount: Company = new Company();
  products: any[] = [];
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
  isUserAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private companyService: CompanyService,
    private productService: ProductService,
    private serviceService: ServiceService,
    private ppService: PastperformanceService,
    private userService: UserService,
    private companyUserProxyService: CompanyUserProxyService,
    private companyPastPerformanceProxyService: CompanyPastperformanceProxyService,
    private auth: AuthService,
    private roleService: RoleService,
    private s3Service: s3Service
  ) {
    // if(!auth.isLoggedIn()){
    //   this.router.navigateByUrl("/login")
    // }
    auth.isLoggedIn().then(res => {
      !res ? this.router.navigateByUrl("/login"): afterLogin()
    }).catch(reason => {console.log("login check failed. redirecting"); this.router.navigateByUrl("/login")})
    let afterLogin = () => {
    if ( this.router.url !== '/corporate-profile-create' ) {
      this.getAdminStatus()
      this.companyService.getCompanyByID(this.route.snapshot.params['id']).toPromise().then((result) => { this.currentAccount = result; myCallback(); });
      // .subscribe(result => this.currentAccount =result).
      // this.currentAccount = this.companyService.getTestCompany()
      const myCallback = () => {
      if (this.currentAccount.product){
      for (const i of this.currentAccount.product) {
        var productId = i.toString()
        productService.getProductbyID(productId).toPromise().then(res => {this.products.push(res)});
      }
      }
      if (this.currentAccount.service){
      for (const i of this.currentAccount.service) {
        var serviceId = i.toString()
        this.serviceService.getServicebyID(serviceId).toPromise().then(res => {this.services.push(res)});
      }
      }

      if(this.currentAccount.pastPerformance){
      for (const i of this.currentAccount.pastPerformance) {
        // this.pastperformances.push(ppService.getPastPerformancebyID(i.pastperformanceid))
        var pastPerformanceId = i.toString()
        ppService.getPastPerformancebyID(pastPerformanceId).toPromise().then(res => this.pastperformances.push(res)); // Might try to continue the for loop before the promise resolves.
      }
      }
      this.refreshEmployees();
      if(!this.checkIfEmployee()){
          // this.router.navigateByUrl("/corporate-profile/"+this.route.snapshot.params['id'])
      }

    };
    }
    else {
      console.log('New Account!')
      this.currentAccount = companyService.getEmptyCompany();
      this.creatingNew = true;
    }
  }
  }

  ngOnInit() {
  }

  uploadPhoto() {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      let formData = new FormData();
      let file = fileBrowser.files[0]
      console.log(file)
      formData.append("bucket", environment.bucketName);
      formData.append("key", "companyPhotos/"+this.currentAccount._id+"_0");
      formData.append("file", file);
      this.s3Service.postPhoto(formData).toPromise().then(result => {
        console.log("Photo upload success",result);
        this.currentAccount.avatar = "http://s3.amazonaws.com/" + environment.bucketName + "/companyPhotos/"+this.currentAccount._id+"_0"
        this.updateCompany(this.currentAccount, true);
      }).catch((reason) =>console.log("reason ", reason));
    }
  }

  editPhoto() {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      if(!this.currentAccount._id){return}
      const uid = this.currentAccount._id;
      let formData = new FormData();
      let file = fileBrowser.files[0]
      let myArr = this.currentAccount.avatar.split("_")
      let i: any = myArr[myArr.length - 1]
      i = parseInt(i);
      console.log(file)
      formData.append("bucket", environment.bucketName);
      formData.append("key", "companyPhotos/"+uid+"_"+(i+1).toString());
      formData.append("file", file);
      this.s3Service.postPhoto(formData).toPromise().then(result => {
        console.log("Photo upload success",result);
        this.currentAccount.avatar = "http://s3.amazonaws.com/" + environment.bucketName + "/companyPhotos/"+uid+"_"+(i+1).toString()
        this.updateCompany(this.currentAccount, true);
        this.s3Service.deletePhoto("/companyPhotos/"+uid+"_"+(i).toString()).toPromise().then( res => console.log("Old photo deleted " + res))
      }).catch((reason) =>console.log("reason ", reason));
    }

  }

  getAdminStatus() {
    var userId = this.auth.getLoggedInUser()
    this.userService.getUserbyID(userId).toPromise().then((user) =>{
      var currentUserProxy = user.companyUserProxies.filter((proxy) => {
        return proxy.company._id == this.route.snapshot.params['id']
      })[0]
      if (user.username == "johnestes4@gmail.com") {
        this.isUserAdmin = true;
        console.log("I'm the best admin")
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

  addEmployee(employeeId) {
    if (!this.isUserAdmin){return;}

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
    if (!this.isUserAdmin){return;}
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

  checkIfEmployee(): boolean{
    return this.userProfiles.map((profile) => {
      return profile.userId
    }).includes(this.auth.getLoggedInUser())
  }

  addProduct() {
    this.products.push(
      {
        _id: "NEW",
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

  deleteProduct(i) {
    // THIS IS A GIANT MESS AND DOESN'T DO WHAT I WANT IT TO SO NEVER MIND.
    // this.products.splice(i, 1);
    // var newProducts: any[] = []
    // for (var x = 0; x < this.products.length; x++) {
    //   console.log(this.products[x])
    //   newProducts.push(this.products[x]._id)
    // }
    // this.currentAccount.product = newProducts
  }

  addService() {
    this.services.push(
      {
        _id: "NEW",
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

  addUserWithRole(company, user, role){
    let request = {
      "userProfile": user,
      "company": company,
      "startDate": "01/01/2001",
      "endDate": "01/02/2001",
      "stillAffiliated": true,
      "role": role
    }
    this.companyUserProxyService.addCompanyUserProxy(request).then((res) =>{
      console.log(res);
      window.scrollTo(0, 0);
      this.router.navigate(['companies']);
    });
  }

  updateCompany(model, noNav?: boolean) {
    // Mongo cannot update a model if _id field is present in the data provided for the update, so we delete it
    if (this.creatingNew == true) {
      delete model['_id'];
      var userId = this.auth.getLoggedInUser()
      this.companyService.createCompany(model).toPromise().then(newCompany => {
        console.log(JSON.parse(newCompany._body)._id)

        //TODO handle if no admin in role collection in Db
        this.roleService.getRoleByTitle("admin").toPromise().then((admin) => {
          console.log("adminresult",admin)
          this.addUserWithRole(JSON.parse(newCompany._body)._id, userId, admin._id);
        })
        // window.scrollTo(0, 0);
        // this.router.navigate(['companies']);
        this.companyService.updateCompany(this.route.snapshot.params['id'], model).toPromise().then(result => this.currentAccount = result);
      });
    } else {
      if(!this.isUserAdmin){return;}
      delete model['_id'];
      //this whole thing updates a bunch of times with nesting promises so it can create a new product and simultaneously add it to the company
      //it doesn't work if you try to add multiple new products, it'll only do one. promises are the worst and i hate them.
      //i am done commenting but want to reassert how much i hate promises
      this.companyService.updateCompany(this.route.snapshot.params['id'], model).toPromise().then(result => this.currentAccount = result);
      if(model.product) {
        for (const i of this.products) {
          if (i._id == "NEW") {
            const productModel = i
            delete productModel['_id'];
            console.log('this will make a new one once this works properly!')
            this.productService.createProduct(productModel).toPromise().then(result => {
              var res: any = result
              var productId = res._body.substring(1,res._body.length-1)
              this.companyService.getCompanyByID(this.route.snapshot.params['id']).toPromise().then((result) => {
                var account = result;
                account.product.push(productId)
                console.log(JSON.stringify(model.product))
                this.companyService.updateCompany(this.route.snapshot.params['id'], account).toPromise().then(result => this.currentAccount = result);
               });
            });
          } else {
            const productModel = i
            var productId = i._id
            delete productModel['_id'];
            this.productService.updateProduct(productId, productModel).toPromise().then(result => console.log(result));
          }
        }
      }
      if (this.currentAccount.service) {
        for (const i of this.services) {
          if (i._id == "NEW") {
            const serviceModel = i
            delete serviceModel['_id'];
            console.log('this will make a new one once this works properly!')
            this.serviceService.createService(serviceModel).toPromise().then(result => console.log(result));
          } else {
            const serviceModel = i
            var serviceId = i._id
            delete serviceModel['_id'];
            this.serviceService.updateService(serviceId, serviceModel).toPromise().then(result => console.log(result));
          }
        }
      }
      if (!noNav) {
        window.scrollTo(0, 0);
        this.router.navigate(['corporate-profile', this.route.snapshot.params['id']]);
      }
    }
  }


}
