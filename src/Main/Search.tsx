import { useState } from 'react';
import Err_Comp from './err_comp'
import Flatpickr from "react-flatpickr";
import '../css/main.css'
import '../css/Search.css';
import "flatpickr/dist/themes/material_green.css";

function useSearch(){}
function SearchButton(){}



function Search() {
  const [showError, setShowError] = useState(false);

  if (showError) {
    return <Err_Comp />;  // 현재는 에러만표시
  }
  return (
    <div>
    <div className="search-main-container">
      <div className="monitor-name-container">
         <span className="monitor-name-label">감시이름</span>
         <input type="text" placeholder="감시이름_001" className="monitor-name-input" />
       </div>

      <div className="search-container">
        <div className="search-item">
          <span className="search-label">항공사</span>
          <input type="text" placeholder="항공사" />
        </div>

        <div className="search-item">
          <span className="search-label">도착지</span>
          <input type="text" placeholder="도착지" />
        </div>

        <div className="search-item">
          <span className="search-label">출발지</span>
          <input type="text" placeholder="출발지" />
        </div>
        <div className="search-item">
          <span className="search-label">날짜</span>
          <Flatpickr /* custom 날짜선택 theme */
            className="your-classname-if-needed"
            options={{
            dateFormat: 'Y-m-d'
            }}
            placeholder="날짜 선택"
           />
        </div>
      </div>
        <button
         className="search-button"
         onClick={() => setShowError(true)}>감시</button>
    </div>
    </div>
  );
}


export default Search;