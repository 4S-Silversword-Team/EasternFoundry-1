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

@Directive({

})

export class ProfileCreateComponent implements OnInit {

    @ViewChild('fileInput') fileInput;

  userParam = {
    firstName: '',
    lastName: '',
    cell: '',
    office: '',
    username: '',

  };

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
    //const fileList: FileList = event.target.files;
    let fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      let file = fileBrowser.files[0]

      //let formData = new FormData();
      formData.append('uploadFile', file, file.name);
      let req = this.userParam;
      req['resume'] = formData;
      console.log("REQ", req)
      this.userService.registerUser(req).toPromise().then(result => console.log("did it work?",result));
      //console.log(formData, formData === new FormData())
      // const headers = new Headers();
      // /** No need to include Content-Type in Angular 4 */
      // headers.append('Content-Type', 'multipart/form-data');
      // headers.append('Accept', 'application/json');
      // const options = new RequestOptions({ headers: headers });
      // this.http.post(`${this.apiEndPoint}`, formData, options)
      //   .map(res => res.json())
      //   .catch(error => Observable.throw(error))
      //   .subscribe(
      //     data => console.log('success'),
      //     error => console.log(error)
      //   )
    }
  }
}
