import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import '../../static/css/common/header.css'
import { UserInfoConsumer } from '../../App'
// selectors used only for testing purposes: "add-product", "logout", "greeting"

function Header() {
    return (
        <UserInfoConsumer>
            {data => (
                <Fragment>

                    <header>
                        <Link to="/">
                            <span className="logo"></span>
                        </Link>

                        <input type="checkbox" id="toggle-menu" defaultValue="false"/>
                        <nav>
                            <label htmlFor="toggle-menu">
                                <i class="fas fa-bars"></i>
                                <i class="fas fa-times"></i>
                                Menu
                            </label>

                            <ul className="left-align">
                                <li><Link to='/'>all products</Link></li>
                                {
                                    data.role === 'Admin' && <li className="add-product"><Link to='/product/create'>add product</Link></li>
                                }

                                <li><Link to='/contacts'>contact us</Link></li>
                                <li><Link to='/about'>about us</Link></li>
                            </ul>

                            <ul>
                                {data.isLogged
                                    ? <Fragment>
                                        <li className="greeting"><Link to='/user/profile'>welcome, {data.username}</Link></li>
                                        <li className="greeting"><Link to='/user/profile'><i class="fas fa-shopping-cart"></i></Link></li>
                                        {/* <li><Link className="my-cart-img" to='/cart'></Link></li> */}
                                        <li className="logout"><Link to='/user/logout'>logout</Link></li>
                                    </Fragment>
                                    : <Fragment>
                                        <li><Link to='/user/register'>register</Link></li>
                                        <li><Link to='/user/login'>login</Link></li>
                                    </Fragment>
                                }
                            </ul>
                        </nav>
                    </header>
                </Fragment>
            )}
        </UserInfoConsumer>
    )
}

export default Header