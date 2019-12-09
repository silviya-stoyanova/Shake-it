import React from 'react'
import '../../static/css/forms.css'
import '../../static/css/notifications.css'
import useTitle from '../page-title/useTitle'
import withProcessForm from '../hocs/withProcessForm'
import { userValidations } from '../hocs/validations'
import promiseExtraMethods from '../hocs/promiseExtraMethods'

const UserLogin = (props) => {
    useTitle('Login')
    const { handleInputChange, handleFormSubmit } = props
    const { username, password, userClass, passClass } = props.data

    return (
        <React.Fragment>
            <div className="form">
                <form id="login-form" onSubmit={handleFormSubmit} >
                    <div className="form-type">Login</div>
                    <hr />

                    <div className="form-fields-wrapper">
                        <label htmlFor="username">Username</label>
                        <input autoFocus value={username} onChange={handleInputChange} name="username" className={userClass} type="text" id="username" />

                        <label htmlFor="password">Password</label>
                        <input value={password} onChange={handleInputChange} name="password" className={passClass} type="password" id="password" />
                    </div>

                    <button className="button" type="submit">Submit</button>
                </form>
            </div>
        </React.Fragment>
    )
}

const initialData = {
    username: '',
    password: '',

    userClass: '',
    passClass: '',
}

const requestType = 'login'

const extraMethods = {
    success: promiseExtraMethods.user().onLoginSuccess,
    fail: promiseExtraMethods.user().onLoginFail
}

export { UserLogin }
//* wrong: export default <withProcessForm Form={UserLogin} />
export default withProcessForm(UserLogin, 'login', userValidations, initialData, requestType, extraMethods)