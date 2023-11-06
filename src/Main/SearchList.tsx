import { useEffect, useState } from 'react';
import Result from './Result'
import { Stopover } from '../type/types';
import { FlightData } from '../type/types';



const sampleData =[
  { 
    title: "감시항목 1",
    request_id: "req001",
    stopover: [
      {
        airline: "ASIANA AIRLINES",
        flightNumber: "OZ0108",
        departureDate: new Date("2023-01-01T18:30:00"),
        destinationDate: new Date("2023-01-01T19:30:00"),
        price: 320700,
        departure: "인천국제공항",
        destination: "오사카",
        link: "https://flyasiana.com/",
        isSoldOut: false
      },
      {
        airline: "ASIANA AIRLINES",
        flightNumber: "OZ0110",
        departureDate: new Date("2023-01-01T20:00:00"),
        destinationDate: new Date("2023-01-01T21:00:00"),
        price: 200000,
        departure: "오사카",
        destination: "도쿄 나리타",
        link: "https://flyasiana.com/",
        isSoldOut: false
      }
    ]
  },
  { 
    title: "감시항목 2",
    request_id: "req002",
    stopover: [
      {
        airline: "KOREAN AIR",
        flightNumber: "KE0822",
        departureDate: new Date("2023-02-15T13:45:00"),
        destinationDate: new Date("2023-02-15T15:30:00"),
        price: 560000,
        departure: "부산 김해국제공항",
        destination: "나고야",
        link: "https://www.koreanair.com/?hl=ko",
        isSoldOut: false
      }
    ]
  }
];

function SearchList() {
  const [data, setData] = useState<FlightData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/spiderbot/list');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Fetching data failed", error);
      }
    };

    fetchData();
  }, []);

    return <Result data={sampleData} />; //data로 변경시 WAS와의 통신하여 좌석이 있는 항목만 불러옴
}

export default SearchList;
