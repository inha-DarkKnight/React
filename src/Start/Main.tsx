import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Login.css';
import logo from '../images/logo.png';
import login_icon from '../images/login_icon.png';
import Register from './Register';

function useLogin(){}
function LoginButton(){}
function SignupButton(){}

function Login(){
  
  return(
    <div className="login-form">
      <div className="input-group">
        <label htmlFor="user_id">아이디</label>
        <input type="text" id="user_id"/>
      </div>
      <div className="input-group">
        <label htmlFor="password">&nbsp;&nbsp;암호</label>
        <input type="password" id="password" />
      </div>
      <Link to="/search" className="login-link">
        <img src={login_icon} alt="Login Icon" className="login-icon" />
      </Link>
    </div>
  )
}


function Main() {
  const [showRegister, setShowRegister] = useState(false);
  async function toggleMonitoring() {
    try {
      const response = await fetch(`${process.env.REACT_APP_WAS_URL}/data-fetcher/toggle-monitoring`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.status); // 'Monitoring started' 또는 'Monitoring stopped'
      } else {
        alert('오류가 발생했습니다.');
      }
    } catch (error) {
      alert('요청을 처리할 수 없습니다.');
    }
  }
  const handleLogoClick = async () => {
    await toggleMonitoring();
  };

  return (
    <div className="login-container">
      <div className="left-section">
        <a href="#" onClick={handleLogoClick}><img src={logo} alt="Logo" className="logo" /></a>
      </div>

      <div className="right-section">
        {showRegister ? <Register /> : <Login />}
        <a 
          href="#" 
          className="signup-link"
          onClick={(e) => {
            e.preventDefault();
            setShowRegister(!showRegister); //상태전환
          }}
        >
          <span className="text">{showRegister ? "로그인하러 가기" : "계정이 없으세요?"}</span>
        </a>
      </div>
    </div>
  );
};

export default Main;