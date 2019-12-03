import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import '../../static/css/common/header.css'
import { UserInfoConsumer } from '../../App'
// selectors used only for testing purposes: "add-product", "logout", "greeting"

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
                            data.role === 'Admin' && <li className="left-align add-product"><Link to='/product/create'>add product</Link></li>
                        }

                        {data.isLogged
                            ? <Fragment>
                                <li className="right-align logout"><Link to='/user/logout'>logout</Link></li>
                                <li className="right-align"><Link className="my-cart-img" to='/cart'></Link></li>
                                <li className="right-align greeting"><Link to='/user/profile'>welcome, {data.username}</Link></li>
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