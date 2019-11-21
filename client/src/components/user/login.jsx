import React from 'react'
import '../../static/css/forms.css'
import '../../static/css/notifications.css'
import withProcessUserForm from './with-user-forms-hoc'
import useTitle from '../page-title/useTitle'

const UserLogin = (props) => {
    useTitle('Login')
    const { userClass, passClass, handleInputChange, handleFormSubmit } = props

    return (
        <React.Fragment>
            <div className="form">
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
        </React.Fragment>
    )
}

//* wrong: export default <withProcessUserForm Form={UserLogin} />
export default withProcessUserForm(UserLogin, 'login')