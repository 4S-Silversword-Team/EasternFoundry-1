export class Company {
    id: string;
    name: string;
    email: string;
    avatar: string;
    contactnumber: string;
    city: string;
    state: string;
    zip: string;
    address: string;
    lastUpdated: string;
    information_accuracy: number;
    leadership: [
        {userid: string}
    ];
    product: [
        {productid: string}
    ];
    service: [
        {serviceid: string}
    ];
    pastperformance: [
        {pastperformanceid: string}
    ];
    agencyexperience: [
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
