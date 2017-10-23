export class PastPerformance {
    id: string
    _id: string
    title: string
    client: {
      gov: boolean
      name: string
    }
    topic: string
    area: string
    startDate: string
    endDate: string
    cleared: boolean
    location: string
    fte: string
    value: string
    rating: string
    description: string
    avatar: string
    employees: [
        {
            title: string,
            stillWith: boolean
        }
    ]
    synopsis: string
    technical: string
    management: string
    other: string
    public: boolean
    userProfileProxies: [
      any
    ]
    companyProxies: [
      any
    ]
}
