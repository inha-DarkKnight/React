import Monitor from './Monitor'


const sampleData = [
    {
        감시이름: '감시항목_001',
        항공사: 'All',
        출발지: '서울(인천)',
        도착지: '도쿄(나리타)',
        출발날짜: '2023.09.30'
    },
    {
        감시이름: '감시항목_002',
        항공사: '대한항공',
        출발지: '서울(인천)',
        도착지: '뉴욕(케네디)',
        출발날짜: '2023.11.02'
    }
];

function MonitorPage() {
    return <Monitor data={sampleData} />;
}

export default MonitorPage;
