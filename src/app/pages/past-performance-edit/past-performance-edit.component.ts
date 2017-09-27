import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PastperformanceService } from '../../services/pastperformance.service';
import { Location } from '@angular/common'

import { PastPerformance } from '../../classes/past-performance'
import { UserService } from '../../services/user.service'
import { CompanyService } from '../../services/company.service'
import { UserPastPerformanceProxyService } from '../../services/userpastperformanceproxy.service'
import { AuthService } from "../../services/auth.service"
import { RoleService } from "../../services/role.service"
import { CompanyPastperformanceProxyService } from "../../services/companypastperformanceproxy.service"
import { s3Service } from "../../services/s3.service"

import { environment } from "../../../environments/environment"



@Component({
  selector: 'app-past-performance-edit',
  providers: [PastperformanceService, UserService, CompanyService, UserPastPerformanceProxyService, AuthService, RoleService, CompanyPastperformanceProxyService, s3Service],
  templateUrl: './past-performance-edit.component.html',
  styleUrls: ['./past-performance-edit.component.css']
})
export class PastPerformanceEditComponent implements OnInit {
  @ViewChild('fileInput') fileInput;

  currentPastPerformance: PastPerformance = new PastPerformance()

  agencyType: string[] = ['Pro', 'Amature'];
  officeType: string[] = ['Pro', 'Amature'];
  clearedType: string[] = ['true', 'false'];
  userProfiles: any[] = [];
  allCompanyEmployees: any[] = [];
  newUserSelected: string;
  isReadOnly: boolean = false;
  createMode: boolean = false;
  ppImage: string;
  ppInputWidth: number = 300;
  employeeWidth: number = 600;
  writeWidth: number = 800;
  rate: number = 0;
  isUserAdmin: boolean = false;

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
  ) {
    auth.isLoggedIn().then(res => {
      !res ? this.router.navigateByUrl("/login"): afterLogin()
    }).catch(reason => {console.log("login check failed. redirecting"); this.router.navigateByUrl("/login")})
    let afterLogin = () => {
      if (!this.router.url.startsWith('/past-performance-create')) {
        console.log('in past performance edit')
        this.pastPerformanceService.getPastPerformancebyID(this.route.snapshot.params['id']).toPromise().then(res => {
          this.currentPastPerformance = res;
          this.myCallback();
          this.myCallback2()
          this.getEditorAdminStatus()
        });

      } else {
        console.log("in past performance create")
        this.createMode = true;
        if (this.route.snapshot.queryParams["company"]) {
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
        "name": i.user.firstName + " " + i.user.lastName,
        "userId": i.user._id,
        "proxyId": i._id,
        "startDate": new Date(i.startDate).toDateString(),
        "endDate": new Date(i.endDate).toDateString(),
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

  getCreatorAdminStatus() {
    console.log("GETTING ADMIN STATUS")
    var userId = this.auth.getLoggedInUser()
    this.userService.getUserbyID(userId).toPromise().then((user) =>{
      var currentUserProxy = user.companyUserProxies.filter((proxy) => {
        return proxy.company._id == this.route.snapshot.queryParams["company"]
      })[0]
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

  getEditorAdminStatus() {
    var userId = this.auth.getLoggedInUser()
    //get user
    this.userService.getUserbyID(userId).toPromise().then((user) => {
      console.log(user.power)
      var superUser = false
      if (user.power) {
        if (user.power > 3) {
          this.isUserAdmin = true;
          superUser = true
        }
      }
      if (!superUser) {
        //get the company ids where the user is admin
        var relevantCompanyIds = user.companyUserProxies.filter(async (proxy) =>{
          let returnVal;
          await this.roleService.getRoleByID(proxy.role).toPromise().then(async (roleObj) => {
            await roleObj.title == "admin"? returnVal = true: returnVal = false;
          })
          return returnVal
        }).map((proxy) => proxy.company["_id"])
        console.log("Relevent companies", relevantCompanyIds)
        //then get the company ids associated with the past performance
        var ppCompanyIds = this.currentPastPerformance.companyProxies.map((cproxy) => cproxy.company["_id"])
        console.log("pp companies", ppCompanyIds)
        //finally check if the two sets have anything in common.
        for (const companyId of ppCompanyIds){
          if(relevantCompanyIds.includes(companyId)){
            this.isUserAdmin = true;
            console.log("I'm a pp admin")
          }
        }
      }
    })
  }


  uploadPhoto() {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      let formData = new FormData();
      let file = fileBrowser.files[0]
      console.log(file)
      formData.append("bucket", environment.bucketName);
      formData.append("key", "pastPerformancePhotos/"+this.currentPastPerformance._id+"_0");
      formData.append("file", file);
      this.s3Service.postPhoto(formData).toPromise().then(result => {
        console.log("Photo upload success",result);
        this.currentPastPerformance.avatar = "http://s3.amazonaws.com/" + environment.bucketName + "/pastPerformancePhotos/"+this.currentPastPerformance._id+"_0"
        this.updatePP(this.currentPastPerformance, true);
      }).catch((reason) =>console.log("reason ", reason));
    }
  }

  editPhoto() {
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      if(!this.currentPastPerformance._id){return}
      const uid = this.currentPastPerformance._id;
      let formData = new FormData();
      let file = fileBrowser.files[0]
      let myArr = this.currentPastPerformance.avatar.split("_")
      let i: any = myArr[myArr.length - 1]
      i = parseInt(i);
      console.log(file)
      formData.append("bucket", environment.bucketName);
      formData.append("key", "pastPerformancePhotos/"+uid+"_"+(i+1).toString());
      formData.append("file", file);
      this.s3Service.postPhoto(formData).toPromise().then(result => {
        console.log("Photo upload success",result);
        this.currentPastPerformance.avatar = "http://s3.amazonaws.com/" + environment.bucketName + "/pastPerformancePhotos/"+uid+"_"+(i+1).toString()
        this.updatePP(this.currentPastPerformance, true);
        this.s3Service.deletePhoto("/pastPerformancePhotos/"+uid+"_"+(i).toString()).toPromise().then( res => console.log("Old photo deleted " + res))
      }).catch((reason) =>console.log("reason ", reason));
    }

  }


  updatePP(model, noNav?: boolean) {
    // require auth of a signed in user with admin priveleges to the company that this past performance will be associated with.
    if (!this.isUserAdmin){return;}

    // Mongo cannot update a model if _id field is present in the data provided for the update, so we delete it
    if ( !this.createMode ) {
    delete model['_id'];
    this.pastPerformanceService.updatePP(this.route.snapshot.params['id'], model).toPromise().then(result => {
      console.log(result);
      this.currentPastPerformance = result;
      if(!noNav) {
        window.scrollTo(0, 0);
        this.router.navigate(['past-performance', this.route.snapshot.params['id']]);
      }
    });

  } else {
    //creating a new PP
    console.log(model)
    this.pastPerformanceService.createPastPerformance(model).toPromise().then(result => {console.log(result)

      // a call to create a companyPastPerformanceProxy with the appropriate company and the newly created past performance's id
      let callback = () => {
        var request = {
          company: this.route.snapshot.queryParams["company"],
          pastPerformance: result['_id'],
          startDate: "01/01/2001",
          endDate: "01/02/2001",
          activeContract: true
        }
        this.companyPastPerformanceProxyService.addCompanyPPProxy(request).then((proxy) => {
          //Finally, redirect to the past performance
          window.scrollTo(0, 0);
          this.router.navigate(['past-performance', result['_id']]);
        })

      }
      // call addEmployee with the signed in user's id and the new pastperformance id.
      this.addFirstEmployee(this.auth.getLoggedInUser(), result['_id'], callback)
    });
  }
  }
  addEmployee(employeeId) {
    if(!this.isUserAdmin){return;}
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

  addFirstEmployee(employeeId, pastPerformanceId, callback) {
    let request = {
      "user": employeeId,
      "pastPerformance": pastPerformanceId,
      "startDate": "01/01/2001",
      "endDate": "01/02/2001",
      "stillAffiliated": true,
      "role": "programmer"
    }
    console.log(request)
    this.userPastPerformanceProxyService.addUserPPProxy(request).then(() => callback());
  }

  deleteEmployee(proxyId){
    if(!this.isUserAdmin){return;}
    this.userPastPerformanceProxyService.deleteUserPPProxy(proxyId).then(() => {
      this.pastPerformanceService.getPastPerformancebyID(this.route.snapshot.params['id']).toPromise().then(res => {this.currentPastPerformance = res; this.myCallback(); this.myCallback2() });
    })
  }

  updateEmployee(proxyId,key, value){
    if(!this.isUserAdmin){return;}
  let req = {};
  req[key] = value;
  this.userPastPerformanceProxyService.updateUserPPProxies(proxyId, req).toPromise().then(() =>
  {});
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
