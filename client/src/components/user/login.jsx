import React from 'react'
import { Redirect } from 'react-router-dom'
import '../../static/css/forms.css'
import '../../static/css/notifications.css'

import { UserInfoConsumer } from '../../App'
import withProcessUserForm from './with-user-forms-hoc'

const UserLogin = (props) => {
    const { userClass, passClass, handleInputChange, handleFormSubmit } = props

    return (
        <UserInfoConsumer>
            {data =>
                <div className="form">
                    {
                        data.isLogged && <Redirect to='/' />
                    }
                    <form id="login-form" onSubmit={handleFormSubmit} >
                        <div className="form-type">Login</div>
                        <hr />

                        <div className="form-fields-wrapper">
                            <label htmlFor="username">Username</label>
                            <input autoFocus onChange={handleInputChange} name="username" className={userClass} type="text" id="username" />

                            <label htmlFor="password">Password</label>
                            <input onChange={handleInputChange} name="password" className={passClass} type="password" id="password" />
                        </div>

                        <button className="button" type="submit">Submit</button>
                    </form>
                </div>
            }
        </UserInfoConsumer>
    )
}

//* wrong: export default <withProcessUserForm Form={UserLogin} />
export default withProcessUserForm(UserLogin, 'login')