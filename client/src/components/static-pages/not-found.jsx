import React from 'react'
import '../../static/css/page-not-found.css'
import useTitle from '../page-title/useTitle'

const PageNotFound = () => {
    useTitle('404 - Page not found')

    return <div className="not-found-wrapper" >
        <div className="not-found-img"></div>
        <span className="four-digit left-al">4</span>
        <span className="four-digit right-al">4</span>
        <span className="not-found-txt">Sorry, we could not find what you were looking for :(</span>
    </div>
}

export default PageNotFound