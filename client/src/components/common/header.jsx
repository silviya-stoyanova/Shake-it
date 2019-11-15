import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import '../../static/css/common/header.css'
import { UserInfoConsumer } from '../../App'

function Header() {
    return (
        <UserInfoConsumer>
            {data => (
                <header>
                    <Link to="/">
                        <span className="logo"></span>
                    </Link>

                    <ul>
                        <li className="left-align"><Link to='/'>all products</Link></li>
                        {
                            data.role === 'Admin'
                                ? <li className="left-align"><Link to='/product/create'>add product</Link></li>
                                : null
                        }

                        {data.isLogged
                            ? <Fragment>
                                <li className="right-align"><Link to='/user/logout'>logout</Link></li>
                                <li className="right-align"><Link to='/user/profile'>wellcome, {data.username}</Link></li>
                                <li className="right-align"><Link to='/cart'>my cart</Link></li>
                            </Fragment>
                            : <Fragment>
                                <li className="right-align"><Link to='/user/register'>register</Link></li>
                                <li className="right-align"><Link to='/user/login'>login</Link></li>
                            </Fragment>
                        }
                        <li className="left-align"><Link to='/contacts'>contact us</Link></li>
                        <li className="left-align"><Link to='/about'>about us</Link></li>
                    </ul>
                </header>
            )}
        </UserInfoConsumer>
    )
}

export default Header