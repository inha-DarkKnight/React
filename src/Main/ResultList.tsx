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
    const fetchMonitoringData = async () => {
      try {
        const response = await fetch('http://localhost:8080/monitoring/list');
        const monitoringData: FlightData[] = await response.json();
        setData(monitoringData);
        fetchTicketList(monitoringData);
      } catch (error) {
        console.error("Fetching monitoring data failed", error);
      }
    };

    const fetchTicketList = async (monitoringData: FlightData[]) => {
      try {
        const request_ids = monitoringData.map(data => data.request_id);
        console.log(request_ids);
        const response = await fetch('http://localhost:8080/tickets/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ request_ids }),
        });
        const ticketListData: FlightData[] = await response.json();
        setData(ticketListData);
      } catch (error) {
        console.error("Fetching ticket list failed", error);
      }
    };

    fetchMonitoringData();
  }, []);

  return <Result data={sampleData} />; //data로 변경시 WAS와의 통신하여 좌석이 있는 항목만 불러옴
}

export default SearchList;
