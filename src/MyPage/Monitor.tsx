import '../css/Monitor.css';
import React, { useState, useEffect } from 'react';

interface MonitorItem {
    title: string;
    request_id: string;
    airline: string;
    departure: string;
    destination: string;
    departureDate: Date;
}

interface MonitorProps {
    initialData: MonitorItem[];
}

function Monitor({ initialData }: MonitorProps) { 
    const [data, setData] = useState<MonitorItem[]>(initialData);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const onDelete = async (request_id: string, index: number) => {
        try {
            const response = await fetch(`/monitoring/delete/${request_id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('네트워크 응답이 올바르지 않습니다.');
            }
            console.log(`항목 ${request_id}가 삭제되었습니다.`);
            setData(prevData => prevData.filter(item => item.request_id !== request_id)); //상태업뎃
        } catch (error) {
            console.error('삭제 중 에러가 발생했습니다.', error);
        }
    };

    return (
      <div className="monitor-container">
          <h3>감시중인 항목</h3>
          {data.map((item, index) => (
              <div key={index} className="monitor-wrapper">
                  <div className="monitor-name">{item.title}</div>
                  <div className="monitor-box">
                      <div className="monitor-details">
                          <div>{item.airline}</div>
                          <div>{item.departure}</div>
                          <div>{item.destination}</div>
                          <div>{item.departureDate.toLocaleDateString()}</div>
                      </div>
                      <button className="delete-button" onClick={() => onDelete(item.request_id, index)}></button>
                  </div>
              </div>
          ))}
      </div>
  );
}

export default Monitor;
