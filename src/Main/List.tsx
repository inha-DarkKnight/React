import React, { useState } from 'react';
import '../css/List.css'
import Info from './Info'

interface Stopover {
    항공사: string;
    코드 : string;
    출발: Date;
    도착: Date;
    우등석여부 : string;
    인터넷가격: number;
    출발공항: string;
    도착공항: string;
  }
  
  interface FlightData {
    stopover?: Stopover[];
  }

interface ListProps {
  title: string;
  data: FlightData[];
}

function List({ title, data }: ListProps) {
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


    return (
        <div className="list-container">
          <h3>{title}에서 {data.length}개의 결과를 찾았습니다!</h3>
          <table>
          <thead>
            <tr>
                <th></th>
                <th>구분</th>
                <th>코드</th>
                <th>출발시간</th>
                <th>도착시간</th>
                <th>우등석여부</th>
                <th>인터넷가격</th>
                <th>출발공항</th>
                <th>도착공항</th>
                <th>소요시간</th>
                <th>예약링크</th>
            </tr>
            </thead>
            <tbody>
              {data.map((flight, index) => {
                const isFirstStopover = flight.stopover && flight.stopover[0];
                const isLastStopover = flight.stopover && flight.stopover[flight.stopover.length - 1];
    
                const totalInternetPrice = flight.stopover ? flight.stopover.reduce((sum, stop) => sum + stop.인터넷가격, 0) : 0;
                        // 소요시간 계산
                let duration = 'N/A';
                if (isFirstStopover && isLastStopover) {
                    duration = calculateDuration(isFirstStopover.출발, isLastStopover.도착);
                }

                return (
                  <tr key={index}>
                    <td>{isFirstStopover ? isFirstStopover.항공사 : 'N/A'}</td>
                    <td>
                    <td>
                      {flight.stopover && flight.stopover.length === 1 ? "직항" : (
                        <a href="#" onClick={(e) => {
                          e.preventDefault();
                          handleOpenInfo(flight.stopover!);  // stopover 리스트를 Info 컴포넌트로 전달
                        }}>
                          경유
                        </a>)}
                    </td>
                    </td>
                    <td>{isFirstStopover ? isFirstStopover.코드 : 'N/A'}</td>
                    <td>{isFirstStopover ? isFirstStopover.출발.toLocaleTimeString() : 'N/A'}</td>
                    <td>{isLastStopover ? isLastStopover.도착.toLocaleTimeString() : 'N/A'}</td>
                    <td>{isFirstStopover ? isFirstStopover.우등석여부 : 'N/A'}</td>
                    <td>{totalInternetPrice}</td>
                    <td>{isFirstStopover ? isFirstStopover.출발공항 : 'N/A'}</td>
                    <td>{isLastStopover ? isLastStopover.도착공항 : 'N/A'}</td>
                    <td>{duration}</td>
                    <td><a href="#">바로가기</a></td>
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