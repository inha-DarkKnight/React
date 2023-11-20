import { useState, useEffect } from 'react';
import List from './List'
import Flatpickr from "react-flatpickr";
import '../css/main.css'
import '../css/Search.css';
import "flatpickr/dist/themes/material_green.css";
import airports from '../json/IATA_airport.json'; // JSON 파일을 가져옴
import { Airport, FlightData } from '../type/types';
import '../css/Loading.css';
import loadgif from '../images/Loading.gif';
  
  
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
        isSoldOut: false,
        timeTaken : "1115"          
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
        isSoldOut: false,
        timeTaken : "1115"
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
        isSoldOut: false,
        timeTaken : "1115"
      }
    ]
  }
];

function Search() {
  const [showError, setShowError] = useState(false);
  const [title, settitle] = useState("");
  const [airline, setAirline] = useState("");
  const [destination, setDestination] = useState(""); //실제 IATA코드
  const [departure, setDeparture] = useState("");
  const [destinationName, setDestinationName] = useState("");
  const [departureName, setDepartureName] = useState("");
  const [departureDate_temp, setdepartureDate_temp] = useState(new Date());
  const [hasSearched, setHasSearched] = useState(false);
  const [flightData, setFlightData] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Airport[]>([]);
  const [departureSuggestions, setDepartureSuggestions] = useState<Airport[]>([]);  
  const [isDepartureFocused, setIsDepartureFocused] = useState(false);
  const [isDestinationFocused, setIsDestinationFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const flag = '0';

  async function fetchMonitoringTickets() {
    try {
      const response = await fetch(`${process.env.REACT_APP_WAS_URL}/Monitoring/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
  
      const tickets:FlightData[] = await response.json();
      return tickets;
    } catch (error) {
      console.error("Monitoring Tickets 가져오기 실패", error);
      return [];
    }
  }
  
  async function generateTitle(): Promise<string> {
    const tickets = await fetchMonitoringTickets();
    const lastNumber = tickets
      .map((ticket: FlightData) => ticket.title.match(/감시이름_(\d+)/))
      .filter((match): match is RegExpMatchArray => match !== null)
      .map((match: RegExpMatchArray) => parseInt(match[1], 10))
      .reduce((max: number, num: number) => num > max ? num : max, 0);
  
    return `감시이름_${lastNumber + 1}`;
  }

  {/* 추천검색어 로직 */}
  useEffect(() => {
    if (destinationName.length > 0) {
      const matchedAirports = airports.filter(airport =>
        airport.airportName_ko.toLowerCase().includes(destinationName.toLowerCase()) && 
        airport.IATA
      );
      setDestinationSuggestions(matchedAirports);
    } else {
      setDestinationSuggestions([]);
    }
  }, [destinationName]);
  
  useEffect(() => {
    if (departureName.length > 0) {
      const matchedAirports = airports.filter(airport =>
        airport.airportName_ko.toLowerCase().includes(departureName.toLowerCase()) &&
        airport.IATA
      );
      setDepartureSuggestions(matchedAirports);
    } else {
      setDepartureSuggestions([]);
    }
  }, [departureName]);
  const handleDestinationAirport = (airport: Airport) => {
    setDestinationName(airport.airportName_ko); // 도착지 이름을 설정
    setDestination(airport.IATA); // 도착지의 IATA 코드를 설정
    setDestinationSuggestions([]); // 도착지 추천 목록을 비움
  };
  const handleDepartureAirport = (airport: Airport) => {
    setDepartureName(airport.airportName_ko); // 도착지 이름을 설정
    setDeparture(airport.IATA); // 도착지의 IATA 코드를 설정
    setDepartureSuggestions([]); // 도착지 추천 목록을 비움
  };

  const handleDepartureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && departureSuggestions.length > 0) {
      const selectedAirport = departureSuggestions[0];
      setDepartureName(selectedAirport.airportName_ko);
      setDeparture(selectedAirport.IATA);
      setDepartureSuggestions([]);
      e.preventDefault();
    }
  };
  
  const handleDestinationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && destinationSuggestions.length > 0) {
      const selectedAirport = destinationSuggestions[0];
      setDestinationName(selectedAirport.airportName_ko);
      setDestination(selectedAirport.IATA);
      setDestinationSuggestions([]);
      e.preventDefault();
    }
  };
  const handleDepartureBlur = () => {
    setTimeout(() => {
      setIsDepartureFocused(false);
    }, 100);
  };
  
  const handleDestinationBlur = () => {
    setTimeout(() => {
      setIsDestinationFocused(false);
    }, 100);
  };
  
 {/* 추천검색어 로직 */}


  async function handleSearch() {
    /*
*/
    
function formatDate(dateString:string) :string {
    const date = new Date(dateString);
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');

    return `${year}${month}${day}`;
}
    if (destinationName && departureName && departureDate_temp) {
      setShowError(false);
      setIsLoading(true);  
      if (!title) {
        try {
          const newTitle = await generateTitle();
          settitle(newTitle);
        } catch (error) {
          console.error("새로운 감시 이름을 생성하는 데 실패했습니다:", error);
          return; // 새 title 생성에 실패하면 검색을 중단
        }
      }    
      try {
        
        const formattedDate = departureDate_temp.toISOString().split('T')[0];
        const formattedDate2 = formattedDate.toString();
        const departureDate = formatDate(formattedDate2);

        const queryParams = new URLSearchParams({
          flag,
          destination,
          departure,
          departureDate,
        }).toString();
        console.log(destination, departure)
        const response = await fetch(`${process.env.REACT_APP_SPIDER_BOT_URL}/spiderbot/list?${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        //yyyymmdd //string
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const result = await response.json();
        setFlightData(result);
        setHasSearched(true);
      } catch (error) {
        console.error("목록을 가져오는 중 에러 발생", error);
        setShowError(true);
        
      } finally {
        setIsLoading(false);  // 로딩 종료
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
            placeholder="감시이름_001(공란허용)"
            className="monitor-name-input"
            value={title}
            onChange={(e) => settitle(e.target.value)}
          />
        </div>
        <div className="search-container">
          {/*
          <div className="search-item">
            <span className="search-label">항공사</span>
            <input
              type="text"
              placeholder="항공사"
              value={airline}
              onChange={(e) => setAirline(e.target.value)}
            />
          </div>*/}
  
          <div className="search-item">
            <span className="search-label">출발지</span>
            <input
              type="text"
              placeholder="출발지"
              value={departureName}
              onChange={(e) => setDepartureName(e.target.value)}
              onFocus={() => setIsDepartureFocused(true)}
              onBlur={handleDepartureBlur}
              onKeyDown={handleDepartureKeyDown}        
            />
            {departureSuggestions.length > 0 && (
              <div className="suggestions-popup">
                {isDepartureFocused && departureSuggestions.map((airport) => (
                  <div key={airport.IATA} onClick={() => handleDepartureAirport(airport)}>
                    {airport.airportName_ko}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="search-item">
            <span className="search-label">도착지</span>
            <input
              type="text"
              placeholder="도착지"
              value={destinationName}
              onChange={(e) => setDestinationName(e.target.value)}
              onFocus={() => setIsDestinationFocused(true)}
              onBlur={handleDestinationBlur}
              onKeyDown={handleDestinationKeyDown}
            />
            {destinationSuggestions.length > 0 && (
              <div className="suggestions-popup">
                {isDestinationFocused && destinationSuggestions.map((airport) => (
                  <div key={airport.IATA} onClick={() => handleDestinationAirport(airport)}>
                    {airport.airportName_ko}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="search-item">
            <span className="search-label">날짜</span>
            <Flatpickr
              className="your-classname-if-needed"
              options={{ dateFormat: 'Y-m-d' }}
              onChange={(selecteddepartureDates) => setdepartureDate_temp(selecteddepartureDates[0])}
              placeholder="날짜 선택"
            />
          </div>
        </div>
        {isLoading && (
            <div className="loading-backdrop">
            <div className="loading-content">
              <img src={loadgif} alt="Loading..." />
            </div>
        </div>
        )}
        <button className="search-button" onClick={handleSearch}>검색</button>
      </div>
    </div>
  );
}


export default Search;


