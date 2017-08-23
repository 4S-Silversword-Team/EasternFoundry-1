import { Component, OnInit, AfterViewInit } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router'
import { Location } from '@angular/common'

import { PastPerformance } from '../../classes/past-performance'

import { PastperformanceService } from '../../services/pastperformance.service'
import { AuthService} from "../../services/auth.service"
import { UserService} from "../../services/user.service"
import { RoleService} from "../../services/role.service"

declare var $: any

@Component({
  selector: 'app-past-performance',
  templateUrl: './past-performance.component.html',
  providers: [PastperformanceService, AuthService, UserService, RoleService],
  styleUrls: ['./past-performance.component.css']
})
export class PastPerformanceComponent implements OnInit {

  currentPastPerformance: PastPerformance = new PastPerformance()
  isUserAdmin: boolean = false;

  public performanceTitle: string = ''
  public agencyType: string[] = ['Pro', 'Amature']
  public officeType: string[] = ['Pro', 'Amature']
  public clearedType: string[] = ['Pro', 'Amature']
  public ppImage: string
  public ppInputWidth: number = 300
  public employeeWidth: number = 600
  public writeWidth: number = 800
  public clientName: string = 'Air Force: 1st Fighter Wing'

  constructor(
    private pastPerformanceService: PastperformanceService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private auth: AuthService,
    private userService: UserService,
    private roleService: RoleService
  ) {
    this.currentPastPerformance.id = this.route.snapshot.params['id']
    //this.currentPastPerformance = this.pastPerformanceService.getPastPerformancebyID(this.currentPastPerformance.id)
    this.pastPerformanceService.getPastPerformancebyID(this.currentPastPerformance.id).toPromise().then(res => {
      this.currentPastPerformance = res ;
      this.auth.isLoggedIn().then((res) => this.getAdminStatus()).catch((reason => console.log("Login check failed.")))
    })

  }

  back() {
    this.location.back()
  }

  editPastPerformance() {
    this.router.navigate(['past-performance-edit', this.currentPastPerformance['_id']]);
  }

  getAdminStatus() {
    var userId = this.auth.getLoggedInUser()
    //get user
    this.userService.getUserbyID(userId).toPromise().then((user) => {
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
    })
  }


  ngOnInit() {
  }

}
