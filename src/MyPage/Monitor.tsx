import '../css/Monitor.css';
import { useState, useEffect } from 'react';
import airports from '../json/IATA_airport.json';

interface Stopover {
    flightNumber: string;
    departure: string;
    destination: string;
    departureDate: string;
    destinationDate: string;
    price: number;
    isSoldOut: boolean;
    link: string;
    airline: string;
}

interface MonitorItem {
    //title: string;
    request_id: string;
    flightData: {
        stopover: Stopover[];
    };
    email: string;
}
interface MonitorProps {
    initialData: MonitorItem[];
}

function Monitor({ initialData }: MonitorProps) { 
    console.log(initialData);
    const [data, setData] = useState<MonitorItem[]>(initialData);

    useEffect(() => {
        const updatedData = initialData.map(item => {
            const firstStopover = item.flightData.stopover[0];
            const lastStopover = item.flightData.stopover[item.flightData.stopover.length - 1];

            return {
                ...item,
                airline: firstStopover.airline,
                departure: firstStopover.departure,
                destination: lastStopover.destination,
                departureDate: new Date(firstStopover.departureDate)
            };
        });
        setData(updatedData);
    }, [initialData]);

    const findAirportNameByIata = (iataCode:string) => {
        const airport = airports.find(airport => airport.IATA === iataCode);
        return airport ? airport.airportName_ko : iataCode;
      };

    const onDelete = async (request_id: string, index: number) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_WAS_URL}/monitoring/delete/${request_id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다.');
            }
            console.log(`항목 ${request_id}가 삭제되었습니다.`);
            setData(prevData => prevData.filter(item => item.request_id !== request_id));
        } catch (error) {
            console.error('삭제 중 에러가 발생했습니다.', error);
        }
    };

    // 항공편 유형 (직항 또는 경유) 결정
    const getFlightType = (stopovers: Stopover[]) => {
        return stopovers.length > 1 ? "경유" : "직항";
    };

    // 모든 경유의 가격 합산
    const getTotalPrice = (stopovers: Stopover[]) => {
        return stopovers.reduce((sum, stopover) => sum + stopover.price, 0);
    };
    return (
      <div className="monitor-container">
          <h3>감시중인 항목</h3>
          {data.map((item, index) => {
    const firstStopover = item.flightData.stopover[0];
    const lastStopover = item.flightData.stopover[item.flightData.stopover.length - 1];
    const departureDateString = firstStopover.departureDate; // "2023-12-13T09:50:00.000Z"
    const departureDate = departureDateString.substring(0, 10); // "2023-12-13"

    const flightType = getFlightType(item.flightData.stopover);
    const totalPrice = getTotalPrice(item.flightData.stopover);


    return (
        <div key={index} className="monitor-wrapper">
                    {/*<div className="monitor-name">{item.title}</div>*/}
                    <div className="monitor-box">
                        <div className="monitor-details">
                            <div>{firstStopover.airline}</div>
                            <div>{flightType}</div>
                            <div>{firstStopover.flightNumber}</div>
                            <div>{findAirportNameByIata(firstStopover.departure)}</div>
                            <div>{findAirportNameByIata(lastStopover.destination)}</div>
                            <div>{totalPrice}원</div>
                            <div>{departureDate}</div>
                        </div>
                        <button className="delete-button" onClick={() => onDelete(item.request_id, index)}></button>
                    </div>
                </div>
            );
        })}
      </div>
  );
}

export default Monitor;
