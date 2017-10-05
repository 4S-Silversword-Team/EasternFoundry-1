import {Component, OnInit, AfterViewInit, Directive, ViewChild} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../../classes/user';
import { UserService } from '../../services/user.service';

declare var $: any;

@Component({
  selector: 'app-profile-create',
  templateUrl: './profile-create.component.html',
  styleUrls: ['./profile-create.component.css'],
  providers: [ UserService ],
})

// @Directive({
//
// })

export class ProfileCreateComponent implements OnInit {

    @ViewChild('fileInput') fileInput;

  userParam = {
    username: '',
    password: ''
  };
  paramsError:string = ""
  registerInProcess: boolean = false

  customTrackBy(index: number, obj: any): any {
    return  index;
  }
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    public location: Location,
  ) {
    // this.currentUser = this.userService.getUserbyID(this.route.snapshot.params['id'])
  }

  ngOnInit() {
  }

  // registerUser() {
  //   console.log(this.userService.registerUser);
  //   this.userService.registerUser(this.userParam).toPromise().then(result => console.log(result));
  //   console.log("Register clicked");
  //   console.log(this.userParam);
  // }

  registerUser() {
    this.registerInProcess = true
    this.paramsError = ''
    //const fileList: FileList = event.target.files;
    let fileBrowser = this.fileInput.nativeElement;
    if(this.userParam.username == '' || this.userParam.username.trim() == ''){
      this.paramsError = "Please enter an email address"
      return
    }
    if(!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.userParam.username))){ //TODO: nice to have: validate email server side
      this.paramsError = "Please enter a valid email address"
      return
    }
    if(this.userParam.password == '' || this.userParam.password.trim() == ''){
      this.paramsError = "Please enter a password"
      return
    }
    if(this.userParam.password.length < 6){
      this.paramsError = "Password must be at least 6 characters" //TODO: nice to have: validate password server side
      return
    }
    if(!fileBrowser.files || !fileBrowser.files[0]){
      this.paramsError = "Please submit a resume. A file type of .pdf,.doc, or .docx" //
      return
    }
    if (fileBrowser.files && fileBrowser.files[0]) {
      this.userParam.username = this.userParam.username.toLowerCase(); //TODO: nice to have: make the request lower case in the server
      let formData = new FormData();
      let file = fileBrowser.files[0]

      for(var key in this.userParam){
        formData.append(key, this.userParam[key])
      }

      formData.append('resume', file);
      this.userService.registerUser(formData).toPromise().then((result) => {
        var res: any = result
        this.router.navigate(['login/new']);
      });
    }
  }
}
