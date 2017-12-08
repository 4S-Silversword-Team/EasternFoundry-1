import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PastperformanceService } from '../../services/pastperformance.service';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { PastPerformance } from '../../classes/past-performance';
import { UserService } from '../../services/user.service';
import { CompanyService } from '../../services/company.service';
import { UserPastPerformanceProxyService } from '../../services/userpastperformanceproxy.service';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';
import { AgencyService } from '../../services/agency.service';
import { MessageService } from '../../services/message.service';
import { CompanyPastperformanceProxyService } from '../../services/companypastperformanceproxy.service';
import { s3Service } from '../../services/s3.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-past-performance-edit',
  providers: [PastperformanceService, UserService, CompanyService, UserPastPerformanceProxyService, AuthService, AgencyService, RoleService, CompanyPastperformanceProxyService, s3Service],
  templateUrl: './past-performance-edit.component.html',
  host: {
      '(document:click)': 'handleClick($event)',
  },
  styleUrls: ['./past-performance-edit.component.css']
})
export class PastPerformanceEditComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  currentPastPerformance: PastPerformance = new PastPerformance();

  userProfiles: any[] = [];
  userProfilesAll: any[] = [];
  companies: any[] = [];
  allCompanyEmployees: any[] = [];
  allUserCompanies: any[] = [];
  newUserSelected: string;
  isReadOnly: boolean = false;
  createMode: boolean = false;
  ppImage: string;
  ppInputWidth: number = 300;
  employeeWidth: number = 600;
  writeWidth: number = 800;
  rate: number = 0;
  allAgencies: any[] = [];
  isUserAdmin: boolean = false;
  fieldsFilled: boolean = false;
  promiseFinished: boolean = false;
  currentDate: string =  (new Date().getMonth() + 1) + '-' + new Date().getDate() + '-' + new Date().getFullYear();
  tomorrow: string;
  searchTerms = {
    name: ''
  };
  searchResults = {
    people: []
  };
  searchOpen: boolean = false;
  noResults = false;

  activeTab = {
    main: 0,
  };

  constructor(
    private pastPerformanceService: PastperformanceService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private userService: UserService,
    private companyService: CompanyService,
    private userPastPerformanceProxyService: UserPastPerformanceProxyService,
    private auth: AuthService,
    private roleService: RoleService,
    private companyPastPerformanceProxyService: CompanyPastperformanceProxyService,
    private s3Service: s3Service,
    private agencyService: AgencyService,
    private messageService: MessageService,
    private titleService: Title,

  ) {
    this.getTomorrow();
    if (!auth.isLoggedIn()) {
      this.router.navigateByUrl('/login');
    } else {
      if (!this.router.url.startsWith('/past-performance-create')) {
        console.log('in past performance edit');
        this.pastPerformanceService.getPastPerformancebyID(this.route.snapshot.params['id']).toPromise().then(res => {
          this.currentPastPerformance = res;
          this.titleService.setTitle('Editing ' + this.currentPastPerformance.title + ' - Federal Foundry Forge');

          if (!this.currentPastPerformance.client){
            this.currentPastPerformance.client = {
              gov: false,
              name: '',
            };
          } else if (!this.currentPastPerformance.client.name){
            this.currentPastPerformance.client = {
              gov: false,
              name: '',
            };
          }
          if (!this.currentPastPerformance.area) {
            this.currentPastPerformance.area = '';
          }
          this.getEditorAdminStatus();
          this.myCallback();
          this.myCallback2();
        });
      } else {
        console.log('in past performance create');
        if (!this.currentPastPerformance.client){
          this.currentPastPerformance.client = {
            gov: false,
            name: '',
          };
        } else if (!this.currentPastPerformance.client.name){
          this.currentPastPerformance.client = {
            gov: false,
            name: '',
          };
        }
        this.createMode = true;
        if (this.route.snapshot.queryParams['company']) {
          this.getCreatorAdminStatus();
        }
      }
    }
  }

  ngOnInit() {
  }

  myCallback() {
    this.userProfiles = [];
    for (const i of this.currentPastPerformance.userProfileProxies){
      this.userProfiles.push({
        'name': i.user.firstName + ' ' + i.user.lastName,
        'username': i.user.username,
        'userId': i.user._id,
        'proxyId': i._id,
        'startDate': i.startDate.slice(0, 10),
        'endDate': i.endDate.slice(0, 10),
        'stillAffiliated': i.stillAffiliated,
        'role': i.role
      });
    }
    this.companies = [];
    for (const i of this.currentPastPerformance.companyProxies){
      this.companies.push({
        'name': i.company.name,
        'companyId': i.company._id,
        'proxyId': i._id,
        'startDate': i.startDate.slice(0, 10),
        'endDate': i.endDate.slice(0, 10),
        'activeContract': i.activeContract
      });
    }
    this.agencyService.getAgencies().then(val => {
      this.allAgencies = val;
      this.promiseFinished = true;
      window.scrollTo(0, 0);
    });
  }

  myCallback2() {
  this.allCompanyEmployees = [];
  const allCompanyEmployees = [];
  this.allUserCompanies = [];
  const allUserCompanies = [];
  for (const companyProxy of this.currentPastPerformance.companyProxies) {
    let myCompany;
    this.companyService.getCompanyByID(companyProxy.company._id).toPromise().then((res) => {myCompany = res; (() => {
      for (const userProfileProxy of myCompany.userProfileProxies) {
        allCompanyEmployees.push(userProfileProxy.userProfile);
      }
      this.allCompanyEmployees = allCompanyEmployees.filter((employee) => {
        return this.currentPastPerformance.userProfileProxies.map((userProxy) => userProxy.user._id).indexOf(employee._id) < 0;
      });
    })(); });
  }
  for (const userProxy of this.currentPastPerformance.userProfileProxies) {
    let myUser;
    this.userService.getUserbyID(userProxy.user._id).toPromise().then((res) => {myUser = res; (() => {
      for (const companyProxy of myUser.companyUserProxies) {
        allUserCompanies.push(companyProxy.company);
      }
      this.allUserCompanies = allUserCompanies.filter((company) => {
        return this.currentPastPerformance.companyProxies.map((companyProxy) => companyProxy.company._id).indexOf(company._id) < 0;
      });
    })(); });
  }
  this.userService.getUsers().then(res => {
    this.userProfilesAll = res.filter((user) => {
      return this.userProfiles.map(function(employee) {
        return employee.userId;
      }).indexOf(user._id) < 0;
    });
  });
}

  getCreatorAdminStatus() {
    console.log('GETTING ADMIN STATUS');
    const userId = this.auth.getLoggedInUser();
    this.userService.getUserbyID(userId).toPromise().then((user) => {
      const currentUserProxy = user.companyUserProxies.filter((proxy) => {
        return proxy.company._id === this.route.snapshot.queryParams['company'];
      })[0];
      if (currentUserProxy) {
        if (currentUserProxy.role.title && currentUserProxy.role.title === 'admin') {
          this.isUserAdmin = true;
          console.log('I\'m admin');
          this.promiseFinished = true;
        }
      }
    });
  }

  getEditorAdminStatus() {
    const userId = this.auth.getLoggedInUser();
    // get user
    this.userService.getUserbyID(userId).toPromise().then((user) => {
      let superUser = false;
      if (user.power) {
        if (user.power > 3) {
          this.isUserAdmin = true;
          superUser = true;
        }
      }
      if (!superUser) {
        // get the company ids where the user is admin
        const relevantCompanyIds = user.companyUserProxies.filter(async (proxy) => {
          let returnVal;
          proxy.roleObj.title == 'admin' ? returnVal = true : returnVal = false;

          // await this.roleService.getRoleByID(proxy.role).toPromise().then(async (roleObj) => {
          //   await roleObj.title == "admin"? returnVal = true: returnVal = false;
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

  getTomorrow(){
    let tomorrowMonth = new Date().getMonth() + 1;
    let tomorrowDay = new Date().getDate() + 1;
    const tomorrowYear = new Date().getFullYear();
    if (tomorrowMonth === 13) {
      tomorrowMonth = 1;
    }
    if (tomorrowMonth === (1 || 3 || 5 || 7 || 8 || 10)) {
      if (tomorrowDay > 31) {
        tomorrowDay = 1;
        tomorrowMonth += 1;
      }
    } else if (tomorrowMonth === 2) {
      if (tomorrowDay > 28) {
        tomorrowDay = 1;
        tomorrowMonth += 1;
      }
    } else if (tomorrowMonth === 12) {
      if (tomorrowDay > 31) {
        tomorrowDay = 1;
        tomorrowMonth = 1;
      }
    } else {
      if (tomorrowDay > 30) {
        tomorrowDay = 1;
        tomorrowMonth += 1;
      }
    }
    this.tomorrow = tomorrowMonth + '-' + tomorrowDay + '-' + tomorrowYear;
    console.log(this.tomorrow);
  }

  agencyListFormatter (data: any) {
    return data.agency;
  }

  agencyValidCheck (agency) {
    let match = false;
    for (const a of this.allAgencies) {
      if (a.agency.toString().toLowerCase() == agency.toString().toLowerCase()){
        match = true;
        agency = a.agency;
      }
    }
    return match;
  }

  handleClick(event) {
    let clickedComponent = event.target;
    let inside = false;
    do {
      if (clickedComponent === document.getElementById('employee-dropdown') || clickedComponent === document.getElementById('employee-search')) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside) {
      this.searchOpen = false;
    }
  }

  switchTab(tab) {
    if (!this.createMode) {
      this.activeTab.main = tab;
    } else {
      if (tab === 2) {
        if (this.checkFields()) {
          this.activeTab.main = tab;
        }
      } else {
        this.activeTab.main = tab;
      }
    }
  }

  checkFields() {
    if (
      this.currentPastPerformance.title &&
      this.currentPastPerformance.client.name &&
      this.currentPastPerformance.topic &&
      this.currentPastPerformance.startDate &&
      this.currentPastPerformance.endDate &&
      this.currentPastPerformance.location &&
      this.currentPastPerformance.value &&
      this.currentPastPerformance.area &&
      this.currentPastPerformance.fte
    )
    {
      return true;
    } else {
      return false;
    }
  }

  uploadPhoto() {
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      const file = fileBrowser.files[0];
      console.log(file);
      formData.append('bucket', environment.bucketName);
      formData.append('key', 'pastPerformancePhotos/' + this.currentPastPerformance._id + '_0');
      formData.append('file', file);
      this.s3Service.postPhoto(formData).toPromise().then(result => {
        console.log('Photo upload success', result);
        this.currentPastPerformance.avatar = 'http://s3.amazonaws.com/' + environment.bucketName + '/pastPerformancePhotos/' + this.currentPastPerformance._id + '_0';
        this.updatePP(this.currentPastPerformance, true);
      }).catch((reason) => console.log('reason ', reason));
    }
  }

  search() {
    if (this.searchTerms.name) {
      this.noResults = false;
      this.searchResults.people = [];
      for (const person of this.userProfilesAll) {
        if (person.public) {
          const name: string = person.firstName + ' ' + person.lastName;
          if (name.toLowerCase().indexOf(this.searchTerms.name.toLowerCase()) >= 0) {
            let alreadyThere = false;
            for (const employee of this.userProfiles) {
              if (employee.username === person.username) {
                alreadyThere = true;
              }
            }
            if (!alreadyThere) {
              person.invited = false;
              this.searchResults.people.push(person);
            }
          }
        }
      }
    }
    if (this.searchResults.people.length < 1) {
      this.noResults = true;
    }
    this.searchOpen = true;
  }

  invite(person, i) {
    const date = new Date();
    const time = date.getTime();
    const invite = {
      bugReport: false,
      sender: {
        id: this.currentPastPerformance.companyProxies[0].company._id,
        name: this.currentPastPerformance.companyProxies[0].company.name,
        avatar: this.currentPastPerformance.companyProxies[0].company.avatar,
      },
      recipient: [{
        id: person._id,
        name: person.firstName + ' ' + person.lastName,
        avatar: person.avatar,
      }],
      subject: 'Invitiation To Join ' + this.currentPastPerformance.title,
      content: this.currentPastPerformance.companyProxies[0].name + ' has invited you to join ' + this.currentPastPerformance.title + '. Would you like to accept?',
      isInvitation: true,
      invitation: {
        fromUser: false,
        companyId: '',
        pastPerformanceId: this.currentPastPerformance._id,
        pastPerformanceName: this.currentPastPerformance.title,
      },
      replyToId: '',
      date: date,
      timestamp: time,
    };
    this.messageService.createMessage(invite).toPromise().then((result) => {
      console.log('did it');
      person.invited = true;
    });
  }

  editPhoto() {
    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      if (!this.currentPastPerformance._id) {return; }
      const uid = this.currentPastPerformance._id;
      const formData = new FormData();
      const file = fileBrowser.files[0];
      const myArr = this.currentPastPerformance.avatar.split('_');
      let i: any = myArr[myArr.length - 1];
      i = parseInt(i);
      console.log(file);
      formData.append('bucket', environment.bucketName);
      formData.append('key', 'pastPerformancePhotos/' + uid + '_' + (i + 1).toString());
      formData.append('file', file);
      this.s3Service.postPhoto(formData).toPromise().then(result => {
        console.log('Photo upload success', result);
        this.currentPastPerformance.avatar = 'http://s3.amazonaws.com/' + environment.bucketName + '/pastPerformancePhotos/' + uid + '_' + (i + 1).toString();
        this.updatePP(this.currentPastPerformance, true);
        this.s3Service.deletePhoto('/pastPerformancePhotos/' + uid + '_' + (i).toString()).toPromise().then( res => console.log('Old photo deleted ' + res));
      }).catch((reason) => console.log('reason ', reason));
    }

  }


  updatePP(model, noNav?: boolean) {
    // require auth of a signed in user with admin priveleges to the company that this past performance will be associated with.
    if (!this.isUserAdmin) {return; }

    if (!model.avatar) {
      model.avatar = '../../assets/img/defaultLogo.png';
    }
    // Mongo cannot update a model if _id field is present in the data provided for the update, so we delete it
    if ( !this.createMode ) {
    delete model['_id'];
    this.pastPerformanceService.updatePP(this.route.snapshot.params['id'], model).toPromise().then(result => {
      console.log(result);
      this.currentPastPerformance = result;
      if (!noNav) {
        window.scrollTo(0, 0);
        this.router.navigate(['past-performance', this.route.snapshot.params['id']]);
      }
    });
  } else {
    // creating a new PP
    console.log(model);
    this.pastPerformanceService.createPastPerformance(model).toPromise().then(result => {console.log(result);

      // a call to create a companyPastPerformanceProxy with the appropriate company and the newly created past performance's id
      const callback = () => {
        const request = {
          company: this.route.snapshot.queryParams['company'],
          pastPerformance: result['_id'],
          startDate: this.currentDate,
          endDate: '',
          activeContract: true
        };
        this.companyPastPerformanceProxyService.addCompanyPPProxy(request).then((proxy) => {
          // Finally, redirect to the past performance
          window.scrollTo(0, 0);
          this.router.navigate(['past-performance', result['_id']]);
        });

      };
      // call addEmployee with the signed in user's id and the new pastperformance id.
      this.addFirstEmployee(this.auth.getLoggedInUser(), result['_id'], callback);
    });
  }
  }
  addEmployee(employeeId) {
    if (!this.isUserAdmin) {return; }
    const request = {
      'user': employeeId,
      'pastPerformance': this.route.snapshot.params['id'],
      'startDate': this.currentDate,
      'endDate': this.tomorrow,
      'stillAffiliated': false,
      'role': 'programmer'
    };
    console.log(request);
    this.userPastPerformanceProxyService.addUserPPProxy(request).then(() => {
      this.pastPerformanceService.getPastPerformancebyID(this.route.snapshot.params['id']).toPromise().then(res => {this.currentPastPerformance = res; this.myCallback(); this.myCallback2(); this.searchOpen = false; });
    });
  }

  addFirstEmployee(employeeId, pastPerformanceId, callback) {
    const request = {
      'user': employeeId,
      'pastPerformance': pastPerformanceId,
      'startDate': this.currentDate,
      'endDate': this.tomorrow,
      'stillAffiliated': true,
      'role': 'programmer'
    };
    console.log(request);
    this.userPastPerformanceProxyService.addUserPPProxy(request).then(() => callback());
  }

  deleteEmployee(proxyId) {
    if (!this.isUserAdmin){return; }
    this.userPastPerformanceProxyService.deleteUserPPProxy(proxyId).then(() => {
      this.pastPerformanceService.getPastPerformancebyID(this.route.snapshot.params['id']).toPromise().then(res => {this.currentPastPerformance = res; this.myCallback(); this.myCallback2(); });
    });
  }

  updateEmployee(proxyId, key, value) {
    if (!this.isUserAdmin){return; }
    const req = {};
    req[key] = value;
    this.userPastPerformanceProxyService.updateUserPPProxies(proxyId, req).toPromise().then(() =>
    {});
  }

  addCompany(companyId) {
    if (!this.isUserAdmin){return; }
    const request = {
      'company': companyId,
      'pastPerformance': this.route.snapshot.params['id'],
      'startDate': this.currentDate,
      'endDate': this.tomorrow,
      'stillAffiliated': false
    };
    console.log(request);
    this.companyPastPerformanceProxyService.addCompanyPPProxy(request).then(() => {
      this.pastPerformanceService.getPastPerformancebyID(this.route.snapshot.params['id']).toPromise().then(res => {this.currentPastPerformance = res; this.myCallback(); this.myCallback2(); });
    });
  }

  deleteCompany(proxyId) {
    if (!this.isUserAdmin){return; }
    this.companyPastPerformanceProxyService.deleteCompanyPPProxy(proxyId).then(() => {
      this.pastPerformanceService.getPastPerformancebyID(this.route.snapshot.params['id']).toPromise().then(res => {this.currentPastPerformance = res; this.myCallback(); this.myCallback2(); });
    });
  }

  updateCompany(proxyId, key, value) {
    if (!this.isUserAdmin){return; }
    const req = {};
    req[key] = value;
    this.companyPastPerformanceProxyService.updateCompanyPPProxies(proxyId, req).toPromise().then(() =>
    {});
  }

  // addEmployee(modelEmployees: Array<Object>){
  //   modelEmployees.push({title: "", stillwith: false})
  // }
  deleteArrayIndex(modelArray: Array<Object>, i: number) {
    modelArray.splice(i, 1);
  }
  back() {
    this.location.back();
  }

}
