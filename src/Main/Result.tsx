import { useState } from 'react';
import '../css/List.css'
import Info from './Info'
import { Stopover, FlightData } from '../type/types';
import airports from '../json/IATA_airport.json';


interface ListProps {
  data: FlightData[];
}


function convertDatesInData(data: FlightData[]) { //Date로 변경
  return data.map(flight => ({
    ...flight,
    stopover: flight.stopover?.map(stop => ({
      ...stop,
      departureDate: new Date(stop.departureDate),
      destinationDate: new Date(stop.destinationDate)
    }))
  }));
}

function Result({ data }: ListProps) {
    console.log(data);
    const processedData = convertDatesInData(data);

    const [isOpen, setIsOpen] = useState(false);
    const [infoData, setInfoData] = useState<Stopover[] | null>(null);
  
    const handleOpenInfo = (stopovers: Stopover[]) => {
      setInfoData(stopovers);
      setIsOpen(true);
    };
  
    const handleCloseInfo = () => {
      setIsOpen(false);
      setInfoData(null);
    };
    const parseDuration = (durationString: string) => {
      if (!durationString) {
        return 0; // 기본값을 0으로 설정
      }
      
      const matches = durationString.match(/(\d+)시간 (\d+)분/);
      if (matches && matches.length === 3) {
        const hours = parseInt(matches[1], 10);
        const minutes = parseInt(matches[2], 10);
        return hours * 60 + minutes;
      }
      
      return 0; // 형식 오류 등의 경우도 0으로 처리
    };
    
    const calculateTotalDuration = (stopovers: Stopover[]) => {
      
      const totalMinutes = stopovers.reduce((sum, stop) => {
          const timeTakenMinutes = parseDuration(stop.timeTaken);
          return sum + timeTakenMinutes;
      }, 0);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}시간 ${minutes}분`;
    };
    
    const checkIfSoldOut = (stopovers: Stopover[]) => {
      return stopovers.some(stop => stop.isSoldOut);
    };

    const calculateTotalPrice = (stopovers: Stopover[]) => {
      const isSoldOut = checkIfSoldOut(stopovers);
      if (isSoldOut) {
        return "매진됨";
      }
      return stopovers.reduce((sum, stop) => sum + stop.price, 0);
    };
    const findAirportNameByIata = (iataCode:string) => {
      const airport = airports.find(airport => airport.IATA === iataCode);
      return airport ? airport.airportName_ko : iataCode;
    };

    return (
      <div className="list-container">
        {processedData.map((flight, flightIndex) => {
          const firstStopover = flight.stopover[0];
          const lastStopover = flight.stopover[flight.stopover.length - 1];

          const departureAirportName = findAirportNameByIata(firstStopover.departure);
          const destinationAirportName = findAirportNameByIata(lastStopover.destination);

          const duration = calculateTotalDuration(flight.stopover);
          const totalPrice = calculateTotalPrice(flight.stopover);

          return (
            <div key={flightIndex}>
              <h3>{flight.title}에서 결과를 찾았습니다!</h3>
              <table>
                <thead>
                  <tr>
                    <th>항공사</th>
                    <th>구분</th>
                    <th>코드</th>
                    <th>출발시간</th>
                    <th>도착시간</th>
                    <th>가격</th>
                    <th>출발지</th>
                    <th>도착지</th>
                    <th>소요시간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{firstStopover.airline}</td>
                    <td>{flight.stopover.length === 1 ? "직항" : (
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleOpenInfo(flight.stopover);
                      }}>
                        경유
                      </a>)}
                    </td>
                    <td>{firstStopover.flightNumber}</td>
                    <td>{firstStopover.departureDate.toLocaleTimeString()}</td>
                    <td>{lastStopover.destinationDate.toLocaleTimeString()}</td>
                    <td>{totalPrice}</td>
                    <td>{departureAirportName}</td>
                    <td>{destinationAirportName}</td>
                    <td>{duration}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
        <Info isOpen={isOpen} data={infoData} onClose={handleCloseInfo} />
      </div>
    );
}

export default Result;