import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Company } from '../../classes/company';
import { User } from '../../classes/user';
import { PastPerformance } from '../../classes/past-performance';
import { Agency } from '../../classes/agency';

import { CompanyService } from '../../services/company.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { PastperformanceService } from '../../services/pastperformance.service';
import { CompanyUserProxyService } from '../../services/companyuserproxy.service';
import { AgencyService } from '../../services/agency.service';
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
  promiseFinished: boolean = false;
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
    clearance: '',
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
  searchRunning = false;
  noResults = false;
  analyticsString = '';

  constructor(
    private router: Router,
    private companyService: CompanyService,
    private auth: AuthService,
    private userService: UserService,
    private pastPerformanceService: PastperformanceService,
    private companyUserProxyService: CompanyUserProxyService,
    private agencyService: AgencyService,
    angulartics2: Angulartics2,
    private titleService: Title,

  ) {
    this.titleService.setTitle("Search - Federal Foundry Forge")

    this.companyService.getCompanies().then(val => {
     this.companies = val;
     this.userService.getUsers().then(u => {
       this.users = u;
       this.pastPerformanceService.getPastPerformances().then(pp => {
         this.pastPerformances = pp;
         this.agencyService.getAgencies().then(a => {
           this.agencies = a;
           this.promiseFinished = true;
         });
       });
     });
   });


  }

  ngOnInit() {
  }

  expandResult(i){
    i.expand = !i.expand;
  }

  autocompleListFormatter (data: any) {
    return data.agency;
  }

  subagencyListFormatter (data: any) {
    console.log(JSON.stringify(data));
    return data.agency;
  }

  updateAnalyticsString(){
    this.analyticsString = 'SEARCH: ';
    let firstSlash = false;
    if (this.searchTerms.company){
      this.analyticsString += 'Company';
      firstSlash = true;
    }
    if (this.searchTerms.person){
      if (firstSlash) {
        this.analyticsString += '/';
      } else {
        firstSlash = true;
      }
      this.analyticsString += 'Person';
    }
    if (this.searchTerms.pastPerformance){
      if (firstSlash) {
        this.analyticsString += '/';
      }
      this.analyticsString += 'Performance';
    }
    this.analyticsString += ' - ';
    let firstComma = false;
    if (this.searchTerms.name) {
      this.analyticsString += this.searchTerms.name;
      firstComma = true;
    }
    if (this.searchTerms.agency) {
      if (firstComma) {
        this.analyticsString += ', ';
      } else {
        firstComma = true;
      }
      this.analyticsString += this.searchTerms.agency;
    }
    if (this.searchTerms.subagency) {
      if (firstComma) {
        this.analyticsString += ', ';
      } else {
        firstComma = true;
      }
      this.analyticsString += this.searchTerms.subagency;

    }
    if (this.searchTerms.skill) {
      if (firstComma) {
        this.analyticsString += ', ';
      } else {
        firstComma = true;
      }
      this.analyticsString += this.searchTerms.skill;

    }
    if (this.searchTerms.position) {
      if (firstComma) {
        this.analyticsString += ', ';
      } else {
        firstComma = true;
      }
      this.analyticsString += this.searchTerms.position;

    }
    if (this.searchTerms.cert) {
      if (firstComma) {
        this.analyticsString += ', ';
      } else {
        firstComma = true;
      }
      this.analyticsString += this.searchTerms.cert;

    }

  }

  agencyValidCheck (agency) {
    let match = false;
    for (const a of this.agencies) {
      if (a.agency.toString().toLowerCase() === agency.toString().toLowerCase()){
        match = true;
      }
    }
    return match;
  }

  searchReady(){
    if (this.searchTerms.company || this.searchTerms.person || this.searchTerms.pastPerformance) {
      if (this.searchTerms.name || this.searchTerms.agency || this.searchTerms.skill || this.searchTerms.position || this.searchTerms.cert || this.searchTerms.clearance) {
        return true;
      }
    }
    return false;
  }

  clearSubagency() {
    this.searchTerms.subagency = '';
  }

  findSubAgencies(agency) {
    let subagencies = ['No Subagencies Found'];
    for (const a of this.agencies){
      if (a.agency.toString().toLowerCase() == agency.toString().toLowerCase()){
        subagencies = a.subagencies;
      }
    }
    return subagencies;
  }

  subagencyValidCheck (agency, subagency) {
    let match = false;
    const subagencies = this.findSubAgencies(agency);
    for (const i of subagencies) {
      if (i.toString().toLowerCase() == subagency.toString().toLowerCase()){
        match = true;
      }
    }
    return match;
  }

  search(){
    this.searchRunning = true;
    this.noResults = false;
    this.searchResults.companies = [];
    this.searchResults.people = [];
    this.searchResults.pastPerformances = [];
    this.searchResults.privateCompanies = 0;
    this.searchResults.privatePeople = 0;
    this.searchResults.privatePP = 0;

    if (this.searchTerms.company){
      for (const company of this.companies) {
        const newCompany: any = company;
        newCompany.relevantAgencies = [];
        newCompany.relevantSubagencies = [];
        newCompany.relevantSkills = [];
        newCompany.relevantPositions = [];
        newCompany.relevantCerts = [];
        newCompany.relevantClearances = [];
        newCompany.nameMatch = false;
        let matchFound = false;
        if (this.searchTerms.name){
          if (newCompany.name.toLowerCase().indexOf(this.searchTerms.name.toLowerCase()) >= 0) {
            newCompany.nameMatch = true;
            matchFound = true;
          }
        }
        if (this.searchTerms.agency) {
          for (const p of newCompany.userProfileProxies) {
            const agenciesDone = [];
            if (p.userProfile){
              for (const j of p.userProfile.positionHistory) {
                for (const a of j.agencyExperience) {
                  if (a.main.title.toLowerCase().indexOf(this.searchTerms.agency.toLowerCase()) >= 0) {
                    if (!this.searchTerms.subagency) {
                      matchFound = true;
                    }
                    let agencyFound = false;
                    if (agenciesDone.indexOf(a.main.title) < 0){
                      for (const ra of newCompany.relevantAgencies) {
                        if (ra.name.toLowerCase() == a.main.title.toLowerCase()){
                          agencyFound = true;
                          ra.count++;
                          agenciesDone.push(a.main.title);
                        }
                      }
                      if (!agencyFound) {
                        newCompany.relevantAgencies.push({
                          name: a.main.title,
                          count: 1,
                        });
                        agenciesDone.push(a.main.title);
                      }
                    }
                  }
                }
              }
            }
          }
          if (this.searchTerms.subagency) {
            for (const p of newCompany.userProfileProxies) {
              const subagenciesDone = [];
              if (p.userProfile){
                for (const j of p.userProfile.positionHistory) {
                  for (const a of j.agencyExperience) {
                    if (a.offices[0]) {
                      if (a.offices[0].title.length > 0) {
                        for (const s of a.offices) {
                          if (s.title.toLowerCase().indexOf(this.searchTerms.subagency.toLowerCase()) >= 0) {
                            matchFound = true;
                            let agencyFound = false;
                            if (subagenciesDone.indexOf(s.title) >= 0){
                              for (const rs of newCompany.relevantSubagencies) {
                                if (rs.name.toLowerCase() == s.title.toLowerCase()){
                                  agencyFound = true;
                                  rs.count++;
                                  subagenciesDone.push(s.title);
                                }
                              }
                              if (!agencyFound) {
                                newCompany.relevantSubagencies.push({
                                  name: s.title,
                                  count: 1,
                                });
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
          for (const p of newCompany.userProfileProxies) {
            const skillsDone = [];
            if (p.userProfile){
              if (p.userProfile.foundTools) {
                const newPerson = p.userProfile;
                for (const t of newPerson.foundTools) {
                  if (t.title.toLowerCase().indexOf(this.searchTerms.skill.toLowerCase()) >= 0) {
                    matchFound = true;
                    let skillFound = false;
                    if (skillsDone.indexOf(t.title) < 0){
                      for (const s of newCompany.relevantSkills) {
                        if (s.name.toLowerCase() == t.title.toLowerCase()){
                          skillFound = true;
                          s.count++;
                          skillsDone.push(s.title);
                        }
                      }
                      if (!skillFound) {
                        newCompany.relevantSkills.push({
                          name: t.title,
                          count: 1,
                        });
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
          const toolsToPush = [];
          for (const p of newCompany.userProfileProxies) {
            if (p.userProfile) {
              if (p.userProfile.foundTools) {
                for (const tool of p.userProfile.foundTools) {
                  let matchFound = false;
                  for (const position of tool.position) {
                    for (const toolDone of toolsToPush) {
                      if (position == toolDone.title) {
                        toolDone.score += 5;
                        matchFound = true;
                      }
                    }
                    if (!matchFound) {
                      const newPosition = {
                        title: '',
                        score: 0
                      };
                      newPosition.title = position;
                      newPosition.score = 5;
                      toolsToPush.push(newPosition);
                    }
                  }
                }
                for (const tool of toolsToPush) {
                  const toolsDone = [];
                  if (tool.title.toLowerCase().indexOf(this.searchTerms.position.toLowerCase()) >= 0) {
                    for (const o of p.userProfile.occupations) {
                      if (tool.title == o.title) {
                        tool.score += (o.score / 5);
                      }
                    }
                    if (tool.score > 50) {
                      let agencyFound = false;
                      if (toolsDone.indexOf(tool.title) < 0){
                        for (const rp of newCompany.relevantPositions) {
                          if (rp.name.toLowerCase() === tool.title.toLowerCase()){
                            agencyFound = true;
                            rp.count++;
                            toolsDone.push(tool.title);
                          }
                        }
                        if (!agencyFound) {
                          newCompany.relevantPositions.push({
                            name: tool.title,
                            count: 1,
                          });
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
          const certsToPush = [];
          for (const p of newCompany.userProfileProxies) {
            if (p.userProfile) {
              if (p.userProfile.certification) {
                for (const cert of p.userProfile.certification) {
                  let matchFound = false;
                  for (const certDone of certsToPush) {
                    if (cert.CertificationName === certDone) {
                      matchFound = true;
                    }
                  }
                  if (!matchFound) {
                    certsToPush.push(cert.CertificationName);
                  }
                }
                for (const cert of certsToPush) {
                  const certsDone = [];
                  if (cert.toLowerCase().indexOf(this.searchTerms.cert.toLowerCase()) >= 0) {
                    let certFound = false;
                    if (certsDone.indexOf(cert) < 0){
                      for (const c of newCompany.relevantCerts) {
                        if (c.name.toLowerCase() === cert.toLowerCase()){
                          certFound = true;
                          c.count++;
                          certsDone.push(cert);
                        }
                      }
                      if (!certFound) {
                        newCompany.relevantCerts.push({
                          name: cert,
                          count: 1
                        });
                        certsDone.push(cert);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (this.searchTerms.clearance) {
          const clearanceToPush = [];
          for (const p of newCompany.userProfileProxies) {
            if (p.userProfile) {
              if (p.userProfile.clearance) {
                for (const clearance of p.userProfile.clearance) {
                  let matchFound = false;
                  for (const clearDone of clearanceToPush) {
                    if (clearance.clearanceType === clearDone) {
                      matchFound = true;
                    }
                  }
                  if (!matchFound) {
                    clearanceToPush.push(clearance.clearanceType);
                  }
                }
                for (const clearance of clearanceToPush) {
                  const clearDone = [];
                  if (clearance.toLowerCase().indexOf(this.searchTerms.clearance.toLowerCase()) >= 0) {
                    let certFound = false;
                    if (clearDone.indexOf(clearance) < 0){
                      for (const c of newCompany.relevantClearances) {
                        if (c.name.toLowerCase() === clearance.toLowerCase()){
                          certFound = true;
                          c.count++;
                          clearDone.push(clearance);
                        }
                      }
                      if (!certFound) {
                        newCompany.relevantClearances.push({
                          name: clearance,
                          count: 1
                        });
                        clearDone.push(clearance);
                      }
                    }
                  }
                }
              }
            }
          }
        }
        if (matchFound){
          let resultValid = true;

          if (this.searchTerms.name && !newCompany.nameMatch) {
            resultValid = false;
          }
          if (this.searchTerms.agency && newCompany.relevantAgencies.length < 1) {
            resultValid = false;
          }
          if (this.searchTerms.subagency && newCompany.relevantSubagencies.length < 1) {
            resultValid = false;
          }
          if (this.searchTerms.skill && newCompany.relevantSkills.length < 1) {
            resultValid = false;
          }
          if (this.searchTerms.position && newCompany.relevantPositions.length < 1) {
            resultValid = false;
          }
          if (this.searchTerms.cert && newCompany.relevantCerts.length < 1) {
            resultValid = false;
          }
          if (this.searchTerms.clearance && newCompany.relevantClearances.length < 1) {
            resultValid = false;
          }
          if (resultValid){
            if (newCompany.public) {
              newCompany.expand = false;
              this.searchResults.companies.push(newCompany);
            } else {
              this.searchResults.privateCompanies++;
            }
          }
        }
      }
    }
    if (this.searchTerms.person) {
      for (const person of this.users) {
        const newPerson: any = person;
        const subPromises = [];
        let matchFound = false;
        newPerson.relevantAgencies = [];
        newPerson.relevantSubagencies = [];
        newPerson.relevantSkills = [];
        newPerson.relevantPositions = [];
        newPerson.relevantCerts = [];
        newPerson.relevantClearances = [];
        if (this.searchTerms.agency) {
          for (const j of newPerson.positionHistory){
            for (const a of j.agencyExperience) {
              if (a.main.title.toLowerCase().indexOf(this.searchTerms.agency.toLowerCase()) >= 0) {
                if (!this.searchTerms.subagency) {
                  matchFound = true;
                }
                newPerson.relevantAgencies.push(a.main.title);
              }
            }
          }
        }
        if (this.searchTerms.subagency) {
          const subagenciesDone = [];
          for (const j of newPerson.positionHistory){
            for (const a of j.agencyExperience) {
              for (const s of a.offices) {
                if (s.title.toLowerCase().indexOf(this.searchTerms.subagency.toLowerCase()) >= 0) {
                  matchFound = true;
                  let agencyFound = false;
                  if (subagenciesDone.indexOf(s.title) < 0){
                    for (const rs of newPerson.relevantSubagencies) {
                      if (rs.toLowerCase() == s.title.toLowerCase()){
                        agencyFound = true;
                        subagenciesDone.push(s.title);
                      }
                    }
                    if (!agencyFound) {
                      newPerson.relevantSubagencies.push(s.title);
                      subagenciesDone.push(s.title);
                    }
                  }
                }
              }
              if (a.main.title.toLowerCase().indexOf(this.searchTerms.agency.toLowerCase()) >= 0) {
                matchFound = true;
                newPerson.relevantAgencies.push(a.main.title);
              }
            }
          }
        }
        if (this.searchTerms.skill) {
          if (newPerson.foundTools){
            for (const t of newPerson.foundTools) {
              if (t.title.toLowerCase().indexOf(this.searchTerms.skill.toLowerCase()) >= 0) {
                matchFound = true;
                newPerson.relevantSkills.push(t.title);
              }
            }
          }
        }
        if (this.searchTerms.position) {
          const toolsToPush = [];
          for (const tool of newPerson.foundTools) {
            let posFound = false;
            for (const position of tool.position) {
              for (const toolDone of toolsToPush) {
                if (position == toolDone.title) {
                  toolDone.score += 5;
                  posFound = true;
                }
              }
              if (!posFound) {
                const newPosition = {
                  title: '',
                  score: 0
                };
                newPosition.title = position;
                newPosition.score = 5;
                toolsToPush.push(newPosition);
              }
            }
          }
          if (toolsToPush.length < 2) {
            for (const o of person.occupations) {
              const newOccupation = {
                title: '',
                score: 0
              };
              newOccupation.title = o.title;
              newOccupation.score = o.score;
              if (newOccupation.title.toLowerCase().indexOf(this.searchTerms.position.toLowerCase()) >= 0) {
                newPerson.relevantPositions.push(newOccupation);
              }
            }
          } else {
            for (const tool of toolsToPush) {
              for (const o of person.occupations) {
                if (tool.title == o.title) {
                  tool.score += (o.score / 5);
                }
              }
              if (tool.score > 50) {
                if (tool.title.toLowerCase().indexOf(this.searchTerms.position.toLowerCase()) >= 0) {
                  newPerson.relevantPositions.push(tool);
                }
              }
            }
          }
        }
        if (this.searchTerms.cert) {
          if (newPerson.certification) {
            for (const cert of newPerson.certification) {
              if (cert.CertificationName) {
                if (cert.CertificationName.toLowerCase().indexOf(this.searchTerms.cert.toLowerCase()) >= 0) {
                  if (newPerson.relevantCerts.indexOf(cert.CertificationName) < 0){
                    matchFound = true;
                    newPerson.relevantCerts.push(cert.CertificationName);
                  }
                }
              }
            }
          }
        }
        if (this.searchTerms.clearance) {
          if (newPerson.clearance) {
            for (const clearance of newPerson.clearance) {
              if (clearance.clearanceType.toLowerCase().indexOf(this.searchTerms.clearance.toLowerCase()) >= 0) {
                if (newPerson.relevantClearances.indexOf(clearance.clearanceType) < 0){
                  matchFound = true;
                  newPerson.relevantClearances.push(clearance.clearanceType);
                }
              }
            }
          }
        }
        for (const c of newPerson.companyUserProxies) {
          if (c.stillAffiliated) {
            if (c.company) {
              if (c.company.name) {
                newPerson.currentCompany = c.company.name;
              }
            }
          }
        }
        if (matchFound) {
          let resultValid = true;

          if (this.searchTerms.agency && newPerson.relevantAgencies.length < 1) {
            resultValid = false;
          }
          if (this.searchTerms.subagency && newPerson.relevantSubagencies.length < 1) {
            resultValid = false;
          }
          if (this.searchTerms.skill && newPerson.relevantSkills.length < 1) {
            resultValid = false;
          }
          if (this.searchTerms.position && newPerson.relevantPositions.length < 1) {
            resultValid = false;
          }
          if (this.searchTerms.cert && newPerson.relevantCerts.length < 1) {
            resultValid = false;
          }
          if (this.searchTerms.clearance && newPerson.relevantClearances.length < 1) {
            resultValid = false;
          }
          if (this.searchTerms.freelancer && newPerson.currentCompany) {
            resultValid = false;
          }
          console.log(resultValid)
          if (resultValid){
            if (person.public) {
              newPerson.expand = false;
              this.searchResults.people.push(newPerson);
            } else {
              this.searchResults.privatePeople++;
            }
          }
        }
      }
    }
    if (this.searchTerms.pastPerformance) {
      for (const pp of this.pastPerformances) {
        const newPP: any = pp;
        newPP.nameMatch = false;
        const subPromises = [];
        let matchFound = false;
        if (this.searchTerms.name) {
          if (newPP.title) {
            if (newPP.title.toLowerCase().indexOf(this.searchTerms.name.toLowerCase()) >= 0) {
              matchFound = true;
              newPP.nameMatch = true;
            }
          }
        }
        if (matchFound) {
          let resultValid = true;
          if (this.searchTerms.name.length > 0 && !newPP.nameMatch) {
            resultValid = false;
          }

          if (resultValid) {
            if (newPP.public) {
              newPP.expand = false;
              this.searchResults.pastPerformances.push(newPP);
            } else {
              this.searchResults.privatePP++;
            }
          }
        }
      }
    }
    if (this.searchResults.companies.length < 1 && this.searchResults.people.length < 1 && this.searchResults.pastPerformances.length < 1 && this.searchResults.privatePeople < 1 ) {
      this.noResults = true;
    }
    if (this.searchResults.companies.length < 1 && this.searchResults.pastPerformances.length < 1) {
      if (this.searchTerms.freelancer) {
        this.noResults = true;
        for (const p of this.searchResults.people) {
          if (!p.currentCompany) {
            this.noResults = false;
          }
        }
      }
    }
    console.log(this.analyticsString)
    console.log(this.searchResults.people.length)
    this.searchRunning = false;
  }

}
