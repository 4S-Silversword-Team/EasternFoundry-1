import {Http} from '@angular/http';


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../classes/user';

import { UserService } from '../../services/user.service';
import { ToolService } from '../../services/tool.service';
import { AgencyService } from '../../services/agency.service';



@Component({
  selector: 'app-all-profiles',
  templateUrl: './all-profiles.component.html',
  styleUrls: ['./all-profiles.component.css'],
  providers: [UserService, ToolService, AgencyService]
})
export class AllProfilesComponent implements OnInit {

  users: User[] = [];
  toSort: any[] = [];
  sortedObjects: any[] = [];
  sortCounter: number = 0;
  uploadCounter: number = 0;

  govtNames: any[] = [];



  constructor(
    private router: Router,
    private userService: UserService,
    private toolService: ToolService,
    private agencyService: AgencyService,
    private http: Http,
  ) {
    // this.http.get('../../../assets/agencies.json')
    //   .map((res: any) => res.json())
    //   .subscribe(
    //     (data: any) => {
    //         this.toSort = data;
    //     },
    //     err => console.log(err), // error
    //     () => console.log(this.toSort[0]) // complete
    //   );
    //
    //   this.http.get('../../../assets/govtnames.json')
    //     .map((res: any) => res.json())
    //     .subscribe(
    //       (data: any) => {
    //           this.govtNames = data;
    //       },
    //       err => console.log(err), // error
    //       () => console.log(this.govtNames[0]) // complete
    //     );


    // this.toolService.getTools().then(val => this.sortedObjects = val );

    this.userService.getUsers().then(val => this.users = val );
  }



  ngOnInit() {
  }

  goTo(id: string) {
    this.router.navigate(['user-profile', id]);
  }

// // these are my dev tools to sort the 68000 tools into the format we need. do not use unless you know what you're doing

//SORT TOOLS VERSION 2.0: THIS MERGED ALL THE SUBAGENCIES INTO THE SAME AGENCY ITEM WHILE ALSO BRINGING IN THE ALTERNATIVES FROM THE OLD GOVTNAMES ARRAY
  // sort() {
  //   console.log('god help us.')
  //
  //     while (this.sortCounter < this.toSort.length) {
  //       var matchFound = false
  //       for (let i of this.sortedObjects) {
  //         if (this.toSort[this.sortCounter].agency == i.agency) {
  //           i.subagencies.push(this.toSort[this.sortCounter].subagencies[0])
  //           matchFound = true
  //         }
  //       }
  //       if (!matchFound) {
  //         this.toSort[this.sortCounter].alternatives = []
  //         for (let x of this.govtNames) {
  //
  //           if (this.toSort[this.sortCounter].agency.toLowerCase() == x.name.toLowerCase()) {
  //             // console.log(this.toSort[this.sortCounter].agency + ' MATCHES ' + x.name)
  //             this.toSort[this.sortCounter].alternatives = x.alternatives
  //           }
  //         }
  //         this.sortedObjects.push(this.toSort[this.sortCounter])
  //       }
  //       this.sortCounter++
  //     }
  //     for (let g of this.govtNames) {
  //       var matchFound = false
  //       for (let s of this.sortedObjects){
  //         if (g.name.toLowerCase() == s.agency.toLowerCase()) {
  //           matchFound = true
  //         }
  //       }
  //       if (!matchFound) {
  //         console.log('addin a new one!')
  //         this.sortedObjects.push({
  //           agency: g.name,
  //           subagencies: [],
  //           alternatives: g.alternatives
  //         })
  //       }
  //     }
  //   console.log('DONE. We have sorted ' + this.sortedObjects.length + ' so far.')
  // }
  // uploadSortedObjects() {
  //   if ((this.sortedObjects.length - this.uploadCounter) >= 2000 ){
  //     for (var i = 0; i < 2000; i++) {
  //       this.agencyService.createAgency(this.sortedObjects[this.uploadCounter]).toPromise();
  //       this.uploadCounter++
  //     }
  //   } else {
  //     while (this.uploadCounter < this.sortedObjects.length) {
  //       this.agencyService.createAgency(this.sortedObjects[this.uploadCounter]).toPromise();
  //       this.uploadCounter++
  //     }
  //   }
  //   console.log('DONE. We have finished ' + this.uploadCounter + ' so far.')
  // }

  }
