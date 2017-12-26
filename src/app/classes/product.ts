export class Product {
  _id: string
  name: string
  feature: [
    {
      name: string,
      problem: {
        category: string,
        description: string,
      }
      story: string[],
      score: number
    }
  ]
  description: string
  moreInfoLink: string
  viewDemoLink: string
  customization: boolean
  training: boolean
  maintenance: boolean
  customers: {
    defense: [
      {
        avatar: string,
        name: string
      }
    ],
    civilian: [
      {
        avatar: string,
        name: string
      }
    ]
  }
  public: boolean
}
