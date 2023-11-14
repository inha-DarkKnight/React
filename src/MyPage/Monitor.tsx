import '../css/Monitor.css';
import React, { useState, useEffect } from 'react';

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
    title: string;
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


    const onDelete = async (request_id: string, index: number) => {
        try {
            const response = await fetch(`http://localhost:8080/monitoring/delete/${request_id}`, {
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

    return (
      <div className="monitor-container">
          <h3>감시중인 항목</h3>
          {data.map((item, index) => {
    const firstStopover = item.flightData.stopover[0];
    const lastStopover = item.flightData.stopover[item.flightData.stopover.length - 1];
    const departureDate = new Date(firstStopover.departureDate);

    return (
        <div key={index} className="monitor-wrapper">
                    <div className="monitor-name">{item.title}</div>
                    <div className="monitor-box">
                        <div className="monitor-details">
                            <div>{firstStopover.airline}</div>
                            <div>{firstStopover.departure}</div>
                            <div>{lastStopover.destination}</div>
                            <div>{
                                departureDate instanceof Date && !isNaN(departureDate.getTime()) 
                                ? departureDate.toLocaleDateString() 
                                : '날짜 정보 없음'
                            }</div>
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
