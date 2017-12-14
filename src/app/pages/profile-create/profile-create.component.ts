import {Component, OnInit, AfterViewInit, Directive, ViewChild} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../../classes/user';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import {AppComponent} from '../../app.component'

declare var $: any;

@Component({
  selector: 'app-profile-create',
  templateUrl: './profile-create.component.html',
  styleUrls: ['./profile-create.component.css'],
  providers: [ UserService, AuthService ],
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
  password2 = ''
  paramsError:string = ""
  registerInProcess: boolean = false
  registerFailed: boolean = false
  email = {
    inUse: false,
    address: ''
  }

  customTrackBy(index: number, obj: any): any {
    return  index;
  }
  constructor(
    private auth: AuthService,
    private nav: AppComponent,
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

  invalidEmail() {
    return (this.userParam.username.length > 0 && !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.userParam.username)))
  }

  registerUser() {
    if (this.userParam.username.length > 0 && !this.invalidEmail()){
      this.userService.getUserIdByEmail(this.userParam.username).toPromise().then((result) => {
        if (result != 500) {
          console.log('EMAIL TAKEN')
          this.email.inUse = true
          this.email.address = this.userParam.username
        } else {
          console.log('EMAIL AVAILABLE')
          this.email.inUse = false
          this.email.address = ''
          this.registerInProcess = true
          setTimeout(function(){ this.registerFailed = true; }, 120000);
          console.log('past timer')
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
              // this.router.navigate(['login/new']);
              var authError = false
              this.auth.doLogin(this.userParam.username.toLowerCase(), this.userParam.password, (function() {
                //this.authError = !this.auth.isLoggedIn()
                if (!this.auth.isLoggedIn()) {
                  var authError = true
                } else {
                  if (!authError){
                    //this.currentUser = this.auth.current_user  //TODO: find out why this doesn't work
                    // var mail = ({
                    //   senderEmail: 'federalfoundryforge@gmail.com',
                    //   recipientEmail: this.email,
                    //   subject: 'Verify Your Email Address',
                    //   contactMessage: "To activate your Federal Foundry Forge account, you'll need to confirm your email address. \n \n Use the following link to verify: \n \n ",
                    //   contactHTML: "<p>To activate your Federal Foundry Forge account, you'll need to confirm your email address. \n \n Use the following link to verify: <a href='" + resetLink + "'>click here to assign a new password</a>. If not, you can ignore this message.</p>"
                    // });
                    //
                    // this.appService.sendEmail(mail).toPromise().then((res) => {
                    //   console.log('email sent i think! check!')
                    //   this.passwordSent = true
                    // })

                    var currentUser = localStorage.getItem('uid')
                    this.nav.navRefresh();
                    console.log(currentUser)
                    this.router.navigateByUrl("/user-profile-edit/" + currentUser)
                  }
                }
              }).bind(this))
            });
          }
        }
      })
    }
  }
}
