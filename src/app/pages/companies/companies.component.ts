import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Company } from '../../classes/company';

import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service'
import { UserService } from '../../services/user.service'


@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
  providers: [CompanyService, AuthService, UserService]
})
export class CompaniesComponent implements OnInit {

  companies: Company[] = [];

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private auth: AuthService,
    private userService: UserService

  ) {
    if (this.router.url !== '/my-companies'){
      this.companyService.getCompanies().then(val => this.companies = val );
    } else {
      this.userService.getUserbyID(this.auth.getLoggedInUser()).toPromise().then((val) => {
        this.companies = val.companyUserProxies.map(proxy => proxy.company)
      })
    }


  }

  ngOnInit() {
  }

  goTo(id: string) {
    window.scrollTo(0, 0);
    this.router.navigate(['corporate-profile', id]);
  }

  newCompany() {
    window.scrollTo(0, 0);
    this.router.navigate(['corporate-profile-create']);
  }

}
