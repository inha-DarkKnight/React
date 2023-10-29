import { useState } from 'react';
import Err_Comp from './err_comp'
import List from './List'
import Flatpickr from "react-flatpickr";
import '../css/main.css'
import '../css/Search.css';
import "flatpickr/dist/themes/material_green.css";

function useSearch(){}
function SearchButton(){}



function Search() {
  const [showError, setShowError] = useState(false);
  const [monitorName, setMonitorName] = useState("");
  const [airline, setAirline] = useState("");
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState("");
  const [date, setDate] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  

  const sampleData = [
    {
      stopover: [
        {
          항공사: "ASIANA AIRLINES",
          코드: "OZ0108",
          출발: new Date("2023-01-01T18:30:00"),
          도착: new Date("2023-01-01T19:30:00"),
          우등석여부: "일반석",
          인터넷가격: 320700,
          출발공항: "인천국제공항",
          도착공항: "오사카"
        },
        {
          항공사: "ASIANA AIRLINES",
          코드: "OZ0110",
          출발: new Date("2023-01-01T20:00:00"),
          도착: new Date("2023-01-01T21:00:00"),
          우등석여부: "일반석",
          인터넷가격: 200000,
          출발공항: "오사카",
          도착공항: "도쿄 나리타"
        }
      ]
    },
    {
      stopover: [
        {
          항공사: "AIR SEOUL",
          코드: "RS0704",
          출발: new Date("2023-01-01T20:25:00"),
          도착: new Date("2023-01-01T22:50:00"),
          우등석여부: "일반석",
          인터넷가격: 420700,
          출발공항: "인천국제공항",
          도착공항: "도쿄 나리타"
        }
      ]
    }
  ];

  const handleSearch = () => {
    if (monitorName || airline || destination || departure || date) {
      setShowError(false);
      setHasSearched(true);  // 검색 버튼을 클릭했음을 표시
    } else {
      setShowError(true);
      setHasSearched(false); // 검색 버튼을 클릭했지만 입력값이 없으므로 false로 설정
    }
  };
  
  if (showError) {
    return <Err_Comp />;
  }
  
  if (hasSearched && !showError) { // 검색이 진행되었으며, 에러가 아닐 경우에만 List 컴포넌트를 보여줌
    return <List title="항공편_001" data={sampleData} />;
  }
  
  return (
    <div>
      <div className="search-main-container">
        <div className="monitor-name-container">
          <span className="monitor-name-label">감시이름</span>
          <input
            type="text"
            placeholder="감시이름_001"
            className="monitor-name-input"
            value={monitorName}
            onChange={(e) => setMonitorName(e.target.value)}
          />
        </div>
        <div className="search-container">
          <div className="search-item">
            <span className="search-label">항공사</span>
            <input
              type="text"
              placeholder="항공사"
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
            />
          </div>
  
          <div className="search-item">
            <span className="search-label">도착지</span>
            <input
              type="text"
              placeholder="도착지"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
  
          <div className="search-item">
            <span className="search-label">출발지</span>
            <input
              type="text"
              placeholder="출발지"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            />
          </div>
          <div className="search-item">
            <span className="search-label">날짜</span>
            <Flatpickr
              className="your-classname-if-needed"
              options={{ dateFormat: 'Y-m-d' }}
              onChange={(selectedDates) => setDate(selectedDates[0].toISOString().split('T')[0])}
              placeholder="날짜 선택"
            />
          </div>
        </div>
        <button className="search-button" onClick={handleSearch}>감시</button>
      </div>
    </div>
  );
}


export default Search;