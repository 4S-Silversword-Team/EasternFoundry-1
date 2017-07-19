export class Company {
    id: string;
    name: string;
    email: string;
    avatar: string;
    contactNumber: string;
    city: string;
    state: string;
    zip: string;
    address: string;
    lastUpdated: string;
    informationAccuracy: number;
    leadership: [
        {userId: string}
    ];
    product: [
        {productId: string}
    ];
    service: [
        {serviceId: string}
    ];
    pastPerformance: [
        {pastPerformanceId: string}
    ];
    agencyExperience: [
        {title: string, score: number}
    ];
    vehicles: [
        {
            vehicleType: string
            quantity: number
        }
    ];
    schedule: [
        {
            date: string,
            content: string
        }
    ];
}
