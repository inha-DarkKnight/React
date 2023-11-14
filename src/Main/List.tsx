import { useState } from 'react';
import '../css/List.css'
import Info from './Info'
import { Stopover } from '../type/types';


  
interface FlightData {
    stopover?: Stopover[];
  }

interface ListProps {
  title: string;
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

function List({ title, data }: ListProps) {
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

    const calculateDuration = (start: Date, end: Date) => {
        const diff = end.getTime() - start.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}시간 ${minutes}분`;
      };

    const handleRegisterMonitoring = async (flightData: FlightData, email: string) => {
        const response = await fetch('http://localhost:8080/monitoring/register', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title,
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

    return (
        <div className="list-container">
          <h3>{title}에서 {processedData.length}개의 결과를 찾았습니다!</h3>
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
                <th>감시등록</th>
            </tr>
            </thead>
            <tbody>
              {processedData.map((flight, index) => {
                const isFirstStopover = flight.stopover && flight.stopover[0];
                const isLastStopover = flight.stopover && flight.stopover[flight.stopover.length - 1];
    
                const totalInternetPrice = flight.stopover ? flight.stopover.reduce((sum, stop) => sum + stop.price, 0) : 0;
                        // 소요시간 계산
                let duration = 'N/A';
                if (isFirstStopover && isLastStopover) {
                    duration = calculateDuration(isFirstStopover.departureDate, isLastStopover.destinationDate);
                }

                return (
                  <tr key={index}>
                    <td>{isFirstStopover ? isFirstStopover.airline : 'N/A'}</td>
                    <td>
                      {flight.stopover && flight.stopover.length === 1 ? "직항" : (
                        <a href="#" onClick={(e) => {
                          e.preventDefault();
                          handleOpenInfo(flight.stopover!);  // stopover 리스트를 Info 컴포넌트로 전달
                        }}>
                          경유
                        </a>)}
                    </td>
                    <td>{isFirstStopover ? isFirstStopover.flightNumber : 'N/A'}</td>
                    <td>{isFirstStopover ? isFirstStopover.departureDate.toLocaleTimeString() : 'N/A'}</td>
                    <td>{isLastStopover ? isLastStopover.destinationDate.toLocaleTimeString() : 'N/A'}</td>
                    <td>{totalInternetPrice}</td>
                    <td>{isFirstStopover ? isFirstStopover.departure : 'N/A'}</td>
                    <td>{isLastStopover ? isLastStopover.destination : 'N/A'}</td>
                    <td>{duration}</td>
                    <td><button onClick={() => handleRegisterMonitoring(flight, 'example@example.com')}>등록</button></td>
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