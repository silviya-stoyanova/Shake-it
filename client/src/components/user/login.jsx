import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import '../../static/css/forms.css'
import '../../static/css/notifications.css'

import requester from '../utilities/requests-util'
import observer from '../utilities/observer'
import sessionManager from '../utilities/session-util'
import { UserInfoConsumer } from '../../App'

class UserLogin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            userClass: '',
            passClass: ''
        }

        this.handleInputChange = this.handleInputChange.bind(this)
        // this.handleFormSubmit = this.handleFormSubmit.bind(this)
    }

    validateInputFields = (username, password) => {
        let [userClass, passClass] = ['error', 'error']
        let result = {
            username: 'invalid',
            password: 'invalid'
        }

        if (username && username.trim().length) {
            userClass = 'correct'
            result.username = 'valid'
        }
        if (password && password.trim().length) {
            passClass = 'correct'
            result.password = 'valid'
        }

        this.setState({ userClass, passClass })
        return result
    }

    async  handleInputChange({ target }) {
        await this.setState(prevState => ({
            [target.name]: target.value
        }))

        const { username, password } = this.state
        this.validateInputFields(username, password)
    }

    handleFormSubmit = async (event) => {
        event.preventDefault()
        const { username, password } = this.state
        const isInputValid = this.validateInputFields(username, password)

        if (isInputValid.username === 'invalid' || isInputValid.password === 'invalid') {
            return toast.info('Either your username or password is invalid.', {
                className: 'error-toast',
            })
        }

        requester.login(username, password)
            .then(res => {
                console.log(res);
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(async res => {

                // this.setState(prevState => ({
                //     userClass: 'correct',
                //     passClass: 'correct'
                // }))
                toast.info('Wellcome back! 🍹', {
                    className: 'success-toast',
                })

                sessionManager.saveSession(res.authtoken, res.username, res.role)
                observer.trigger('userLogin')

            }).catch(err => {
                console.log(err);

                err.json().then(error => {
                    this.setState(prevState => ({
                        userClass: 'error',
                        passClass: 'error'
                    }))

                    return toast.info(error.message, {
                        className: 'error-toast',
                    })
                })
            })
    }

    render() {
        const { userClass, passClass } = this.state

        return (
            <UserInfoConsumer>
                {data =>
                    <div className="form">
                        {
                            data.isLogged
                                ? <Redirect to='/' />
                                : null
                        }
                        <form id="login-form" onSubmit={this.handleFormSubmit} >
                            <div className="form-type">Login</div>
                            <hr />

                            <div className="form-fields-wrapper">
                                <label htmlFor="username">Username</label>
                                <input autoFocus onChange={this.handleInputChange} name="username" className={userClass} type="text" id="username" />

                                <label htmlFor="password">Password</label>
                                <input onChange={this.handleInputChange} name="password" className={passClass} type="password" id="password" />
                            </div>

                            <button className="button" type="submit">Submit</button>
                        </form>
                    </div>
                }
            </UserInfoConsumer>
        )
    }
}

export default UserLogin