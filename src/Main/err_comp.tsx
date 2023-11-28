import '../css/err_page.css'
import '../css/main.css'

function Err_Comp() {
    return(
    <div>
        <div className='no-sits'>
          <span>아직 발견된 좌석이 존재하지 않거나 감시중인 항목이없습니다.</span>
        </div>
    </div>
    )
}

export default Err_Comp;