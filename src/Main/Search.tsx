import { useState } from 'react';
import List from './List'
import Flatpickr from "react-flatpickr";
import '../css/main.css'
import '../css/Search.css';
import "flatpickr/dist/themes/material_green.css";


function Search() {

  const sampleData = [
    {
      stopover: [
        {
          airline: "ASIANA AIRLINES",
          flightNumber: "OZ0108",
          departureDate: new Date("2023-01-01T18:30:00"),
          destinationDate: new Date("2023-01-01T19:30:00"),
          price: 320700,
          departure: "인천국제공항",
          destination: "오사카",
          link: "https://www.asianaairlines.com",
          isSoldOut: false
        },
        {
          airline: "ASIANA AIRLINES",
          flightNumber: "OZ0110",
          departureDate: new Date("2023-01-01T20:00:00"),
          destinationDate: new Date("2023-01-01T21:00:00"),
          price: 200000,
          departure: "오사카",
          destination: "도쿄 나리타",
          link: "https://www.asianaairlines.com",
          isSoldOut: false
        }
      ]
    },
    {
      stopover: [
        {
          airline: "AIR SEOUL",
          flightNumber: "RS0704",
          departureDate: new Date("2023-01-01T20:25:00"),
          destinationDate: new Date("2023-01-01T22:50:00"),
          price: 420700,
          departure: "인천국제공항",
          destination: "도쿄 나리타",
          link: "https://www.airseoul.com",
          isSoldOut: false
        }
      ]
    }
  ];
  

  const [showError, setShowError] = useState(false);
  const [title, settitle] = useState("");
  const [airline, setAirline] = useState("");
  const [destination, setDestination] = useState("");
  const [departure, setDeparture] = useState("");
  const [departureDate, setdepartureDate] = useState(new Date());
  const [hasSearched, setHasSearched] = useState(false);
  const [flightData, setFlightData] = useState([]);

  async function handleSearch() {
    if (title && airline && destination && departure && departureDate) {
      setShowError(false);
      setHasSearched(true);
  
      try {
        const formattedDate = departureDate.toISOString().split('T')[0];
        const queryParams = new URLSearchParams({
          airline,
          destination,
          departure,
          departureDate: formattedDate
        }).toString();
        
        const response = await fetch(`http://localhost:8080/spiderbot/list?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        setFlightData(result);
      } catch (error) {
        console.error("목록을 가져오는 중 에러 발생", error);
        setShowError(true);
      }
  
    } else {
      setShowError(true);
      window.alert('입력값을 모두 입력해주세요');
      setHasSearched(false);
    }
  };
  
  
  if (hasSearched && !showError) { // 검색이 진행되었으며, 에러가 아닐 경우에만 List 컴포넌트를 보여줌
    return <List title={title} data={flightData} />;
  }
  else if (hasSearched && showError) { // 검색이 진행되었으며, 에러일경우(현재는 목록을 못갖고오는상태)
    return <List title={title} data={sampleData} />;
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
            value={title}
            onChange={(e) => settitle(e.target.value)}
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
              onChange={(selecteddepartureDates) => setdepartureDate(selecteddepartureDates[0])}
              placeholder="날짜 선택"
            />
          </div>
        </div>
        <button className="search-button" onClick={handleSearch}>검색</button>
      </div>
    </div>
  );
}


export default Search;


