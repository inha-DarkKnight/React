import { useState, useEffect} from 'react';
import '../css/Header.css';
import alarm_icon from '../images/alarm.png'
import alarm_found from '../images/alarm_found.png'
import mypage_icon from '../images/mypage.png'
import logout_icon from '../images/logout_icon.png'
import Logo2_icon from '../images/logo2.png'
import { Link } from 'react-router-dom';



function Header() {
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_WAS_URL}/monitoring/existlist`);
                const data = await response.json();
                if (data && data.length > 0) {
                    setHasData(true);
                }
            } catch (error) {
                console.error('데이터 로딩 중 에러 발생:', error);
            }
        };

        fetchData();
    }, []);

    return (
      <header className="container">
          <div className="header">
              <div className="header-left">
              <Link to="/search">
                  <img src={Logo2_icon} alt="Icon" className="header-icon" />
                  </Link>
                  <Link to="/search" className="header-item"><span>항공표</span></Link>
              </div>
              <div className="header-right">
                  <Link to="/resultlist">
                      <img src={hasData ? alarm_found : alarm_icon} alt="Alarm" className="icon tt" />
                  </Link>
                  <Link to="/monitor">
                      <img src={mypage_icon} alt="mypage" className="icon" />
                  </Link>
                  <Link to="/">
                      <img src={logout_icon} alt="logout" className="icon" />
                  </Link>
              </div>
          </div>
          <div className="content">
          </div>
      </header>
    );
  }
  

export default Header;