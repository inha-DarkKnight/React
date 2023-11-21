import { useEffect, useState } from 'react';
import Result from './Result'
import { Stopover,FlightData } from '../type/types';



interface FlightData_no {
  title: string;
  request_id: string;
  flightData: {
    stopover: Stopover[];
  }
}

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
        isSoldOut: false,
        timeTaken : "1115"
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
        isSoldOut: false,
        timeTaken : "0509"
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
        isSoldOut: false,
        timeTaken : "1115"
      }
    ]
  }
];

function SearchList() {
  const [data, setData] = useState<FlightData[]>([]);

  useEffect(() => {
    const fetchExistList = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_WAS_URL}/monitoring/existlist`);
        const existListData = await response.json();
        const existRequestIds = existListData.map((item: { _id: string; request_id: string }) => item.request_id);
    
        fetchMonitoringList(existRequestIds);
      } catch (error) {
        console.error("Fetching exist list failed", error);
      }
    };
    
    const fetchMonitoringList = async (existRequestIds: string[]) => {
      try {
        const response = await fetch(`${process.env.REACT_APP_WAS_URL}/monitoring/list`);
        const monitoringList: FlightData_no[] = await response.json();
        const filteredData = monitoringList.filter(item => existRequestIds.includes(item.request_id));
        // 데이터 구조 변경
        const transformedData = filteredData.map(item => ({
          request_id: item.request_id,
          stopover: item.flightData.stopover,
          title: item.title,
        }));
        setData(transformedData);
      } catch (error) {
        console.error("Fetching monitoring list failed", error);
      }
    };

    fetchExistList();
  }, []);
  
  return <Result data={data} />;
}

export default SearchList;
