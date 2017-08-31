import {Http} from '@angular/http';


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../classes/user';

import { UserService } from '../../services/user.service';
import { ToolService } from '../../services/tool.service';



@Component({
  selector: 'app-all-profiles',
  templateUrl: './all-profiles.component.html',
  styleUrls: ['./all-profiles.component.css'],
  providers: [UserService, ToolService]
})
export class AllProfilesComponent implements OnInit {

  users: User[] = [];
  allTools: any[] = [];
  sortedTools: any[] = [];
  sortCounter: number = 0;
  uploadCounter: number = 2000;

  constructor(
    private router: Router,
    private userService: UserService,
    private toolService: ToolService,
    private http: Http,
  ) {
    this.http.get('../../../assets/onet-tools.json')
      .map((res: any) => res.json())
      .subscribe(
        (data: any) => {
            this.allTools = data;
        },
        err => console.log(err), // error
        () => console.log('get tools Complete') // complete
      );

    this.toolService.getTools().then(val => this.sortedTools = val );

    this.userService.getUsers().then(val => this.users = val );
  }



  ngOnInit() {
  }

  goTo(id: string) {
    this.router.navigate(['user-profile', id]);
  }

// // these are my dev tools to sort the 68000 tools into the format we need. do not use unless you know what you're doing
//   sortAllTools() {
//     console.log('god help us.')
//
//       while (this.sortCounter < this.allTools.length) {
//         var matchFound = false
//         for (let tool of this.sortedTools) {
//           if (this.allTools[this.sortCounter].title == tool.title) {
//             tool.position.push(this.allTools[this.sortCounter].position[0])
//             matchFound = true
//           }
//         }
//         if (!matchFound) {
//           this.sortedTools.push(this.allTools[this.sortCounter])
//         }
//         this.sortCounter++
//       }
//
//     console.log('DONE. We have sorted ' + this.sortedTools.length + ' so far.')
//   }
//   uploadAllTools() {
//     if ((this.sortedTools.length - this.uploadCounter) >= 2000 ){
//       for (var i = 0; i < 2000; i++) {
//         this.toolService.createTool(this.sortedTools[this.uploadCounter]).toPromise();
//         this.uploadCounter++
//       }
//     } else {
//       while (this.uploadCounter < this.sortedTools.length) {
//         this.toolService.createTool(this.sortedTools[this.uploadCounter]).toPromise();
//         this.uploadCounter++
//         }
//       }
//       console.log('DONE. We have finished ' + this.uploadCounter + ' so far.')
//     }

  }
