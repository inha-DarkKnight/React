import React from 'react';
import { useLocation, BrowserRouter, Routes, Route } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './css/fade.css';
import Main from './Start/Main';
import Search from './Main/Search';
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
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={450}
        classNames="fade"
      >
        <div>
          {/* 헤더를 포함하지 않을 조건이 아닌 경우에만 헤더 렌더링. */}
          {!isHeaderExcluded && <Head />}
          <Routes location={location}>
            <Route path="/" element={<Main />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

export default App;
