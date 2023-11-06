import { useEffect, useState } from 'react';
import Monitor from './Monitor'

interface MonitorItem {
    title: string;
    request_id: string;
    airline: string;
    departure: string;
    destination: string;
    departureDate: Date;
}

const sampleData = [
    {
        request_id: 'req_001',
        title: '감시항목_001',
        airline: '아시아나',
        departure: '서울(인천)',
        destination: '도쿄(나리타)',
        departureDate: new Date('2023-09-30')
    },
    {
        request_id: 'req_002',
        title: '감시항목_002',
        airline: '대한항공',
        departure: '서울(인천)',
        destination: '뉴욕(케네디)',
        departureDate: new Date('2023-11-02')
    }
];

function MonitorPage() {
    const [data, setData] = useState<MonitorItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/Monitoring/list'); 
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



    return <Monitor initialData={sampleData} />; //sampleData->data로 변경시 WAS와 통신
}

export default MonitorPage;
