export class Message {
    _id: string
    sender: {
      id: string
      name: string
    }
    recipient: [{
      id: string
      name: string
    }]
    subject: string
    content: string
    isInvitation: boolean
    invitation: {
      fromUser: boolean
      companyId: string
      pastPerformanceId: string
    }
    read: boolean
    replyToId: string
    date: string
    timestamp: string
}
