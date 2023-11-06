export interface Stopover {
    flightNumber: string;
    departure: string;
    destination: string;
    departureDate: Date;
    destinationDate: Date;
    price: number;
    isSoldOut: boolean;
    link: string;
    airline: string;
  }

  export interface FlightData {
    title: string;
    request_id: string;
    stopover: Stopover[];
  }