import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Company } from '../../classes/company'
import { Product } from '../../classes/product'
import { Service } from '../../classes/service'
import { PastPerformance } from '../../classes/past-performance'

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { CompanyService } from  '../../services/company.service'
import { ProductService } from '../../services/product.service'
import { ServiceService } from '../../services/service.service'
import { PastperformanceService } from '../../services/pastperformance.service'

import { User } from '../../classes/user'
import { UserService } from '../../services/user.service'


declare var $: any;

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
  providers: [ UserService ]
})
export class ProfileEditComponent implements OnInit {

  currentUser: User = new User()
  expColors: string[] = ['rgb(0,178,255)', 'rgb(69,199,255)', 'rgb(138,220,255)', 'rgb(198,241,255)' ];
  strengthChartDatas: any[] = []
  strengthChartLabels: string[] = []
  availabilityData: any = {
    values: [],
    dates: []
  }


  // currentAccount: Company = new Company()
  // products: Product[] = []
  // services: Service[] = []
  // pastperformances: PastPerformance[] = []
  // infoInputWidth: number = 350;
  //
  // agencyType: string[] = ['Pro', 'Amature'];
  // officeType: string[] = ['Pro', 'Amature'];
  // clearedType: string[] = ['Pro', 'Amature'];
  // ppImage: string;
  // ppInputWidth: number = 300;
  //
  // writeWidth: number = 800;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location
  ) {
    // this.currentUser = this.userService.getUserbyID(this.route.snapshot.params['id'])



    if (this.router.url !== 'user-profile-create') {
      this.userService.getUserbyID(this.route.snapshot.params['id']).toPromise().then((result) => {
        this.currentUser = result[0]
      });
      //.subscribe(result => this.currentAccount =result).

    }
  }

  ngOnInit() {
  }

  addEmployee() {

  }

}
