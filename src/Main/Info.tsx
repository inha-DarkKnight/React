import '../css/info.css';

interface Stopover {
    항공사: string;
    코드: string;
    출발: Date;
    도착: Date;
    우등석여부: string;
    인터넷가격: number;
    출발공항: string;
    도착공항: string;
}

const calculateDuration = (start: Date, end: Date) => {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}시간 ${minutes}분`;
};

const calculateWaitingTime = (end: Date, start: Date) => {
    const diff = start.getTime() - end.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}시간 ${minutes}분`;
};

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
        <div className="info-overlay" onClick={handleBackgroundClick}>
            <div className="info-popup">
                {data.map((stop, index) => {
                    const duration = calculateDuration(stop.출발, stop.도착);
                    return (
                        <div key={index} className="stopover-section">
                            <h3>{stop.항공사} {stop.코드}</h3>
                            <div className="table-row">
                                <span className="duration-cell">{duration}</span>
                                <div className="time-cell">
                                    <p>{stop.출발.toLocaleTimeString()} {stop.출발공항}</p>
                                    <p>{stop.도착.toLocaleTimeString()} {stop.도착공항}</p>
                                </div>
                            </div>
                            {index !== data.length - 1 && (
                                <div className="waiting-time">
                                    <span>공항 내 연결: {calculateWaitingTime(stop.도착, data[index + 1].출발)}</span>
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