import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Company } from '../../classes/company';
import { User } from '../../classes/user';
import { PastPerformance } from '../../classes/past-performance';

import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service'
import { UserService } from '../../services/user.service'
import { PastperformanceService } from '../../services/pastperformance.service'
import { CompanyUserProxyService } from '../../services/companyuserproxy.service'


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [CompanyService, AuthService, UserService, PastperformanceService, CompanyUserProxyService]
})
export class SearchComponent implements OnInit {

  companies: Company[] = [];
  users: User[] = [];
  pastPerformances: PastPerformance[] = [];
  promiseFinished: boolean = false
  searchTerms = {
    company: false,
    person: false,
    pastPerformance: false,
    name: '',
    agency: '',
    skill: '',
    position: ''
  };
  searchResults = {
    companies: [],
    people: [],
    pastPerformances: []
  };
  searchRunning = false
  noResults = false

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private auth: AuthService,
    private userService: UserService,
    private pastPerformanceService: PastperformanceService,
    private companyUserProxyService: CompanyUserProxyService


  ) {
    this.companyService.getCompanies().then(val =>{
     this.companies = val
     this.userService.getUsers().then(u =>{
       this.users = u
       this.pastPerformanceService.getPastPerformances().then(pp =>{
         this.pastPerformances = pp
         this.promiseFinished = true
       })
     })
   });


  }

  ngOnInit() {
  }

  searchReady(){
    if (this.searchTerms.company || this.searchTerms.person || this.searchTerms.pastPerformance) {
      if (this.searchTerms.name || this.searchTerms.agency || this.searchTerms.skill || this.searchTerms.position) {
        return true
      }
    }
    return false
  }

  search(){
    this.searchRunning = true
    this.noResults = false
    this.searchResults.companies = []
    this.searchResults.people = []
    this.searchResults.pastPerformances = []

    if (this.searchTerms.company){
      console.log
      for (let company of this.companies) {
        if (company.name.toLowerCase().includes(this.searchTerms.name.toLowerCase())) {
          this.searchResults.companies.push(company)
        }
      }
      this.searchRunning = false
    }
    if (this.searchTerms.person) {
      for (let person of this.users) {
        var newPerson: any = person
        var subPromises = []
        var matchFound = false
        newPerson.relevantAgencies = []
        newPerson.relevantSkills = []
        newPerson.relevantPositions = []
        if (this.searchTerms.agency) {
          for (let j of newPerson.positionHistory){
            for (let a of j.agencyExperience) {
              if (a.main.title.toLowerCase().includes(this.searchTerms.agency.toLowerCase())) {
                matchFound = true
                newPerson.relevantAgencies.push(a.main.title)
              }
            }
          }
        }
        if (this.searchTerms.skill) {
          if (newPerson.foundTools){

            for (let t of newPerson.foundTools) {
              if (t.title.toLowerCase().includes(this.searchTerms.skill.toLowerCase())) {
                matchFound = true
                newPerson.relevantSkills.push(t.title)
              }
            }
          }
        }
        if (this.searchTerms.position) {
          var toolsToPush = []
          for (let tool of newPerson.foundTools) {
            var matchFound = false
            for (let position of tool.position) {
              for (let toolDone of toolsToPush) {
                if (position == toolDone.title) {
                  toolDone.score += 5
                  matchFound = true
                }
              }
              if (!matchFound) {
                var newPosition = {
                  title: '',
                  score: 0
                }
                newPosition.title = position
                newPosition.score = 5
                toolsToPush.push(newPosition)
              }
            }
          }
          if (toolsToPush.length < 2) {
            for (let o of person.occupations) {
              var newOccupation = {
                title: '',
                score: 0
              }
              newOccupation.title = o.title
              newOccupation.score = o.score
              if (newOccupation.title.toLowerCase().includes(this.searchTerms.position.toLowerCase())) {
                newPerson.relevantPositions.push(newOccupation)
              }
            }
          } else {
            for (let tool of toolsToPush) {
              for (let o of person.occupations) {
                if (tool.title == o.title) {
                  tool.score += (o.score / 5)
                }
              }
              if (tool.score > 50) {
                if (tool.title.toLowerCase().includes(this.searchTerms.position.toLowerCase())) {
                  newPerson.relevantPositions.push(tool)
                }
              }
            }
          }
        }
        if (matchFound){
          // if (this.searchTerms.agency && this.searchTerms.skill && this.searchTerms.position) {
          //   if (newPerson.relevantAgencies.length > 0 && newPerson.relevantSkills.length > 0 && newPerson.relevantPositions.length > 0) {
          //     this.searchResults.people.push(newPerson)
          //   }
          // }
          if (this.searchTerms.agency && this.searchTerms.skill && this.searchTerms.position) {
            if (newPerson.relevantAgencies.length > 0 && newPerson.relevantSkills.length > 0 && newPerson.relevantPositions.length > 0) {
              this.searchResults.people.push(newPerson)
            }
          } else if (this.searchTerms.agency && this.searchTerms.skill && !this.searchTerms.position) {
            if (newPerson.relevantAgencies.length > 0 && newPerson.relevantSkills.length > 0) {
              this.searchResults.people.push(newPerson)
            }
          } else if (this.searchTerms.skill && this.searchTerms.position && !this.searchTerms.agency) {
            if (newPerson.relevantSkills.length > 0 && newPerson.relevantPositions.length > 0) {
              this.searchResults.people.push(newPerson)
            }
          } else if (this.searchTerms.position && this.searchTerms.agency && !this.searchTerms.skill) {
            if (newPerson.relevantPositions.length > 0 && newPerson.relevantAgencies.length > 0) {
              this.searchResults.people.push(newPerson)
            }
          } else if (this.searchTerms.agency && !this.searchTerms.skill && !this.searchTerms.position) {
            if (newPerson.relevantAgencies.length > 0) {
              this.searchResults.people.push(newPerson)
            }
          } else if (this.searchTerms.skill && !this.searchTerms.position && !this.searchTerms.agency) {
            if (newPerson.relevantSkills.length > 0) {
              this.searchResults.people.push(newPerson)
            }
          } else if (this.searchTerms.position && !this.searchTerms.agency && !this.searchTerms.skill) {
            if (newPerson.relevantPositions.length > 0) {
              this.searchResults.people.push(newPerson)
            }
          }
        }
        for (let p of this.searchResults.people) {
          for (let c of p.companyUserProxies) {
            var subPromise = this.companyUserProxyService.getCompanyUserProxiesByID(c).toPromise().then(proxy => {
              if (proxy) {
                if (proxy.stillAffiliated) {
                  if (proxy.company) {
                    var companyProxy: any = proxy.company
                    if (companyProxy.name) {
                      p.currentCompany = companyProxy.name
                    }
                  }
                }
              }
            });
            subPromises.push(subPromise)
          }
        }
        Promise.all(subPromises).then(values => {
          if (this.searchResults.companies.length < 1 && this.searchResults.people.length < 1 && this.searchResults.pastPerformances.length < 1) {
            this.noResults = true
          }
          this.searchRunning = false
        })
      }
    }
  }

  goTo(which: string, id: string) {
    window.scrollTo(0, 0);
    if (which == 'company'){
      this.router.navigate(['corporate-profile', id]);
    } else if (which == 'person'){
      this.router.navigate(['user-profile', id]);
    } else if (which == 'pastPerformance'){
      this.router.navigate(['past-performance', id]);
    }
  }

  newCompany() {
    window.scrollTo(0, 0);
    this.router.navigate(['corporate-profile-create']);
  }

}
