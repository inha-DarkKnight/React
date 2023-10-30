import React from 'react';
import { useLocation, BrowserRouter, Routes, Route } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './css/fade.css';
import Main from './Start/Main';
import Search from './Main/Search';
import MonitorPage from './MyPage/MonitorPage';
import Head from './Main/Header';

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

function AppContent() {
  const location = useLocation();
  const isHeaderExcluded = location.pathname === '/' || location.pathname === '/register';

  return (
    <div>
      {!isHeaderExcluded && <Head />} {/* 헤더필요할때는 헤더넣기 */}
      
      <TransitionGroup>
        <CSSTransition
          key={location.key}
          timeout={450}
          classNames="fade"
        >
          <Routes location={location}>
            <Route path="/" element={<Main />} />
            <Route path="/search" element={<Search />} />
            <Route path="/monitor" element={<MonitorPage />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export default App;
