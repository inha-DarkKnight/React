import { useState } from 'react';
import '../css/List.css'
import Info from './Info'
import { Stopover } from '../type/types';
import airports from '../json/IATA_airport.json';

const email = "casdfghjke@naver.com";
  
interface FlightData {
    stopover?: Stopover[];
  }

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

function List({ data }: ListProps) {
  
    console.log(data)
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
        const matches = durationString.match(/(\d+)시간 (\d+)분/);
        if (matches && matches.length === 3) {
            const hours = parseInt(matches[1], 10);
            const minutes = parseInt(matches[2], 10);
            return hours * 60 + minutes;
        }
        return 0;
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


    const handleRegisterMonitoring = async (flightData: FlightData) => {
        const response = await fetch(`${process.env.REACT_APP_WAS_URL}/monitoring/register`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                flightData,
                email
            })
        });

        if (response.ok) {
            console.log("감시 항목이 성공적으로 등록되었습니다.");
            window.alert('감시 항목 등록성공');
        } else {
            console.error("감시 항목 등록에 실패했습니다.");
            window.alert('감시 항목 등록 실패, 네트워크 에러');
        }
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
          <h3>{processedData.length}개의 결과를 찾았습니다!</h3>
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
                <th>매진여부</th>
                <th>감시등록</th>
            </tr>
            </thead>
            <tbody>
              {processedData.map((flight, index) => {
                const isFirstStopover = flight.stopover && flight.stopover[0];
                const isLastStopover = flight.stopover && flight.stopover[flight.stopover.length - 1];
                const departureIata = isFirstStopover ? isFirstStopover.departure : null;
                const destinationIata = isLastStopover ? isLastStopover.destination : null;
                const departureAirportName = departureIata ? findAirportNameByIata(departureIata) : 'N/A';
                const destinationAirportName = destinationIata ? findAirportNameByIata(destinationIata) : 'N/A';
        
                const isSoldOut = flight.stopover ? checkIfSoldOut(flight.stopover) : false;
                const totalPrice = flight.stopover ? flight.stopover.reduce((sum, stop) => sum + stop.price, 0) : 0;
                const displayPrice = isSoldOut ? "매진됨" : totalPrice;
                        // 소요시간 계산
                        
                let duration = 'N/A';
                if (flight.stopover && flight.stopover.length > 0) {
                  duration = calculateTotalDuration(flight.stopover);
              }

                return (
                  <tr key={index}>
                    <td>{isFirstStopover ? isFirstStopover.airline : 'N/A'}</td>
                    <td>
                      {flight.stopover && flight.stopover.length === 1 ? "직항" : (
                        <a href="#" onClick={(e) => {
                          e.preventDefault();
                          handleOpenInfo(flight.stopover!);
                        }}>
                          경유
                        </a>)}
                    </td>
                    <td>{isFirstStopover ? isFirstStopover.flightNumber : 'N/A'}</td>
                    <td>{isFirstStopover ? isFirstStopover.departureDate.toLocaleTimeString() : 'N/A'}</td>
                    <td>{isLastStopover ? isLastStopover.destinationDate.toLocaleTimeString() : 'N/A'}</td>
                    <td>{displayPrice}</td>
                    <td>{departureAirportName}</td>
                    <td>{destinationAirportName}</td>
                    <td>{duration}</td>
                    <td>{isSoldOut ? "매진됨" : "매진안됨"}</td>
                    <td><button onClick={() => handleRegisterMonitoring(flight)}>감시 등록</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Info isOpen={isOpen} data={infoData} onClose={handleCloseInfo} />
        </div>
      );
}

export default List;