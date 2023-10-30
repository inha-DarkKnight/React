import React from 'react';
import '../css/Monitor.css';
import Head from '../Main/Header'

interface MonitorItem {
    감시이름: string;
    항공사: string;
    출발지: string;
    도착지: string;
    출발날짜: string;
}

interface MonitorProps {
    data: MonitorItem[];
}

function Monitor({ data }: MonitorProps) {

    const onDelete = (index: number) => {
        console.log(`항목 ${index}가 삭제되었습니다.`);
        // 실제 삭제 로직
    }

    return (
      <div className="monitor-container">
          <h3>감시중인 항목</h3>
          {data.map((item, index) => (
              <div key={index} className="monitor-wrapper">
                  <div className="monitor-name">{item.감시이름}</div>
                  <div className="monitor-box">
                      <div className="monitor-details">
                          <div>{item.항공사}</div>
                          <div>{item.출발지}</div>
                          <div>{item.도착지}</div>
                          <div>{item.출발날짜}</div>
                      </div>
                      <button className="delete-button" onClick={() => onDelete(index)}></button>
                  </div>
              </div>
          ))}
      </div>
  );
}

export default Monitor;
