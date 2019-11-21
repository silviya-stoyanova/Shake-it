import React from 'react'
import '../../static/css/forms.css'
import withProcessUserForm from './with-user-forms-hoc'
import useTitle from '../page-title/useTitle'

const UserRegister = (props) => {
    useTitle('Register')
    const { userClass, passClass, repeatPassClass, handleInputChange, handleFormSubmit } = props

    return (
        <div className="form">
            <form onSubmit={handleFormSubmit}>
                <div className="form-type">Register</div>
                <hr />

                <div className="form-fields-wrapper">
                    <label htmlFor="username">Username</label>
                    <input autoFocus onChange={handleInputChange} name="username" className={userClass} type="text" id="username" />

                    <label htmlFor="password">Password</label>
                    <input onChange={handleInputChange} name="password" className={passClass} type="password" id="password" />

                    <label htmlFor="repeat-password">Repeat password</label>
                    <input onChange={handleInputChange} name="repeatPassword" className={repeatPassClass} type="password" id="repeat-password" />
                </div>

                <button className="button" type="submit">Submit</button>
            </form>
        </div>
    )
}

//* wrong: export default <withProcessUserForm Form={UserRegister} />
export default withProcessUserForm(UserRegister, 'register')