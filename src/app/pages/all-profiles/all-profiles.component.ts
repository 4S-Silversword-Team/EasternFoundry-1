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
  allTools: any[] = []
  toolsUsed: string[] = []

  constructor(
    private router: Router,
    private userService: UserService,
    private toolService: ToolService,
    private http: Http,
  ) {
    this.http.get('../../onet-tools.json')
        .subscribe(res => this.allTools = res.json());
    this.userService.getUsers().then(val => this.users = val );

  }

  ngOnInit() {
  }

  goTo(id: string) {
    this.router.navigate(['user-profile', id]);
  }

// this was used to upload the 68000 tools minus all the duplicates. i cut like 50k duplicate entries but please do not turn this back on unless it is CRITICALLY NEEDED
  // uploadAllTools() {
  //   console.log('god help us.')
  //   var toolsUsed: string[] = []
  //   toolsUsed.push('DEFAULT')
  //   for (let tool of this.allTools) {
  //     var matchFound = false
  //     for (let name of toolsUsed) {
  //       if (tool.title == name) {
  //         matchFound = true
  //       }
  //     }
  //     if (!matchFound) {
  //       toolsUsed.push(tool.title)
  //       this.toolService.createTool(tool).toPromise();
  //     }
  //   }
  // }


}
