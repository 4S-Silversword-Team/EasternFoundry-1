export class PastPerformance {
    id: string
    title: string
    client: string
    topic: string
    startDate: string
    endDate: string
    cleared: boolean
    location: string
    FTE: string
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
    userProfileProxies: [
      any
    ]
}
