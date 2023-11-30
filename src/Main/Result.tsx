import { useState, useEffect } from 'react';
import '../css/List.css'
import Info from './Info'
import { Stopover, FlightData } from '../type/types';
import airports from '../json/IATA_airport.json';
import Err_Comp from './err_comp';


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

function Result({ data: initialData }: ListProps) {
    
    const [data, setData] = useState<FlightData[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [infoData, setInfoData] = useState<Stopover[] | null>(null);
    const processedData = convertDatesInData(data);

    useEffect(() => {
      setData(initialData);
    }, [initialData]);
    const isDataEmpty = data.length === 0;
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

    const getStopoverLinks = (stopovers: Stopover[]) => {
      return stopovers.map((stop, index) => (
        <a key={index} href={stop.link} target="_blank" rel="noopener noreferrer">{stop.flightNumber}</a>
      ));
    };

    const deleteAllResults = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_WAS_URL}/monitoring/exist-deleteall`, {
          method: 'DELETE'
        });
        if (response.ok) {
          // 성공적으로 삭제되면, UI 상태 업데이트
          setData([]);
          console.log("모든 결과가 성공적으로 삭제되었습니다.");
        } else {
          throw new Error("서버에서 삭제를 완료하지 못했습니다.");
        }
      } catch (error) {
        console.error("모든 결과 삭제 중 오류 발생", error);
      }
    };

  return (
    <div className="list-container">
      {isDataEmpty ? (
        <Err_Comp />
      ) : (
        <>
          <button className="delete-all-button" onClick={deleteAllResults}>
            모든 결과 삭제
          </button>
          <h3>결과를 찾았습니다!</h3>
          <table>
            <thead>
              <tr>
                <th>항공사</th>
                <th>구분</th>
                <th>항공편코드</th>
                <th>출발시간</th>
                <th>도착시간</th>
                <th>가격</th>
                <th>출발지</th>
                <th>도착지</th>
                <th>소요시간</th>
                <th>최저가 구매링크</th>
              </tr>
            </thead>
            <tbody>
              {processedData.map((flight, flightIndex) => {
                const stopoverLinks = getStopoverLinks(flight.stopover);
                const firstStopover = flight.stopover[0];
                const lastStopover = flight.stopover[flight.stopover.length - 1];

                const departureAirportName = findAirportNameByIata(firstStopover.departure);
                const destinationAirportName = findAirportNameByIata(lastStopover.destination);

                const duration = calculateTotalDuration(flight.stopover);
                const totalPrice = calculateTotalPrice(flight.stopover);

                return (
                  <tr key={flightIndex}>
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
                    <td>{stopoverLinks.length > 1 ? stopoverLinks : stopoverLinks[0]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Info isOpen={isOpen} data={infoData} onClose={handleCloseInfo} />
        </>
      )}
    </div>
  );
}

export default Result;