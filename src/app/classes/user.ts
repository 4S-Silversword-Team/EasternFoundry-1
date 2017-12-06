import {CompanyUserProxy} from './company-user-proxy'

export class User {
  _id: string
  firstName: string
  lastName: string
  cell: string
  office: string
  username: string
  primaryEmail: string
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
      employmentType: number,
      agencyExperience: [
        {
          main: {
            title: string,
            data: any[],
            score: number,
            description: string,
            isPM: boolean,
            pmDescription: string,
            pmScore: number,
            isKO: boolean,
            koDescription: string,
            koScore: number
          },
          offices: [
            {
              title: string,
              data: any[],
              score: number,
              description: string,
              isPM: boolean,
              pmDescription: string,
              pmScore: number,
              isKO: boolean,
              koDescription: string,
              koScore: number
            }
          ]
        }
      ],
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
        Organization: string,
        Type: string,
        DateEarned: string
      }
    ]
  License: [
      {
        LicenseName: string
      }
    ]
  references: [
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
  ]
  occupations: [
    {
      score: number
      title: string
      code: string
      version: string
    }
  ]
  general_work_activities: [
    {
      score: number
      guid: string
      code: string
      version: string
    }
  ]
  intermediate_work_activities: [
    {
      score: number
      guid: string
      code: string
      version: string
    }
  ]
  detailed_work_activities: [
    {
      score: number
      guid: string
      code: string
      version: string
    }
  ]
  workplace_essentials: [
    [string]
  ]
  knowledges: [
    [string]
  ]
  skills: [
    [string]
  ]
  abilities: [
    [string]
  ]
  tools: [
    {
      title: string
      category: string
      classification: string
      score: number
    }
  ]
  foundTools: [
    {
      code: string[],
      title: string
      category: string
      classification: string
      position: string[]
      score: number
    }
  ]
  resumeText: string
  public: boolean
  finished: boolean
  power: number
  companyUserProxies: [
    any
  ]
  pastPerformanceProxies: [
    any
  ]
}
