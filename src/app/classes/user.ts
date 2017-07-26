export class User {
  firstName: string
  lastName: string
  cell: string
  office: string
  username: string
  avatar: string
  disabled: boolean
  dateOfBirth: string
  gender: string
  workEligibility: [
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
  positionHistory: [
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
      },
      isGovernment: boolean,
      agencyExperience: [
        {
          main: {
            title: string,
            data: any[]
          },
          offices: [
            {
              title: string,
              data: any[]
            }
          ]
        }
      ],
      isPM: boolean,
      isKO: boolean,
      Description: string
    }
    ]
  personCompetency: [
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
