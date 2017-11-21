import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Company } from '../../classes/company';
import { User } from '../../classes/user';
import { PastPerformance } from '../../classes/past-performance';
import { Agency } from '../../classes/agency';

import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service'
import { UserService } from '../../services/user.service'
import { PastperformanceService } from '../../services/pastperformance.service'
import { CompanyUserProxyService } from '../../services/companyuserproxy.service'
import { AgencyService } from '../../services/agency.service'
import { Angulartics2 } from 'angulartics2';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [CompanyService, AuthService, UserService, PastperformanceService, CompanyUserProxyService, AgencyService]
})
export class SearchComponent implements OnInit {

  companies: Company[] = [];
  users: User[] = [];
  pastPerformances: PastPerformance[] = [];
  agencies: Agency[] = [];
  promiseFinished: boolean = false
  searchTerms = {
    company: false,
    person: false,
    pastPerformance: false,
    name: '',
    agency: '',
    subagency: '',
    skill: '',
    position: '',
    cert: '',
    freelancer: false
  };
  searchResults = {
    companies: [],
    people: [],
    pastPerformances: [],
    privateCompanies: 0,
    privatePeople: 0,
    privatePP: 0
  };
  searchRunning = false
  noResults = false
  analyticsString = ''

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private auth: AuthService,
    private userService: UserService,
    private pastPerformanceService: PastperformanceService,
    private companyUserProxyService: CompanyUserProxyService,
    private agencyService: AgencyService,
    angulartics2: Angulartics2

  ) {
    this.companyService.getCompanies().then(val =>{
     this.companies = val
     this.userService.getUsers().then(u =>{
       this.users = u
       this.pastPerformanceService.getPastPerformances().then(pp =>{
         this.pastPerformances = pp
         this.agencyService.getAgencies().then(a =>{
           this.agencies = a
           this.promiseFinished = true
         })
       })
     })
   });


  }

  ngOnInit() {
  }

  expandResult(i){
    i.expand = !i.expand
  }

  autocompleListFormatter (data: any) {
    return data.agency;
  }

  subagencyListFormatter (data: any) {
    console.log(JSON.stringify(data))
    return data.agency;
  }

  updateAnalyticsString(){
    this.analyticsString = 'SEARCH: '
    let firstSlash = false;
    if (this.searchTerms.company){
      this.analyticsString += 'Company'
      firstSlash = true;
    }
    if (this.searchTerms.person){
      if (firstSlash) {
        this.analyticsString += '/'
      } else {
        firstSlash = true
      }
      this.analyticsString += 'Person'
    }
    if (this.searchTerms.pastPerformance){
      if (firstSlash) {
        this.analyticsString += '/'
      }
      this.analyticsString += 'Performance'
    }
    this.analyticsString += ' - '
    let firstComma = false;
    if (this.searchTerms.name) {
      this.analyticsString += this.searchTerms.name
      firstComma = true
    }
    if (this.searchTerms.agency) {
      if (firstSlash) {
        this.analyticsString += ', '
      } else {
        firstComma = true
      }
      this.analyticsString += this.searchTerms.agency
    }
    if (this.searchTerms.subagency) {
      if (firstSlash) {
        this.analyticsString += ', '
      } else {
        firstComma = true
      }
      this.analyticsString += this.searchTerms.subagency

    }
    if (this.searchTerms.skill) {
      if (firstSlash) {
        this.analyticsString += ', '
      } else {
        firstComma = true
      }
      this.analyticsString += this.searchTerms.skill

    }
    if (this.searchTerms.position) {
      if (firstSlash) {
        this.analyticsString += ', '
      } else {
        firstComma = true
      }
      this.analyticsString += this.searchTerms.position

    }
    if (this.searchTerms.cert) {
      if (firstSlash) {
        this.analyticsString += ', '
      } else {
        firstComma = true
      }
      this.analyticsString += this.searchTerms.cert

    }

  }



  agencyValidCheck (agency) {
    var match = false
    for (let a of this.agencies) {
      if (a.agency.toString().toLowerCase() == agency.toString().toLowerCase()){
        match = true
      }
    }
    return match;
  }

  searchReady(){
    if (this.searchTerms.company || this.searchTerms.person || this.searchTerms.pastPerformance) {
      if (this.searchTerms.name || this.searchTerms.agency || this.searchTerms.skill || this.searchTerms.position || this.searchTerms.cert) {
        return true
      }
    }
    return false
  }

  clearSubagency() {
    this.searchTerms.subagency = ''
  }

  findSubAgencies(agency) {
    var subagencies = ['No Subagencies Found']
    for (let a of this.agencies){
      if (a.agency.toString().toLowerCase() == agency.toString().toLowerCase()){
        subagencies = a.subagencies
      }
    }
    return subagencies
  }

  subagencyValidCheck (agency, subagency) {
    var match = false
    var subagencies = this.findSubAgencies(agency)
    for (let i of subagencies) {
      if (i.toString().toLowerCase() == subagency.toString().toLowerCase()){
        match = true
      }
    }
    return match;
  }

  search(){
    this.searchRunning = true
    this.noResults = false
    this.searchResults.companies = []
    this.searchResults.people = []
    this.searchResults.pastPerformances = []
    this.searchResults.privateCompanies = 0
    this.searchResults.privatePeople = 0
    this.searchResults.privatePP = 0

    if (this.searchTerms.company){
      for (let company of this.companies) {
        var newCompany: any = company
        newCompany.relevantAgencies = []
        newCompany.relevantSubagencies = []
        newCompany.relevantSkills = []
        newCompany.relevantPositions = []
        newCompany.relevantCerts = []
        newCompany.nameMatch = false
        if (this.searchTerms.name){
          if (newCompany.name.toLowerCase().includes(this.searchTerms.name.toLowerCase())) {
            newCompany.nameMatch = true
            matchFound = true
          }
        }
        if (this.searchTerms.agency) {
          for (let p of newCompany.userProfileProxies) {
            var agenciesDone = []
            if (p.userProfile){
              for (let j of p.userProfile.positionHistory) {
                for (let a of j.agencyExperience) {
                  if (a.main.title.toLowerCase().includes(this.searchTerms.agency.toLowerCase())) {
                    if (!this.searchTerms.subagency) {
                      matchFound = true
                    }
                    var agencyFound = false
                    if (!agenciesDone.includes(a.main.title)){
                      for (let ra of newCompany.relevantAgencies) {
                        if (ra.name.toLowerCase() == a.main.title.toLowerCase()){
                          agencyFound = true
                          ra.count++
                          agenciesDone.push(a.main.title);
                        }
                      }
                      if (!agencyFound) {
                        newCompany.relevantAgencies.push({
                          name: a.main.title,
                          count: 1,
                        })
                        agenciesDone.push(a.main.title);
                      }
                    }
                  }
                }
              }
            }
          }
          if (this.searchTerms.subagency) {
            for (let p of newCompany.userProfileProxies) {
              var subagenciesDone = []
              if (p.userProfile){
                for (let j of p.userProfile.positionHistory) {
                  for (let a of j.agencyExperience) {
                    if (a.offices[0]) {
                      if (a.offices[0].title.length > 0) {
                        for (let s of a.offices) {
                          if (s.title.toLowerCase().includes(this.searchTerms.subagency.toLowerCase())) {
                            matchFound = true
                            var agencyFound = false
                            if (!subagenciesDone.includes(s.title)){
                              for (let rs of newCompany.relevantSubagencies) {
                                if (rs.name.toLowerCase() == s.title.toLowerCase()){
                                  agencyFound = true
                                  rs.count++
                                  subagenciesDone.push(s.title);
                                }
                              }
                              if (!agencyFound) {
                                newCompany.relevantSubagencies.push({
                                  name: s.title,
                                  count: 1,
                                })
                                subagenciesDone.push(s.title);
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (this.searchTerms.skill) {
          for (let p of newCompany.userProfileProxies) {
            var skillsDone = []
            if (p.userProfile){
              if (p.userProfile.foundTools) {
                var newPerson = p.userProfile
                for (let t of newPerson.foundTools) {
                  if (t.title.toLowerCase().includes(this.searchTerms.skill.toLowerCase())) {
                    matchFound = true
                    var skillFound = false
                    if (!skillsDone.includes(t.title)){
                      for (let s of newCompany.relevantSkills) {
                        if (s.name.toLowerCase() == t.title.toLowerCase()){
                          skillFound = true
                          s.count++
                          skillsDone.push(s.title);
                        }
                      }
                      if (!skillFound) {
                        newCompany.relevantSkills.push({
                          name: t.title,
                          count: 1,
                        })
                        skillsDone.push(t.title);
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (this.searchTerms.position) {
          var toolsToPush = []
          for (let p of newCompany.userProfileProxies) {
            if (p.userProfile) {
              if (p.userProfile.foundTools) {
                for (let tool of p.userProfile.foundTools) {
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
                for (let tool of toolsToPush) {
                  var toolsDone = []
                  if (tool.title.toLowerCase().includes(this.searchTerms.position.toLowerCase())) {
                    for (let o of p.userProfile.occupations) {
                      if (tool.title == o.title) {
                        tool.score += (o.score / 5)
                      }
                    }
                    if (tool.score > 50) {
                      var agencyFound = false
                      if (!toolsDone.includes(tool.title)){
                        for (let rp of newCompany.relevantPositions) {
                          if (rp.name.toLowerCase() == tool.title.toLowerCase()){
                            agencyFound = true
                            rp.count++
                            toolsDone.push(tool.title);
                          }
                        }
                        if (!agencyFound) {
                          newCompany.relevantPositions.push({
                            name: tool.title,
                            count: 1,
                          })
                          toolsDone.push(tool.title);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (this.searchTerms.cert) {
          var certsToPush = []
          for (let p of newCompany.userProfileProxies) {
            if (p.userProfile) {
              if (p.userProfile.certification) {
                for (let cert of p.userProfile.certification) {
                  var matchFound = false
                  for (let certDone of certsToPush) {
                    if (cert.CertificationName == certDone) {
                      matchFound = true
                    }
                  }
                  if (!matchFound) {
                    certsToPush.push(cert.CertificationName)
                  }
                }
                for (let cert of certsToPush) {
                  var certsDone = []
                  if (cert.toLowerCase().includes(this.searchTerms.cert.toLowerCase())) {
                    var certFound = false
                    if (!certsDone.includes(cert)){
                      for (let c of newCompany.relevantCerts) {
                        if (c.name.toLowerCase() == cert.toLowerCase()){
                          certFound = true
                          c.count++
                          certsDone.push(cert)
                        }
                      }
                      if (!certFound) {
                        newCompany.relevantCerts.push({
                          name: cert,
                          count: 1
                        })
                        certsDone.push(cert);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (matchFound){
          var resultValid = true

          if (this.searchTerms.name && !newCompany.nameMatch) {
            resultValid = false
          }
          if (this.searchTerms.agency && newCompany.relevantAgencies.length < 1) {
            resultValid = false
          }
          if (this.searchTerms.subagency && newCompany.relevantSubagencies.length < 1) {
            resultValid = false
          }
          if (this.searchTerms.skill && newCompany.relevantSkills.length < 1) {
            resultValid = false
          }
          if (this.searchTerms.position && newCompany.relevantPositions.length < 1) {
            resultValid = false
          }
          if (this.searchTerms.cert && newCompany.relevantCerts.length < 1) {
            resultValid = false
          }
          if (resultValid){
            if (newCompany.public) {
              newCompany.expand = false
              this.searchResults.companies.push(newCompany)
            } else {
              this.searchResults.privateCompanies++
            }
          }
        }
      }
    }
    if (this.searchTerms.person) {
      for (let person of this.users) {
        var newPerson: any = person
        var subPromises = []
        var matchFound = false
        newPerson.relevantAgencies = []
        newPerson.relevantSubagencies = []
        newPerson.relevantSkills = []
        newPerson.relevantPositions = []
        newPerson.relevantCerts = []
        if (this.searchTerms.agency) {
          for (let j of newPerson.positionHistory){
            for (let a of j.agencyExperience) {
              if (a.main.title.toLowerCase().includes(this.searchTerms.agency.toLowerCase())) {
                if (!this.searchTerms.subagency) {
                  matchFound = true
                }
                newPerson.relevantAgencies.push(a.main.title)
              }
            }
          }
        }
        if (this.searchTerms.subagency) {
          var subagenciesDone = []
          for (let j of newPerson.positionHistory){
            for (let a of j.agencyExperience) {
              for (let s of a.offices) {
                if (s.title.toLowerCase().includes(this.searchTerms.subagency.toLowerCase())) {
                  matchFound = true
                  var agencyFound = false
                  if (!subagenciesDone.includes(s.title)){
                    for (let rs of newPerson.relevantSubagencies) {
                      if (rs.toLowerCase() == s.title.toLowerCase()){
                        agencyFound = true
                        subagenciesDone.push(s.title);
                      }
                    }
                    if (!agencyFound) {
                      newPerson.relevantSubagencies.push(s.title)
                      subagenciesDone.push(s.title);
                    }
                  }
                }
              }
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
        if (this.searchTerms.cert) {
          if (newPerson.certification) {
            for (let cert of newPerson.certification) {
              var matchFound = false
              if (cert.CertificationName.toLowerCase().includes(this.searchTerms.cert.toLowerCase())) {
                if (!newPerson.relevantCerts.includes(cert.CertificationName)){
                  matchFound = true
                  newPerson.relevantCerts.push(cert.CertificationName)
                }
              }
            }
          }
        }
        for (let c of newPerson.companyUserProxies) {
          if (c.stillAffiliated) {
            if (c.company) {
              if (c.company.name) {
                newPerson.currentCompany = c.company.name
              }
            }
          }
        }
        if (matchFound){
          var resultValid = true

          if (this.searchTerms.agency && newPerson.relevantAgencies.length < 1) {
            resultValid = false
          }
          if (this.searchTerms.subagency && newPerson.relevantSubagencies.length < 1) {
            resultValid = false
          }
          if (this.searchTerms.skill && newPerson.relevantSkills.length < 1) {
            resultValid = false
          }
          if (this.searchTerms.position && newPerson.relevantPositions.length < 1) {
            resultValid = false
          }
          if (this.searchTerms.cert && newPerson.relevantCerts.length < 1) {
            resultValid = false
          }
          if (this.searchTerms.freelancer && newPerson.currentCompany) {
            resultValid = false
          }
          if (resultValid){
            if (person.public) {
              newPerson.expand = false
              this.searchResults.people.push(newPerson)
            } else {
              this.searchResults.privatePeople++
            }
          }
        }
      }
    }
    if (this.searchTerms.pastPerformance) {
      for (let pp of this.pastPerformances) {
        var newPP: any = pp
        newPP.nameMatch = false
        var subPromises = []
        var matchFound = false
        if (this.searchTerms.name) {
          if (newPP.title) {
            if (newPP.title.toLowerCase().includes(this.searchTerms.name.toLowerCase())) {
              matchFound = true
              newPP.nameMatch = true
            }
          }
        }
        if (matchFound) {
          var resultValid = true
          if (this.searchTerms.name.length > 0 && !newPP.nameMatch) {
            resultValid = false
          }

          if (resultValid) {
            if (newPP.public) {
              newPP.expand = false
              this.searchResults.pastPerformances.push(newPP)
            } else {
              this.searchResults.privatePP++
            }
          }
        }
      }
    }
    if (this.searchResults.companies.length < 1 && this.searchResults.people.length < 1 && this.searchResults.pastPerformances.length < 1 && this.searchResults.privatePeople < 1 ) {
      this.noResults = true
    }
    if (this.searchResults.companies.length < 1 && this.searchResults.pastPerformances.length < 1) {
      if (this.searchTerms.freelancer) {
        this.noResults = true
        for (let p of this.searchResults.people) {
          if (!p.currentCompany) {
            this.noResults = false
          }
        }
      }
    }
    this.searchRunning = false
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
