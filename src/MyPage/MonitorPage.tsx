import { useEffect, useState } from 'react';
import Monitor from './Monitor'

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

function MonitorPage() {
    const [data, setData] = useState<MonitorItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8080/monitoring/list'); 
                if (!response.ok) {
                    throw new Error('네트워크 에러');
                }
                const jsonData = await response.json();
                setData(jsonData); //데이터셋
            } catch (error) {
                console.error("데이터 fetch 에러", error);
            }
        };

        fetchData(); // 데이터 가져옴
    }, []);
    return <Monitor initialData={data} />; //sampleData->data로 변경시 WAS와 통신하여 가져옴
}

export default MonitorPage;
