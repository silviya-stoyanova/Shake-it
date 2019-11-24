import React from 'react'
import '../../static/css/forms.css'
import '../../static/css/notifications.css'
import withProcessForm from '../hocs/withProcessForm'
import useTitle from '../page-title/useTitle'

const UserLogin = (props) => {
    useTitle('Login')
    const { handleInputChange, handleFormSubmit } = props
    const { userClass, passClass } = props.userInfo

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

//* wrong: export default <withProcessForm Form={UserLogin} />
export default withProcessForm(UserLogin, 'login')