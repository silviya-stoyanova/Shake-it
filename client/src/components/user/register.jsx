import React from 'react'
import '../../static/css/forms.css'
import withProcessForm from '../hocs/withProcessForm'
import useTitle from '../page-title/useTitle'
import { userValidations } from '../hocs/validations'
import promiseExtraMethods from '../hocs/promiseExtraMethods'

const UserRegister = (props) => {
    useTitle('Register')
    const { handleInputChange, handleFormSubmit } = props
    const { username, password, repeatPassword, userClass, passClass, repeatPassClass } = props.data

    return (
        <section className="form">
            <form onSubmit={handleFormSubmit}>
                <div className="form-type">Register</div>
                <hr />

                <div className="form-fields-wrapper">
                    <label htmlFor="username">Username</label>
                    <input autoFocus value={username} onChange={handleInputChange} name="username" className={userClass} type="text" id="username" />

                    <label htmlFor="password">Password</label>
                    <input value={password} onChange={handleInputChange} name="password" className={passClass} type="password" id="password" />

                    <label htmlFor="repeat-password">Repeat password</label>
                    <input value={repeatPassword} onChange={handleInputChange} name="repeatPassword" className={repeatPassClass} type="password" id="repeat-password" />
                </div>

                <button className="button" type="submit">Submit</button>
            </form>
        </section>
    )
}

const initialData = {
    username: '',
    password: '',
    repeatPassword: '',

    userClass: '',
    passClass: '',
    repeatPassClass: ''
}

const requestType = 'register'

const extraMethods = {
    success: promiseExtraMethods.user().onRegisterSuccess,
    fail: promiseExtraMethods.user().onRegisterFail
}

export { UserRegister }
//* wrong: export default <withProcessForm Form={UserRegister} />
export default withProcessForm(UserRegister, 'register', userValidations, initialData, requestType, extraMethods)