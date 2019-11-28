import React from 'react'
import { Link } from 'react-router-dom'
import '../../static/css/common/footer.css'

function Footer() {
    return (
        <footer>
            <div className='left-al'>
                <span><Link to='/terms'>Terms</Link></span>
                <span><Link to='/data-use-policy'>Data use policy</Link></span>
            </div>
            <div className='right-al'>
                <span><Link to='/contacts'>Make contact with us</Link></span>
                <span>&copy; Shake it, Bulgaria 2019</span>
            </div>
        </footer>
    )
}

export default Footer