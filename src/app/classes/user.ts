export class User {
  id: string
  firstName: string
  lastName: string
  cell: string
  office: string
  username: string
  avatar: string
  disabled: boolean
  gender: string
  workeligibility: [
    {
      CountryCode: string,
      Permanent: boolean
    }
    ]
  email: [
    {
      Address: string,
      Label: string
    }
    ]
  address: {
    city: string
    state: string
    zip: string
  }
  phone: [
    {
      Number: string,
      Label: string
    }
    ]
  education: [
    {
      School: string,
      ReferenceLocation: {
        CountryCode: string,
        CountrySubDivisionCode: string,
        CityName: string
      },
      EducationLevel: [
        {
          Name: string
        }
        ],
      AttendanceStatusCode: string,
      AttendanceEndDate: string,
      EducationScore: [string],
      DegreeType: [
        {
          Name: string
        }
        ],
      DegreeDate: string,
      MajorProgramName: [string],
      MinorProgramName: [string],
      Comment: string
    }
    ]
  positionhistory: [
    {
      Year: number,
      Employer: string,
      PositionTitle: string,
      ReferenceLocation: {
        CountryCode: string,
        CountrySubDivisionCode: string,
        CityName: string,
      },
      StartDate: string,
      EndDate: string,
      CurrentIndicator: boolean,
      Industry: {
        Name: string,
      }
      Description: string,
    }
    ]
  personcompetency: [
    {
      CompetencyName: string,
      CompetencyLevel: string
    }
    ]
  certification: [
    {
      CertificationName: string,
      DateEarned: string
    }
    ]
  License: [
    {
      LicenseName: string
    }
    ]
  EmploymentReferences: [
    {
      RefereeTypeCode: string,
      FormattedName: string,
      PositionTitle: string,
      PreferredPhone: string,
      PreferredEmail: string
    }
    ]

  lastupdated: string
  information_accuracy: number
  clearance: [
    {
      type: string,
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
  agencyexperience: {
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
