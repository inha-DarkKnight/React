import { useEffect, useState } from 'react';
import Result from './Result';
import { Stopover, FlightData } from '../type/types';

interface FlightData_no {
  request_id: string;
  flightData: {
    stopover: Stopover[];
  };
}

function SearchList() {
  const [data, setData] = useState<FlightData[]>([]);

  useEffect(() => {
    const fetchExistList = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_WAS_URL}/monitoring/existlist`);
        const existListData: FlightData_no[] = await response.json();

        // 데이터 구조 변경
        const transformedData = existListData.map(item => ({
          request_id: item.request_id,
          stopover: item.flightData.stopover
        }));
        setData(transformedData);
      } catch (error) {
        console.error("Fetching exist list failed", error);
      }
    };

    fetchExistList();
  }, []);
  
  return <Result data={data} />;
}

export default SearchList;
