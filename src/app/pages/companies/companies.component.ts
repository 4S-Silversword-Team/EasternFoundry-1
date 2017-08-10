import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Company } from '../../classes/company';

import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css'],
  providers: [CompanyService]
})
export class CompaniesComponent implements OnInit {

  companies: Company[] = [];

  constructor(
    private router: Router,
    private companyService: CompanyService
  ) {
    this.companyService.getCompanies().then(val => this.companies = val );

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
