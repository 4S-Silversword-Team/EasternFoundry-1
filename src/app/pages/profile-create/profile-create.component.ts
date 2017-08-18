import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../../classes/user';
import { UserService } from '../../services/user.service';

declare var $: any;

@Component({
  selector: 'app-profile-create',
  templateUrl: './profile-create.component.html',
  styleUrls: ['./profile-create.component.css'],
  providers: [ UserService ]
})
export class ProfileCreateComponent implements OnInit {

  userParam = {
    firstName: '',
    lastName: '',
    cell: '',
    office: '',
    username: '',
    resume: ''
  };

  customTrackBy(index: number, obj: any): any {
    return  index;
  }
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location
  ) {
    // this.currentUser = this.userService.getUserbyID(this.route.snapshot.params['id'])
  }

  ngOnInit() {
  }

  registerUser() {
    console.log(this.userService.registerUser);
    this.userService.registerUser(this.userParam).toPromise().then(result => console.log(result));
    console.log("Register clicked");
    console.log(this.userParam);
  }

}
