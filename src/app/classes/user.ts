export class User {
  id: string
  firstName: string
  lastName: string
  cell: string
  office: string
  username: string
  avatar: string
  disabled: boolean
  anonymize: boolean
  gender: string
  workEligibility: [
    {
      countryCode: string,
      permanent: boolean
    }
    ]
  email: [
    {
      address: string,
      label: string
    }
  ]
  address: {
    city: string
    state: string
    zip: string
  }
  phone: [
    {
      number: string,
      label: string
    }
  ]
  education: [
    {
      school: string,
      referenceLocation: {
        countryCode: string,
        countrySubDivisionCode: string,
        cityName: string
      },
      educationLevel: [
        {
          name: string
        }
        ],
      attendanceStatusCode: string,
      attendanceEndDate: string,
      educationScore: [string],
      degreeType: [
        {
          name: string
        }
        ],
      degreeDate: string,
      majorProgramName: [string],
      minorProgramName: [string],
      comment: string
    }
    ]
  positionHistory: [
    {
      year: number,
      employer: string,
      positionTitle: string,
      referenceLocation: {
        countryCode: string,
        countrySubDivisionCode: string,
        cityName: string,
      },
      startDate: string,
      endDate: string,
      currentIndicator: boolean,
      industry: {
        name: string,
      }
      description: string,
    }
    ]
  personCompetency: [
    {
      competencyName: string,
      competencyLevel: string
    }
    ]
  certification: [
    {
      certificationName: string,
      dateEarned: string
    }
    ]
  license: [
    {
      licenseName: string
    }
    ]
  employmentReferences: [
    {
      refereeTypeCode: string,
      formattedName: string,
      positionTitle: string,
      preferredPhone: string,
      preferredEmail: string
    }
    ]
  lastUpdated: string
  informationAccuracy: number
  clearance: [
    {
      clearanceType: string,
      awarded: string,
      expiration: string
    }
    ]
  award: [string]
  capability: [
    {
      name: string,
      score: number
    }
    ]
  skill: [string]
  interest: string
  agencyExperience: {
    main: {
      title: string,
      data: any[]
    },
    office1: {
      title: string,
      data: any[]
    },
    office2: {
      title: string,
      data: any[]
    }
  }
  strength: [
    {
      skill: string,
      score: number
    }
  ]
  availability: [
    {
      date: string
      available: boolean
    }
  ];
}
