import React, { useState } from 'react';
import '../css/Result.css';
import ErrComp from './err_comp'
import Info from './Info'; 
import { Stopover } from '../type/types';
import { FlightData } from '../type/types';



interface ResultProps {
  data: FlightData[];
}

function Result({ data }: ResultProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [infoData, setInfoData] = useState<Stopover[] | null>(null);
  

  const availableFlights = data.filter(flight =>
    !flight.stopover.some(stop => stop.isSoldOut)
  );
  const isAllSoldOutOrEmpty = availableFlights.length === 0;

  const handleOpenInfo = (stopovers: Stopover[]) => {
    setInfoData(stopovers);
    setIsOpen(true);
  };
  
  if (isAllSoldOutOrEmpty) {
    return <ErrComp />; // 모든 항목이 매진되었거나 비어 있으면 ErrComp를 표시
  }

  const handleCloseInfo = () => {
    setIsOpen(false);
    setInfoData(null);
  };

  const calculateDuration = (start: Date, end: Date) => {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}시간 ${minutes}분`;
  };


return (
    <div className="search-list-container">
      {availableFlights.map((item, index) => {
        let isDirect = item.stopover.length <= 1;
        let firstDeparture = item.stopover[0]?.departureDate;
        let lastArrival = item.stopover[item.stopover.length - 1]?.destinationDate;
        let totalInternetPrice = item.stopover.reduce((acc, stop) => acc + stop.price, 0);
        let departureAirport = item.stopover[0]?.departure;
        let arrivalAirport = item.stopover[item.stopover.length - 1]?.destination;
        let TicketingLink = item.stopover[0]?.link;
  
        let totalDuration = firstDeparture && lastArrival ? calculateDuration(firstDeparture, lastArrival) : 'N/A';
  
        return (
          <div key={index} className="search-item">
            <h3>{item.title}에서 좌석을 찾았습니다!</h3>
            <table>
              <thead>
                <tr>
                  <th>항공사</th>
                  <th>코드</th>
                  <th>구분</th> 
                  <th>출발시간</th>
                  <th>도착시간</th>
                  <th>가격</th>
                  <th>출발지</th>
                  <th>도착지</th>
                  <th>소요시간</th>
                  <th>예매링크</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{item.stopover[0]?.airline}</td>
                  <td>{item.stopover[0]?.flightNumber}</td>
                  <td>
                    {isDirect ? (
                      '직항'
                    ) : (
                      <a href="#" onClick={(e) => {
                          e.preventDefault();
                          handleOpenInfo(item.stopover);
                        }}>경유</a>
                    )}
                  </td>
                  <td>{firstDeparture?.toLocaleTimeString()}</td>
                  <td>{lastArrival?.toLocaleTimeString()}</td>
                  <td>{totalInternetPrice.toLocaleString()}원</td>
                  <td>{departureAirport}</td>
                  <td>{arrivalAirport}</td>
                  <td>{totalDuration}</td>
                  <td><a href={TicketingLink}>link</a></td>
                </tr>
              </tbody>
            </table>
            <Info isOpen={isOpen} data={infoData} onClose={handleCloseInfo} />
          </div>
        );
      })}
    </div>
  );
  
}

export default Result;
