export class Message {
    _id: string
    ownerId: string
    inbox: boolean
    outbox: boolean
    bugReport: boolean
    sender: {
      id: string
      name: string
      avatar: string
    }
    recipient: [{
      id: string
      name: string
      avatar: string
    }]
    subject: string
    content: string
    isInvitation: boolean
    invitation: {
      fromUser: boolean
      companyId: string
      pastPerformanceId: string
      pastPerformanceName: string
    }
    read: boolean
    replyToId: string
    date: string
    timestamp: number
}
