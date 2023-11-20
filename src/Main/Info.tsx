import '../css/info.css';
import { Stopover } from '../type/types';
import airportData from '../json/IATA_airport.json';


function calculateDuration(timeTaken: string) {
    // "직항" 또는 "경유" 부분을 정규식으로 제거하고 숫자만 추출
    const timeMatch = timeTaken.match(/(\d+)시간 (\d+)분/);
    if (timeMatch) {
        const hours = parseInt(timeMatch[1]);
        const minutes = parseInt(timeMatch[2]);
        return `${hours}시간 ${minutes}분`;
    } else {
        return "잘못된 형식";
    }
}
function getAirportNameByIATACode(iataCode:string) {
    const airport = airportData.find(airport => airport.IATA === iataCode);
    return airport ? airport.airportName_ko : iataCode;
}
  
function calculateWaitingTime(end: Date, start: Date) {
    if (start < end) {
        start = new Date(start.getTime() + (24 * 60 * 60 * 1000));
    }

    const diff = start.getTime() - end.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}시간 ${minutes}분`;
}

interface InfoProps {
    isOpen: boolean;
    data: Stopover[] | null;
    onClose: () => void;
}


function Info({ isOpen, data, onClose }: InfoProps) {
    if (!isOpen || !data) return null;

    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        
        <div className="info-overlay info-fade-in-down" onClick={handleBackgroundClick}>
            <div className="info-popup">
                {data.map((stop, index) => {
                    return (
                        <div key={index} className="stopover-section">
                            <h3>{stop.airline} {stop.flightNumber}</h3>
                            <div className="table-row">
                                <span className="duration-cell">{calculateDuration(stop.timeTaken)}</span>
                                <div className="time-cell">
                                <p>{stop.departureDate.toLocaleTimeString()} {getAirportNameByIATACode(stop.departure)}</p>
                                    <p>{stop.destinationDate.toLocaleTimeString()} {getAirportNameByIATACode(stop.destination)}</p>
                                </div>
                            </div>
                            {index !== data.length - 1 && (
                                <div className="waiting-time">
                                    <span>공항 내 연결: {calculateWaitingTime(stop.destinationDate, data[index + 1].departureDate)}</span> {/* 연결시간 수정필요 */}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}



export default Info;