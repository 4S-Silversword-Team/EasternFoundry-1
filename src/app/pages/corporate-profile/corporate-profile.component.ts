import { Component, OnInit, AfterViewInit } from '@angular/core';
import { User } from '../../classes/user';
import { Product } from '../../classes/product';
import { PastPerformance } from '../../classes/past-performance';
import { Company } from '../../classes/company';
import { Service } from '../../classes/service';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { UserService } from '../../services/user.service';
import { CompanyService } from '../../services/company.service';
import { ProductService } from '../../services/product.service';
import { ServiceService } from '../../services/service.service';
import { PastperformanceService } from '../../services/pastperformance.service';

declare var $: any;
declare var Swiper: any;

@Component({
  selector: 'app-corporate-profile',
  providers: [UserService, ProductService, ServiceService, PastperformanceService, CompanyService],
  templateUrl: './corporate-profile.component.html',
  styleUrls: ['./corporate-profile.component.css']
})
export class CorporateProfileComponent implements OnInit, AfterViewInit {
  currentAccount: Company = new Company();
  users: User[] = [];
  products: Product[] = [];
  services: Service[] = [];
  pastperformances: PastPerformance[] = [];
  currentPP = 0;
  CQAC: string[] = [];
  currentTab = true;
  promiseFinished: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
    private userService: UserService,
    private companyService: CompanyService,
    private productService: ProductService,
    private serviceService: ServiceService,
    private ppService: PastperformanceService
  ) {

    // this.currentAccount = this.companyService.getTestCompany()
    // Need to use companyservice.getCompanyByID
    let profileId: string;
    this.route.params.subscribe(routeParams => profileId = routeParams['id']);
    this.companyService.getCompanyByID(profileId).toPromise().then(company => { this.currentAccount = company[0]; myCallback(); });
    // this.companyService.getCompanyByID(this.route.params["id"] ).toPromise().then(company => this.currentAccount = company)
    const myCallback = () => {
      for (const i of this.currentAccount.leadership) {
        this.userService.getUserbyID(i.userid).toPromise().then(user => { this.users.push(user[0]); myCallback2();});
      }

    for (const i of this.currentAccount.product) {
      this.productService.getProductbyID(i.productid).toPromise().then(res => {this.products.push(res[0])});
    }

    for (const i of this.currentAccount.service) {
      this.services.push(serviceService.getServicebyID(i.serviceid));
    }

    for (const i of this.currentAccount.pastperformance) {
      // this.pastperformances.push(ppService.getPastPerformancebyID(i.pastperformanceid))
      this.ppService.getPastPerformancebyID(i.pastperformanceid).toPromise().then(res => {this.pastperformances.push(res[0])}); // Might try to continue the for loop before the promise resolves.
      // let myCallback = () => {console.log(this.pastperformances);}
    }
    const myCallback2 = () => {
      for (const i of this.users) {
        for (const j of i.certificate) {
          this.CQAC.push('Degree: ' + j.degree + ', DateEarned: ' + j.dateEarned);
        }
        for (const j of i.award) {
          this.CQAC.push('Awarded: ' + j);
        }
        for (const j of i.clearance) {
          this.CQAC.push('Type: ' + j.type + ', Awarded: ' + j.awarded + ', Expriation: ' + j.expiration);
        }
      }
    };
  };
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if ($('.swiper-container').width() > 450) {
      const swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 3,
        paginationClickable: true,
        spaceBetween: 30,
        freeMode: true
      });
    } else if ($('.swiper-container').width() > 400) {
      const swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 2,
        paginationClickable: true,
        spaceBetween: 30,
        freeMode: true
      });
    } else {
      const swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        slidesPerView: 1,
        paginationClickable: true,
        spaceBetween: 30,
        freeMode: true
      });
    }
  }

  showService() {
    this.currentTab = false;
  }

  showProduct() {
    this.currentTab = true;
  }

  getServiceChartValue(id: string): number[] {
    const temp: number[] = [];
    for (const i of this.services) {
      if (i.id === id) {
        for (const j of i.feature) {
          temp.push(j.score);
        }
      }
    }
    return temp;
  }

  getServiceChartColor(score: number): string {
    let temp: string;
    let color: number = score / 100 * 155;
    color = Math.floor(color);
    temp = 'rgb(' + color.toString() + ',' + color.toString() + ',' + color.toString() + ')';
    return temp;
  }

  getProductChartData(id: string): number[] {
    const temp: number[] = [];
    for (const i of this.products) {
      if (i.id === id) {
        for (const j of i.feature) {
          temp.push(j.score);
        }
      }
    }
    return temp;
  }

  getProductChartLabel(id: string): string[] {
    const temp: string[] = [];
    for (const i of this.products) {
      if (i.id === id) {
        for (const j of i.feature) {
          temp.push(j.name);
        }
      }
    }
    return temp;
  }

  toUserProfile(id: string) {
    this.router.navigate(['user-profile', id]);
  }

  toPastPerformance(id: string) {
    this.router.navigate(['past-performance', id]);
  }

  editCompany() {
    this.router.navigate(['corporate-profile-edit', this.currentAccount['_id']]);
  }

}
