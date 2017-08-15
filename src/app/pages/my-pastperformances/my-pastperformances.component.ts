import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PastPerformance } from '../../classes/past-performance';

import { AuthService } from '../../services/auth.service'
import { UserService } from '../../services/user.service'


@Component({
  selector: 'app-my-pastperformances',
  templateUrl: './my-pastperformances.component.html',
  styleUrls: ['./my-pastperformances.component.css'],
  providers: [AuthService, UserService]
})
export class MyPastPerformancesComponent implements OnInit {

  pastperformances: PastPerformance[] = [];

  constructor(
    private router: Router,
    private auth: AuthService,
    private userService: UserService

  ) {
      this.userService.getUserbyID(this.auth.getLoggedInUser()).toPromise().then((val) => {
        this.pastperformances = val.pastPerformanceProxies.map(proxy => proxy.pastPerformance)
      })



  }

  ngOnInit() {
  }

  goTo(id: string) {
    window.scrollTo(0, 0);
    this.router.navigate(['past-performance', id]);
  }


}
