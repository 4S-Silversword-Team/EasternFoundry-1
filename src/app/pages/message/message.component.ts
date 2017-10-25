import { Component, OnInit } from '@angular/core';

import { User } from '../../classes/user'
import { Message } from '../../classes/message'
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../services/user.service'
import { MessageService } from '../../services/message.service'

@Component({
  selector: 'app-message',
  providers: [UserService, MessageService],
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
  messageOpen: Boolean = false
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
          if ( this.router.url !== '/bugreport' ) {
            for (let i of mail) {
              if (!i.timestamp){
                i.timestamp = 0
              }
              if (i.sender.id == this.currentUser._id && !i.sender.delete){
                console.log(i.timestamp)
                this.outbox.push(i)
              }
              for (let r of i.recipient) {
                if (r.id == this.currentUser._id && !r.delete){
                  if (i.bugReport){
                    this.bugbox.push(i)
                  } else{
                    this.inbox.push(i)
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
        });
      });
    });


  }

  ngOnInit() {
  }

  openMessage(message){
    this.activeMessage = message
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
    console.log(newTab)
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
