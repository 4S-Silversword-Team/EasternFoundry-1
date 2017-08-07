import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../classes/user';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-all-profiles',
  templateUrl: './all-profiles.component.html',
  styleUrls: ['./all-profiles.component.css'],
  providers: [UserService]
})
export class AllProfilesComponent implements OnInit {

  users: User[] = [];

  constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.userService.getUsers().then(val => this.users = val );

  }

  ngOnInit() {
  }

  goTo(id: string) {
    this.router.navigate(['user-profile', id]);
  }


}
