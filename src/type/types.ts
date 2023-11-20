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
    timeTaken : string;
  }

  export interface FlightData {
    title: string;
    request_id: string;
    stopover: Stopover[];
  }

  export interface Airport {
    cnt: string;
    airportName_ko: string;
    airportName_eng: string;
    IATA: string;
    ICAO: string;
    countryName_kor: string;
    countryName_eng: string;
    cityName_kor: string;
    cityName_eng: string;
}