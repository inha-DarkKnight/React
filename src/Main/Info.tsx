import '../css/info.css';
import { Stopover } from '../type/types';


function calculateDuration(start: Date, end: Date) {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}시간 ${minutes}분`;
  }
  
  function calculateWaitingTime(end: Date, start: Date) {
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

// ... (다른 부분은 동일하므로 생략)

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
                    const duration = calculateDuration(stop.departureDate, stop.destinationDate);
                    return (
                        <div key={index} className="stopover-section">
                            <h3>{stop.airline} {stop.flightNumber}</h3>
                            <div className="table-row">
                                <span className="duration-cell">{duration}</span>
                                <div className="time-cell">
                                    <p>{stop.departureDate.toLocaleTimeString()} {stop.departure}</p>
                                    <p>{stop.destinationDate.toLocaleTimeString()} {stop.destination}</p>
                                </div>
                            </div>
                            {index !== data.length - 1 && (
                                <div className="waiting-time">
                                    <span>공항 내 연결: {calculateWaitingTime(stop.destinationDate, data[index + 1].departureDate)}</span>
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