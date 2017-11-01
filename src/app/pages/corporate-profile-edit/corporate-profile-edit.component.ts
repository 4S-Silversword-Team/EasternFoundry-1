import { Component, OnInit, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { Company } from '../../classes/company';
import { Product } from '../../classes/product';
import { Service } from '../../classes/service';
import { User } from '../../classes/user';
import { PastPerformance } from '../../classes/past-performance';
import { Message } from '../../classes/message'

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CompanyService } from '../../services/company.service';
import { ProductService } from '../../services/product.service';
import { ServiceService } from '../../services/service.service';
import { PastperformanceService } from '../../services/pastperformance.service';
import { UserService } from '../../services/user.service'
import { AgencyService } from '../../services/agency.service'
import { CompanyUserProxyService } from '../../services/companyuserproxy.service'
import { CompanyPastperformanceProxyService } from '../../services/companypastperformanceproxy.service'
import { MessageService } from '../../services/message.service'

import { AuthService } from '../../services/auth.service'
import { RoleService } from '../../services/role.service'
import { s3Service } from '../../services/s3.service'

import {environment} from "../../../environments/environment"

declare var $: any;

@Component({
  selector: 'app-corporate-profile-edit',
  host: {
      '(document:click)': 'handleClick($event)',
  },
  templateUrl: './corporate-profile-edit.component.html',
  styleUrls: ['./corporate-profile-edit.component.css'],
  providers: [ ProductService, ServiceService, PastperformanceService, CompanyService, UserService, AgencyService, CompanyUserProxyService, CompanyPastperformanceProxyService, RoleService, MessageService, s3Service]
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
  companyAdminCount: number;
  adminRoleId: string;
  fieldsFilled: boolean = false;
  currentUser: User = new User();

  searchTerms = {
    name: ''
  };
  searchResults = {
    people: []
  };
  searchOpen: boolean = false
  noResults = false
  productTabs = [0]
  activeTab = {
    main: 0,
    product: 0,
  }
  invitationSent: boolean[] = []

  allAgencies: any[] = []

  currentDate: string =  (new Date().getMonth()+1) + '-' + new Date().getDate() + '-' + new Date().getFullYear()
  tomorrow: string

  lastStartDate: string;
  lastEndDate: string;

  promiseFinished: boolean = false;
  public elementRef

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private companyService: CompanyService,
    private productService: ProductService,
    private serviceService: ServiceService,
    private agencyService: AgencyService,
    private ppService: PastperformanceService,
    private userService: UserService,
    private companyUserProxyService: CompanyUserProxyService,
    private companyPastPerformanceProxyService: CompanyPastperformanceProxyService,
    private auth: AuthService,
    private roleService: RoleService,
    private myElement: ElementRef,
    private messageService: MessageService,
    private s3Service: s3Service
  ) {
    this.elementRef = myElement
    // if(!auth.isLoggedIn()){
    //   this.router.navigateByUrl("/login")
    // }
    this.getTomorrow()
    console.log(auth.isLoggedIn())
    if (!auth.isLoggedIn()) {
      this.router.navigateByUrl("/login")
    } else {
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
      console.log('???????')
      for (let p of this.currentAccount.product) {
        if (this.productTabs.length > 0) {
          this.productTabs.push(0)
        } else {
          this.productTabs[0] = 0
        }
      }
      this.agencyService.getAgencies().then(val => {
        this.allAgencies = val
        this.promiseFinished = true
      });

    };
    }
    else {
      console.log('New Account!')
      this.currentAccount = companyService.getEmptyCompany();
      this.creatingNew = true;
      this.promiseFinished = true
    }
  }
  }

  ngOnInit() {
  }

  invite(person, i){
    var date = new Date()
    var time = date.getTime()
    var invite = {
      bugReport: false,
      sender: {
        id: this.currentAccount._id,
        name: this.currentAccount.name,
        avatar: this.currentAccount.avatar,
      },
      recipient: [{
        id: person._id,
        name: person.firstName + ' ' + person.lastName,
        avatar: person.avatar,
      }],
      subject: 'Invitiation To Join ' + this.currentAccount.name,
      content: this.currentAccount.name + ' has invited you to join their company. Would you like to accept?',
      isInvitation: true,
      invitation: {
        fromUser: false,
        companyId: this.currentAccount._id,
        pastPerformanceId: '',
      },
      replyToId: '',
      date: date,
      timestamp: time,
    }
    this.messageService.createMessage(invite).toPromise().then((result) => {
      console.log('did it')
      this.invitationSent[i] = true
    });
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  getTomorrow(){
    var tomorrowMonth = new Date().getMonth()+1
    var tomorrowDay = new Date().getDate()+1
    var tomorrowYear = new Date().getFullYear()
    if (tomorrowMonth == 13){
      tomorrowMonth = 1
    }
    if (tomorrowMonth == (1 || 3 || 5 || 7 || 8 || 10)){
      if (tomorrowDay > 31) {
        tomorrowDay = 1
        tomorrowMonth += 1
      }
    } else if (tomorrowMonth == 2){
      if (tomorrowDay > 28) {
        tomorrowDay = 1
        tomorrowMonth += 1
      }
    } else if (tomorrowMonth == 12){
      if (tomorrowDay > 31) {
        tomorrowDay = 1
        tomorrowMonth = 1
      }
    } else {
      if (tomorrowDay > 30) {
        tomorrowDay = 1
        tomorrowMonth += 1
      }
    }
    this.tomorrow = tomorrowMonth + '-' + tomorrowDay + '-' + tomorrowYear
    console.log(this.tomorrow)
  }

  handleClick(event){
    var clickedComponent = event.target;
    var inside = false;
    do {
      if (clickedComponent === document.getElementById('employee-dropdown') || clickedComponent === document.getElementById('employee-search')) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if(!inside){
      this.searchOpen = false
    }
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

  agencyListFormatter (data: any) {
    return data.agency;
  }

  agencyValidCheck (agency) {
    var match = false
    for (let a of this.allAgencies) {
      if (a.agency.toString().toLowerCase() == agency.toString().toLowerCase()){
        match = true
        agency = a.agency
      }
    }
    return match;
  }

  getAdminStatus() {
    var userId = this.auth.getLoggedInUser()
    this.userService.getUserbyID(userId).toPromise().then((user) =>{
      this.currentUser = user
      var currentUserProxy = user.companyUserProxies.filter((proxy)=> {
        return proxy.company
      }).filter((proxy) => {
        return proxy.company._id == this.route.snapshot.params['id']
      })[0]
      if (user.power >= 4){
        this.isUserAdmin = true;
        console.log("I'm SUPER admin")
      }
      if(currentUserProxy){
        if (currentUserProxy.role.title && currentUserProxy.role.title == "admin") {
          this.isUserAdmin = true;
          console.log("I'm admin")
        }
      }
    })
  }

  changeCustomerTab(index, product, num) {
    var customersDefense = []
    var customersCommercial = []
    var customersCivilian = []
    if (product.customers.defense) {
      for (let i of product.customers.defense) {
        if (i.name.length > 0) {
          customersDefense.push(i)
        }
      }
      product.customers.defense = customersDefense
    }
    if (product.customers.commercial) {
      for (let i of product.customers.commercial) {
        if (i.name.length > 0) {
          customersCommercial.push(i)
        }
      }
      product.customers.commercial = customersCommercial
    }
    if (product.customers.civilian) {
      for (let i of product.customers.civilian) {
        if (i.name.length > 0) {
          customersCivilian.push(i)
        }
      }
      product.customers.civilian = customersCivilian
    }
    this.productTabs[index] = num
  }

  checkFields(num){
    var profilePass = false
    if (
      this.currentAccount.name &&
      this.currentAccount.email &&
      this.currentAccount.contactNumber &&
      this.currentAccount.contactNumber.length == 14 &&
      this.currentAccount.address &&
      this.currentAccount.city &&
      this.currentAccount.state &&
      this.currentAccount.zip
    ){
      profilePass = true
    }

    var productsPass = true
    for (let p of this.products) {
      if (!p.name) {
        console.log('name failure')
        productsPass = false
      } else {
        for (let i of p.customers.defense) {
          if (i.length < 1) {
            console.log('defense failure')
            productsPass = false
          }
        }
        for (let i of p.customers.commercial) {
          if (i.length < 1) {
            console.log('commercial failure')
            productsPass = false
          }
        }
        for (let i of p.customers.civilian) {
          if (i.length < 1) {
            console.log('civilian failure')
            productsPass = false
          }
        }
        for (let f of p.feature) {
          if (!f.name || !f.score) {
            console.log('feature name/score failure')
            productsPass = false
          }
        }
      }
    }
    if (num == 0){
      return profilePass
    } else if (num == 1){
      return true
    } else if (num == 2){
      return productsPass
    } else if (num == 9){
      return (productsPass && profilePass)
    }
  }

  switchTab(newTab) {
    this.activeTab.main = newTab
  }


  checkCompanyAdminCount() {
    let employeeRoleIds = this.currentAccount.userProfileProxies.map((proxy) => proxy.role);
    this.roleService.getRoleByTitle("admin").toPromise().then((role) => {
      if (role && role._id){
        this.adminRoleId = role._id
        this.companyAdminCount = employeeRoleIds.filter((item) => item == role._id).length
      }
    })
  }


  addEmployee(employeeId, searchResultIndex) {
    if (!this.isUserAdmin){return;}
    let request = {
      "userProfile": employeeId,
      "company": this.route.snapshot.params['id'],
      "startDate": this.currentDate,
      "endDate": this.currentDate,
      "stillAffiliated": false
    }
    this.companyUserProxyService.addCompanyUserProxy(request).then(() =>
    this.companyService.getCompanyByID(this.route.snapshot.params['id']).toPromise().then((result) => {
      this.currentAccount.userProfileProxies = result.userProfileProxies;
      this.refreshEmployees();
      this.searchResults.people.splice(searchResultIndex, 1)
      this.searchOpen = false
    }));
  }

  deleteEmployee(proxyId, proxyRoleId){
    if (!this.isUserAdmin){return;}
    if(proxyRoleId){
      this.roleService.getRoleByID(proxyRoleId).toPromise().then((role) => {
        if (!role.title || role.title !== "admin" || this.companyAdminCount >= 2) { // Prevents only admin from being deleted. TODO: Make a backend implementation
            this.companyUserProxyService.deleteCompanyUserProxy(proxyId).then(() =>
            this.companyService.getCompanyByID(this.route.snapshot.params['id']).toPromise().then((result) => { this.currentAccount.userProfileProxies = result.userProfileProxies; this.refreshEmployees(); }));
        }
        else {
          console.log("Can't delete only admin")
        }
      })
    } else {
        this.companyUserProxyService.deleteCompanyUserProxy(proxyId).then(() =>
        this.companyService.getCompanyByID(this.route.snapshot.params['id']).toPromise().then((result) => { this.currentAccount.userProfileProxies = result.userProfileProxies; this.refreshEmployees(); }));
    }

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

  updateEmployeeDate(employee, proxyId, key, value) {
    if (employee.startDate.length < 10 || employee.endDate.length < 10) {
      console.log('not lettin this thing break everything!')
      return;
    } else if (employee.startDate == this.lastStartDate || employee.endDate == this.lastEndDate) {
      console.log('you didnt even change it! nah')
      return;
    } else {
      this.updateEmployee(proxyId,key, value)
    }
  }

  updateEmployee(proxyId,key, value){
    if (!this.isUserAdmin){return;}
    let req = {};
    req[key] = value;
    this.companyUserProxyService.updateCompanyUserProxies(proxyId, req).toPromise().then(() =>
      this.companyService.getCompanyByID(this.route.snapshot.params['id']).toPromise().then((result) => { this.currentAccount.userProfileProxies = result.userProfileProxies; this.refreshEmployees(); console.log('updated!')})
    );

  }

  refreshEmployees() {
    this.userProfiles = []
    for (const i of this.currentAccount.userProfileProxies) {
      if (i.userProfile.firstName) {
        var newStartDate
        var newEndDate
        if (!i.startDate || i.startDate.length < 10) {
          newStartDate = ''
        } else {
          newStartDate = i.startDate.slice(0,10)
        }
        if (i.endDate || i.endDate < 10) {
          newEndDate = i.endDate.slice(0,10)
        } else {
          newEndDate = ''
        }
        this.userProfiles.push({
          "name": i.userProfile.firstName + " " + i.userProfile.lastName,
          "userId": i.userProfile._id,
          "proxyId": i._id,
          "username": i.userProfile.username,
          "startDate": newStartDate,
          "endDate": newEndDate,
          "avatar": i.userProfile.avatar,
          "stillAffiliated": i.stillAffiliated,
          "role": i.role,
          "leader": i.leader
        })
      }
    }
    this.userService.getUsers().then(res => {
      this.userProfilesAll = res.filter((user) => {
        return !this.userProfiles.map(function(employee) {
          return employee.userId;
        }).includes(user._id)
      })
    })
    this.checkCompanyAdminCount()
  }

  checkIfEmployee(): boolean{
    return this.userProfiles.map((profile) => {
      return profile.userId
    }).includes(this.auth.getLoggedInUser())
  }

  search() {
    if (this.searchTerms.name) {
      this.noResults = false
      this.searchResults.people = []
      for (let person of this.userProfilesAll) {
        if (person.public) {
          var name: string = person.firstName + ' ' + person.lastName
          if (name.toLowerCase().includes(this.searchTerms.name.toLowerCase())) {
            var alreadyThere = false
            for (let employee of this.userProfiles) {
              if (employee.username == person.username){
                alreadyThere = true
              }
            }
            if (!alreadyThere) {
              this.searchResults.people.push(person)
            }
          }
        }
      }
    }
    if (this.searchResults.people.length < 1) {
      this.noResults = true
    }
    for (let p of this.searchResults.people) {
      this.invitationSent.push(false)
    }
    this.searchOpen = true;
  }
  asdf(){
    console.log('asdf')
  }
  no(){
    console.log('no')
  }

  addProduct() {
    this.products.push(
      {
        _id: "NEW",
        name: "",
        feature: [
        ],
        description: "",
        moreInfoLink: "",
        viewDemoLink: "",
        customization: true,
        training: false,
        maintenance: true,
        customers: {
          defense: [
          ],
          civilian: [
          ],
          commercial: [
          ]
        }
      }
    );
    this.productTabs.push(0)
  }

  deleteProduct(i) {
    console.log('?')
    var toDelete = this.products[i]
    var toDeleteId = 0
    this.products.splice(i, 1);
    for (var x = 0; x < this.currentAccount.product.length; x++) {
      if (toDelete._id == this.currentAccount.product[x]) {
        this.currentAccount.product.splice(x,1)
      }
    }
  }

  addService() {
    this.services.push(
      {
        _id: "NEW",
        name: "New Service",
        feature: [
          {
            title: "",
            score: 0
          }
        ],
        skills: [
          ""
        ]
      }
    )
  }

  deleteService(i) {
    var toDelete = this.services[i]
    var toDeleteId = 0
    this.services.splice(i, 1);
    for (var x = 0; x < this.currentAccount.service.length; x++) {
      if (toDelete._id == this.currentAccount.service[x].serviceId) {
        this.currentAccount.service.splice(x,1)
      }
    }
  }

  addSkill(service){
    service.skills.push("")
  }

  deleteSkill(service, i) {
    service.skills.splice(i,1)
  }

  addFeature(service){
    service.feature.push({title: '', score: 0})
  }

  deleteFeature(service, i) {
    service.feature.splice(i,1)
  }

  addVehicle() {
    this.currentAccount.vehicles.push(
      {
        vehicleType: '',
        quantity: 0
      }
    )
  }

  deleteVehicle(vehicle, i) {
    this.currentAccount.vehicles.splice(i,1)
  }

  addCustomerDefense(product){
    product.customers.defense.push({
      name: '',
      avatar: ''
    })
  }

  addCustomerCommercial(product){
    product.customers.commercial.push({
      name: '',
      avatar: ''
    })
  }

  addCustomerCivilian(product){
    product.customers.civilian.push({
      name: '',
      avatar: ''
    })
  }

  deleteCustomerDefense(product, i){
    product.customers.defense.splice(i, 1)
  }

  deleteCustomerCommercial(product, i){
    product.customers.commercial.splice(i, 1)
  }

  deleteCustomerCivilian(product, i){
    product.customers.civilian.splice(i, 1)
  }

  onPhoneChange(event, backspace) {
    // remove all mask characters (keep only numeric)
    var newVal: string = event.replace(/\D/g, '');
    // special handling of backspace necessary otherwise
    // deleting of non-numeric characters is not recognized
    // this laves room for improvement for example if you delete in the
    // middle of the string
    if (backspace) {
      newVal = newVal.substring(0, newVal.length);
    }

    // don't show braces for empty value
    if (newVal.length == 0) {
      newVal = '';
    } else if (newVal.length < 3) {
      newVal = newVal
    }
    // don't show braces for empty groups at the end
    else if (newVal.length == 3) {
      newVal = newVal.replace(/^(\d{0,3})/, '($1)');
    } else if (newVal.length <= 6) {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})/, '($1)-$2');
    } else {
      newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1)-$2-$3');
    }
    // set the new value
    this.currentAccount.contactNumber = newVal;

  }

  addUserWithRole(company, user, role){
    let request = {
      "userProfile": user,
      "company": company,
      "startDate": this.currentDate,
      "endDate": this.tomorrow,
      "stillAffiliated": true,
      "role": role
    }
    this.companyUserProxyService.addCompanyUserProxy(request).then((res) =>{
      console.log(res);
      window.scrollTo(0, 0);
      this.router.navigate(['corporate-profile', company]);
    });
  }

  updateCompany(model, noNav?: boolean) {

    //all these arrays are filled with "null" on creation because otherwise none of it worked properly
    //so this cleans all that up because i guess it's fine afterwards.
    if (model.pastPerformance[0] == null) {
      model.pastPerformance.splice(0,1)
    }
    if (model.service[0] == null) {
      model.service.splice(0,1)
    }
    if (model.product[0] == null) {
      model.product.splice(0,1)
    }
    if (model.leadership[0] == null) {
      model.leadership.splice(0,1)
    }

    if (this.creatingNew == true) {
      // Mongo cannot update a model if _id field is present in the data provided for the update, so we delete it
      delete model['_id'];
      var userId = this.auth.getLoggedInUser()

      this.companyService.createCompany(model).toPromise().then(newCompany => {
        var companyId = JSON.parse(newCompany._body)._id
        console.log(companyId)

        //TODO handle if no admin in role collection in Db
        this.roleService.getRoleByTitle("admin").toPromise().then((admin) => {
          console.log("adminresult",admin)
          this.addUserWithRole(companyId, userId, admin._id);
        })

      });
    } else {
      if(!this.isUserAdmin){return;}
      var companyId = model._id
      delete model['_id'];
      var productPromises = []
      var servicePromises = []
      var accountPromises = []
      if(model.product) {
        for (const i of this.products) {
          if (i._id == "NEW") {
            const productModel = i
            delete productModel['_id'];
            productPromises.push(this.productService.createProduct(productModel).toPromise().then((result) => {
              var res: any = result
              console.log(JSON.parse(res._body)._id)
              model.product.push(JSON.parse(res._body)._id)
            }))
          } else {
          const productModel = i
          var productId = i._id
          delete productModel['_id'];
          productPromises.push(this.productService.updateProduct(productId, productModel).toPromise().then(result => {
            var res: any = result
            console.log(res)
          }));
          }
        }
      }
      if (this.currentAccount.service) {
        for (const i of this.services) {
          if (i._id == "NEW") {
            const serviceModel = i
            delete serviceModel['_id'];
            servicePromises.push(this.serviceService.createService(serviceModel).toPromise().then((result) => {
              var res: any = result
              console.log(JSON.parse(res._body)._id)
              model.service.push(JSON.parse(res._body)._id)
            }))
          } else {
          const serviceModel = i
          var serviceId = i._id
          delete serviceModel['_id'];
          servicePromises.push(this.serviceService.updateService(serviceId, serviceModel).toPromise().then(result => {
            var res: any = result
            console.log(res)
          }));
          }
        }
      }
      Promise.all(productPromises).then(products=>{
        Promise.all(servicePromises).then(services=>{
          this.companyService.updateCompany(this.route.snapshot.params['id'], model).toPromise().then((result) => {
            if (!noNav) {
              window.scrollTo(0, 0);
              this.router.navigate(['corporate-profile', this.route.snapshot.params['id']]);
            }
         });
        })
      })
    }
  }

}
