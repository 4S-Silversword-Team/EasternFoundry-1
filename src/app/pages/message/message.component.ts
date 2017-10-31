import { Component, OnInit } from '@angular/core';

import { User } from '../../classes/user'
import { Message } from '../../classes/message'
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service'
import { MessageService } from '../../services/message.service'
import { CompanyUserProxyService } from '../../services/companyuserproxy.service'

@Component({
  selector: 'app-message',
  providers: [UserService, MessageService, CompanyUserProxyService],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  promiseFinished: Boolean = false
  bugReport: Boolean = false
  currentUser: User = new User()
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
    sender: {
      id: '',
      name: '',
      delete: false,
    },
    recipient: [{
      id: '',
      name: '',
      delete: false,
    }],
    subject: '',
    content: '',
    isInvitation: false,
    invitation: {
      fromUser: false,
      companyId: '',
      pastPerformanceId: '',
    },
    read: false,
    replyToId: '',
    date: '',
    timestamp: '',
    bugReport: false,
  }

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private companyUserProxyService: CompanyUserProxyService,
    private route: ActivatedRoute,
    private router: Router,
  ) {

    this.userService.getUserbyID(localStorage.getItem('uid')).toPromise().then((result) => {
      this.currentUser = result
      this.newMessage.sender.id = this.currentUser._id
      this.newMessage.sender.name = this.currentUser.firstName + ' ' + this.currentUser.lastName
      this.userService.getUsers().then((result) => {
        this.allUsers = result
        this.messageService.getMailbox(this.currentUser._id).toPromise().then((result) => {
          var mail: any = result
          var companies = []
          var companyPromises = []
          for (let p of this.currentUser.companyUserProxies){
            if (p.role.title == 'admin'){
              companies.push(p.company)
            }
          }
          for (let c of companies) {
            companyPromises.push(this.messageService.getMailbox(c).toPromise().then((result) => {
              var res: any = result
              for (let m of res){
                mail.push(m)
              }
            }))
          }
          Promise.all(companyPromises).then(res=>{
            if ( this.router.url !== '/bugreport' ) {
              for (let i of mail) {
                if (!i.timestamp){
                  i.timestamp = 0
                }
                if (i.sender.id == this.currentUser._id && !i.sender.delete){
                  this.outbox.push(i)
                } else {
                  for (let c of companies){
                    if (i.sender.id == c && !i.sender.delete) {
                      this.outbox.push(i)
                      break
                    }
                  }
                }
                for (let r of i.recipient) {
                  if (r.id == this.currentUser._id && !r.delete){
                    if (i.bugReport){
                      this.bugbox.push(i)
                    } else{
                      this.inbox.push(i)
                    }
                  } else {
                    for (let c of companies){
                      if (r.id == c && !r.delete) {
                        this.inbox.push(i)
                        break
                      }
                    }
                  }
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
          })
        });
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

  deleteMessage(message, box, i){
    this.activeMessage = new Message()
    this.messageOpen = false
    if (box == 0){
      for (let r of message.recipient) {
        if (r.id == this.currentUser._id){
          r.delete = true
        }
      }
      this.messageService.updateMessage(message._id, message).toPromise().then((res) => {
        console.log('gone!')
        this.inbox.splice(i,1)
      });
    } else if (box == 1){
      message.sender.delete = true
      this.messageService.updateMessage(message._id, message).toPromise().then((res) => {
        console.log('gone!')
        this.outbox.splice(i,1)
      });
    } else if (box == 2){
      for (let r of message.recipient) {
        if (r.id == this.currentUser._id){
          r.delete = true
        }
      }
      this.messageService.updateMessage(message._id, message).toPromise().then((res) => {
        console.log('gone!')
        this.bugbox.splice(i,1)
      });
    }
  }

  switchTab(newTab) {
    if (this.activeTab.main == newTab) {
      this.activeTab.main = 7
    } else {
      this.activeTab.main = newTab
    }
  }

  setRecipientUser(u){
    this.newMessage.recipient[0].id = u._id
    this.newMessage.recipient[0].name = u.firstName + ' ' + u.lastName
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
      console.log('hell yeah')
      var d = new Date()
      var t = d.getTime()
      var response = {
        sender: {
          id: this.currentUser._id,
          name: this.currentUser.firstName + " " + this.currentUser.lastName,
          avatar: this.currentUser.avatar,
          delete: true,
        },
        recipient: [{
          id: company.id,
          name: company.name,
          avatar: company.avatar,
          delete: false,
        }],
        subject: 'Invitation Accepted!',
        content: this.currentUser.firstName + " " + this.currentUser.lastName + ' accepted your invitation and has joined ' + company.name + '!',
        isInvitation: false,
        invitation: {
          fromUser: false,
          companyId: '',
          pastPerformanceId: '',
        },
        read: false,
        replyToId: '',
        date: d,
        timestamp: t,
        bugReport: false,
      }
      this.messageService.createMessage(response).toPromise().then((result) => {
        console.log('HELL YEA')
        this.deleteMessage(message, 0, this.activeMessageIndex)
        this.closeMessage()
        this.router.navigate(['corporate-profile', company.id]);
      });
    });
  }

  declineCompanyInvitation(message, company){
    var d = new Date()
    var t = d.getTime()
    var response = {
      sender: {
        id: this.currentUser._id,
        name: this.currentUser.firstName + " " + this.currentUser.lastName,
        avatar: this.currentUser.avatar,
        delete: true,
      },
      recipient: [{
        id: company.id,
        name: company.name,
        avatar: company.avatar,
        delete: false,
      }],
      subject: 'Invitation Declined',
      content: this.currentUser.firstName + " " + this.currentUser.lastName + ' has declined your invitation to join ' + company.name + '.',
      isInvitation: false,
      invitation: {
        fromUser: false,
        companyId: '',
        pastPerformanceId: '',
      },
      read: false,
      replyToId: '',
      date: d,
      timestamp: t,
      bugReport: false,
    }
    this.messageService.createMessage(response).toPromise().then((result) => {
      console.log('HELL YEA')
      this.deleteMessage(message, 0, this.activeMessageIndex)
      this.closeMessage()
    });
  }

  sendMessage(){
    var d = new Date()
    var t = d.getTime()
    this.newMessage.date = d
    this.newMessage.timestamp = t

    console.log(this.newMessage)
    this.messageService.createMessage(this.newMessage).toPromise().then((result) => {
      console.log('did it')
      if (this.bugReport) {
        window.scrollTo(0, 0);
        this.router.navigate(['']);
        console.log('BUG SENT')
      } else {
        this.newMessage = {
          sender: {
            id: '',
            name: '',
            avatar: '',
            delete: false
          },
          recipient: [{
            id: '',
            name: '',
            avatar: '',
            delete: false
          }],
          subject: '',
          content: '',
          isInvitation: false,
          invitation: {
            fromUser: false,
            companyId: '',
            pastPerformanceId: '',
          },
          read: false,
          replyToId: '',
          date: '',
          timestamp: '',
          bugReport: false,
        }
        this.activeTab.main = 0
      }
    });
  }
}
