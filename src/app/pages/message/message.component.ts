import { Component, OnInit } from '@angular/core';

import { User } from '../../classes/user'
import { Company } from '../../classes/company'
import { Message } from '../../classes/message'
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service'
import { CompanyService } from '../../services/company.service'
import { MessageService } from '../../services/message.service'
import { CompanyUserProxyService } from '../../services/companyuserproxy.service'
import { PastperformanceService } from '../../services/pastperformance.service';
import { UserPastPerformanceProxyService } from '../../services/userpastperformanceproxy.service'

@Component({
  selector: 'app-message',
  providers: [UserService, CompanyService, MessageService, CompanyUserProxyService, PastperformanceService, UserPastPerformanceProxyService],
  templateUrl: './message.component.html',
  host: {
      '(document:click)': 'handleClick($event)',
  },
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  promiseFinished: Boolean = false
  bugReport: Boolean = false
  currentUser: User = new User()
  currentCompany: Company = new Company()
  inbox: Message[] = []
  outbox: Message[] = []
  bugbox: Message[] = []
  recipientSearchOn = false
  allUsers: User[] = []
  filteredUsers: User[] = []
  adminUsers: User[] = []
  activeTab: any = {
    main:  0,
  }
  activeMessage: Message = new Message()
  activeMessageIndex: 0
  messageOpen: Boolean = false
  currentDate: string =  (new Date().getMonth()+1) + '-' + new Date().getDate() + '-' + new Date().getFullYear()
  newMessage: any = {
    bugReport: false,
    sender: {
      id: '',
      name: '',
    },
    recipient: [{
      id: '',
      name: '',
    }],
    subject: '',
    content: '',
    isInvitation: false,
    invitation: {
      fromUser: false,
      companyId: '',
      pastPerformanceId: '',
      pastPerformanceName: '',
    },
    replyToId: '',
    date: '',
    timestamp: '',
  }

  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private messageService: MessageService,
    private companyUserProxyService: CompanyUserProxyService,
    private pastPerformanceService: PastperformanceService,
    private userPastPerformanceProxyService: UserPastPerformanceProxyService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

    this.userService.getUserbyID(localStorage.getItem('uid')).toPromise().then((result) => {
      this.currentUser = result
      this.newMessage.sender.id = this.currentUser._id
      this.newMessage.sender.name = this.currentUser.firstName + ' ' + this.currentUser.lastName
      this.userService.getUsers().then((result) => {
        this.allUsers = result
        if (!this.router.url.startsWith('/corporate-profile')){
          this.messageService.getMailbox(this.currentUser._id).toPromise().then((result) => {
            var mail: any = result
            if ( this.router.url !== '/bugreport' ) {
              for (let i of mail) {
                if (!i.timestamp){
                  i.timestamp = 0
                }
                if (i.inbox && !i.bugReport) {
                  this.inbox.push(i)
                }
                if (i.outbox) {
                  this.outbox.push(i)
                }
                if (i.bugReport && !i.outbox) {
                  this.bugbox.push(i)
                }
              }
              this.inbox.sort(function(a,b){
                return b.timestamp - a.timestamp;
              })
              this.outbox.sort(function(a,b){
                return b.timestamp - a.timestamp;
              })
              this.bugbox.sort(function(a,b){
                return b.timestamp - a.timestamp;
              })
              this.bugReport = false
            } else {
              for (let u of this.allUsers) {
                if (u.power > 3){
                  if (this.newMessage.recipient.length < 2) {
                    this.newMessage.recipient[0] = {
                      id: u._id,
                      name: u.firstName + ' ' + u.lastName
                    }
                  } else {
                    this.newMessage.recipient.push({
                      id: u._id,
                      name: u.firstName + ' ' + u.lastName
                    })
                  }
                }
              }
              console.log(this.newMessage.recipient)
              this.newMessage.bugReport = true;
              this.newMessage.subject = 'BUG REPORT'
              this.bugReport = true
            }
            this.promiseFinished = true;
          });
        } else {
          this.companyService.getCompanyByID(this.route.snapshot.params['id']).toPromise().then((result) => {
            this.currentCompany = result
            var admin = false
            for (let p of this.currentUser.companyUserProxies){
              if (p.company._id == this.currentCompany._id){
                if (p.role && p.role.title == 'admin'){
                  admin = true
                }
              }
            }
            if (admin) {
              this.messageService.getMailbox(this.currentCompany._id).toPromise().then((result) => {
                var mail: any = result
                for (let i of mail) {
                  if (!i.timestamp){
                    i.timestamp = 0
                  }
                  if (i.inbox) {
                    this.inbox.push(i)
                  }
                  if (i.outbox) {
                    this.outbox.push(i)
                  }
                }
                this.inbox.sort(function(a,b){
                  return b.timestamp - a.timestamp;
                })
                this.outbox.sort(function(a,b){
                  return b.timestamp - a.timestamp;
                })
                this.bugReport = false
                this.promiseFinished = true;
              });
            }
            else {
              console.log('nope')
              // window.history.back();
            }
          })
        }
      });
    });


  }

  ngOnInit() {
  }

  openMessage(message, i){
    this.activeMessage = message
    this.activeMessageIndex = i
    this.messageOpen = true
    if (!message.read){
      this.messageService.markAsRead(message._id).toPromise().then((res) => {
        message.read = true
        console.log('marked as read')
      });
    }
  }

  closeMessage(){
    this.activeMessage = new Message()
    this.messageOpen = false
  }

  deleteMessage(message, i){
    this.activeMessage = new Message()
    this.messageOpen = false
    var inbox = message.inbox
    var outbox = message.outbox
    var bugbox = message.bugReport
    this.messageService.deleteMessage(message._id).toPromise().then((res) => {
      console.log('gone!')
      if (inbox){
        this.inbox.splice(i,1)
      }
      if (outbox){
        this.outbox.splice(i,1)
      }
      if (bugbox){
        this.bugbox.splice(i,1)
      }
    });
  }

  switchTab(newTab) {
    this.activeTab.main = newTab
  }

  setRecipientUser(u){
    this.newMessage.recipient[0].id = u._id
    this.newMessage.recipient[0].name = u.firstName + ' ' + u.lastName
    this.filterUsers(this.newMessage.recipient[0].name)
    this.recipientSearchOn = false
  }

  filterUsers(search){
    if (search.length > 0){
      this.filteredUsers = []
      for (let i of this.allUsers){
        var name = i.firstName + ' ' + i.lastName
        if (name.toLowerCase().includes(search.toLowerCase())){
          this.filteredUsers.push(i)
        }
      }
      this.recipientSearchOn = true
    } else if (search.length == 0) {
      this.recipientSearchOn = false
    }
  }

  turnOnSearch(){
    if (this.newMessage.recipient[0].name.length > 0) {
      this.recipientSearchOn = true
    }
  }

  handleClick(event){
    var clickedComponent = event.target;
    var inside = false;
    do {
      if (clickedComponent === document.getElementById('recipient') || clickedComponent === document.getElementById('recipient-dropdown')) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if(!inside){
      this.recipientSearchOn = false
    }
  }


  acceptCompanyInvitation(message, company){
    let request = {
      "userProfile": this.currentUser._id,
      "company": company.id,
      "startDate": this.currentDate,
      "endDate": this.currentDate,
      "stillAffiliated": true
    }
    this.companyUserProxyService.addCompanyUserProxy(request).then(() => {
      console.log('proxy created')
      var d = new Date()
      var t = d.getTime()
      var response = {
        bugReport: false,
        sender: {
          id: this.currentUser._id,
          name: this.currentUser.firstName + " " + this.currentUser.lastName,
          avatar: this.currentUser.avatar,
        },
        recipient: [{
          id: company.id,
          name: company.name,
          avatar: company.avatar,
        }],
        subject: 'Invitation Accepted!',
        content: this.currentUser.firstName + " " + this.currentUser.lastName + ' accepted your invitation and has joined ' + company.name + '!',
        isInvitation: false,
        invitation: {
          fromUser: false,
          companyId: '',
          pastPerformanceId: '',
          pastPerformanceName: '',
        },
        replyToId: message._id,
        date: d,
        timestamp: t,
      }
      this.messageService.createMessage(response).toPromise().then((result) => {
        console.log('accepted')
        this.deleteMessage(message, this.activeMessageIndex)
        this.closeMessage()
        this.router.navigate(['corporate-profile', company.id]);
      });
    });
  }

  declineCompanyInvitation(message, company){
    var d = new Date()
    var t = d.getTime()
    var response = {
      bugReport: false,
      sender: {
        id: this.currentUser._id,
        name: this.currentUser.firstName + " " + this.currentUser.lastName,
        avatar: this.currentUser.avatar,
      },
      recipient: [{
        id: company.id,
        name: company.name,
        avatar: company.avatar,
      }],
      subject: 'Invitation Declined',
      content: this.currentUser.firstName + " " + this.currentUser.lastName + ' has declined your invitation to join ' + company.name + '.',
      isInvitation: false,
      invitation: {
        fromUser: false,
        companyId: '',
        pastPerformanceId: '',
        pastPerformanceName: '',
      },
      replyToId: message._id,
      date: d,
      timestamp: t,
    }
    this.messageService.createMessage(response).toPromise().then((result) => {
      console.log('declined')
      this.deleteMessage(message, this.activeMessageIndex)
      this.closeMessage()
    });
  }

  acceptPersonInvitation(message, person){
    let request = {
      "userProfile": person.id,
      "company": this.currentCompany._id,
      "startDate": this.currentDate,
      "endDate": this.currentDate,
      "stillAffiliated": true
    }
    this.companyUserProxyService.addCompanyUserProxy(request).then(() => {
      console.log('proxy created')
      var d = new Date()
      var t = d.getTime()
      var response = {
        bugReport: false,
        sender: {
          id: this.currentCompany._id,
          name: this.currentCompany.name,
          avatar: this.currentCompany.avatar,
        },
        recipient: [{
          id: person.id,
          name: person.name,
          avatar: person.avatar,
        }],
        subject: 'Request Accepted!',
        content: this.currentCompany.name + ' has accepted your request to join!',
        isInvitation: false,
        invitation: {
          fromUser: false,
          companyId: '',
          pastPerformanceId: '',
          pastPerformanceName: '',
        },
        replyToId: message._id,
        date: d,
        timestamp: t,
      }
      this.messageService.createMessage(response).toPromise().then((result) => {
        console.log('accepted')
        this.deleteMessage(message, this.activeMessageIndex)
        this.closeMessage()
      });
    });
  }

  declinePersonInvitation(message, person){
    var d = new Date()
    var t = d.getTime()
    var response = {
      bugReport: false,
      sender: {
        id: this.currentCompany._id,
        name: this.currentCompany.name,
        avatar: this.currentCompany.avatar,
      },
      recipient: [{
        id: person.id,
        name: person.name,
        avatar: person.avatar,
      }],
      subject: 'Request Declined',
      content: this.currentCompany.name + ' has declined your request to join.',
      isInvitation: false,
      invitation: {
        fromUser: false,
        companyId: '',
        pastPerformanceId: '',
        pastPerformanceName: '',
      },
      replyToId: message._id,
      date: d,
      timestamp: t,
    }
    this.messageService.createMessage(response).toPromise().then((result) => {
      console.log('declined')
      this.deleteMessage(message, this.activeMessageIndex)
      this.closeMessage()
    });
  }

  acceptPPInvitation(message, company){
    let request = {
      "user": this.currentUser._id,
      "pastPerformance": message.invitation.pastPerformanceId,
      "startDate": this.currentDate,
      "endDate": this.currentDate,
      "stillAffiliated": false,
      "role": "programmer"
    }
    console.log(request)
    this.userPastPerformanceProxyService.addUserPPProxy(request).then(() => {
      console.log('proxy created')
      var d = new Date()
      var t = d.getTime()
      var response = {
        bugReport: false,
        sender: {
          id: this.currentUser._id,
          name: this.currentUser.firstName + " " + this.currentUser.lastName,
          avatar: this.currentUser.avatar,
        },
        recipient: [{
          id: company.id,
          name: company.name,
          avatar: company.avatar,
        }],
        subject: 'Past Performance Invitation Accepted!',
        content: this.currentUser.firstName + " " + this.currentUser.lastName + ' accepted your Past Performance invitation.',
        isInvitation: false,
        invitation: {
          fromUser: false,
          companyId: '',
          pastPerformanceId: '',
          pastPerformanceName: '',
        },
        replyToId: message._id,
        date: d,
        timestamp: t,
      }
      this.messageService.createMessage(response).toPromise().then((result) => {
        console.log('accepted')
        this.deleteMessage(message, this.activeMessageIndex)
        this.closeMessage()
        this.router.navigate(['past-performance', message.invitation.pastPerformanceId]);
      });
    })
  }

  declinePPInvitation(message, company){
    var d = new Date()
    var t = d.getTime()
    var response = {
      bugReport: false,
      sender: {
        id: this.currentUser._id,
        name: this.currentUser.firstName + " " + this.currentUser.lastName,
        avatar: this.currentUser.avatar,
      },
      recipient: [{
        id: company.id,
        name: company.name,
        avatar: company.avatar,
      }],
      subject: 'Invitation Declined',
      content: this.currentUser.firstName + " " + this.currentUser.lastName + ' has declined your invitation to join ' + company.name + '.',
      isInvitation: false,
      invitation: {
        fromUser: false,
        companyId: '',
        pastPerformanceId: '',
        pastPerformanceName: '',
      },
      replyToId: message._id,
      date: d,
      timestamp: t,
    }
    this.messageService.createMessage(response).toPromise().then((result) => {
      console.log('declined')
      this.deleteMessage(message, this.activeMessageIndex)
      this.closeMessage()
    });
  }

  clearMessage(){
    this.newMessage = {
      bugReport: false,
      sender: {
        id: '',
        name: '',
        avatar: '',
      },
      recipient: [{
        id: '',
        name: '',
        avatar: '',
      }],
      subject: '',
      content: '',
      isInvitation: false,
      invitation: {
        fromUser: false,
        companyId: '',
        pastPerformanceId: '',
        pastPerformanceName: '',
      },
      replyToId: '',
      date: '',
      timestamp: '',
    }
    this.activeTab.main = 0
  }

  sendMessage(){
    var d = new Date()
    var t = d.getTime()
    this.newMessage.date = d
    this.newMessage.timestamp = t

    this.messageService.createMessage(this.newMessage).toPromise().then((result) => {
      console.log('Message sent!')
      if (this.bugReport) {
        window.scrollTo(0, 0);
        this.router.navigate(['']);
        console.log('BUG SENT')
      } else {
        this.clearMessage()
      }
    });
  }
}
