import React from 'react';
import '../css/Header.css';
import alarm_icon from '../images/alarm.png'
import mypage_icon from '../images/mypage.png'
import logout_icon from '../images/logout_icon.png'
import Logo2_icon from '../images/logo2.png'
import { Link } from 'react-router-dom';


function Header() {
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
                  <Link to="/searchlist">
                  <img src={alarm_icon} alt="Alarm" className="icon" />
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