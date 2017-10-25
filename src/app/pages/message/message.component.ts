import { Component, OnInit } from '@angular/core';

import { User } from '../../classes/user'
import { Message } from '../../classes/message'

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
  currentUser: User = new User()
  inbox: Message[] = []
  outbox: Message[] = []
  recipientSearchOn = false
  allUsers: User[] = []
  filteredUsers: User[] = []
  newMessage: any = {
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
  }

  constructor(
    private userService: UserService,
    private messageService: MessageService,
  ) {

    this.userService.getUserbyID(localStorage.getItem('uid')).toPromise().then((result) => {
      this.currentUser = result
      this.newMessage.sender.id = this.currentUser._id
      this.newMessage.sender.name = this.currentUser.firstName + ' ' + this.currentUser.lastName
      this.userService.getUsers().then((result) => {
        this.allUsers = result
        this.messageService.getMailbox(this.currentUser._id).toPromise().then((result) => {
          var mail: any = result
          for (let i of mail) {
            if (i.sender.id == this.currentUser._id){
              this.outbox.push(i)
            }
            for (let r of i.recipient) {
              if (r.id == this.currentUser._id){
                this.inbox.push(i)
              }
            }
          }
          this.promiseFinished = true;
        });
      });
    });


  }

  ngOnInit() {
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
    });
  }
}
