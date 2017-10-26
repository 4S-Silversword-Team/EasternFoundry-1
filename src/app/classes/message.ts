export class Message {
    _id: string
    sender: {
      id: string
      name: string
      avatar: string
      delete: boolean
    }
    recipient: [{
      id: string
      name: string
      avatar: string
      delete: boolean
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
    timestamp: number
    bugReport: boolean
}
