import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import '../../static/css/forms.css'

import { UserInfoConsumer } from '../../App'
import observer from '../utilities/observer'
import requester from '../utilities/requests-util'
import sessionManager from '../utilities/session-util'

class UserRegister extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            repeatPassword: '',

            userClass: '',
            passClass: '',
            repeatPassClass: '',
        }

        this.handleInputChange = this.handleInputChange.bind(this)
    }

    validateInputFields = (username, password, repeatPassword) => {
        let [userClass, passClass, repeatPassClass] = ['error', 'error', 'error']

        const result = {
            username: 'invalid',
            password: 'invalid',
            repeatPassword: 'invalid',
        }

        if (username && username.trim().length) {
            userClass = 'correct'
            result.username = 'valid'
        }
        if (password && password.trim().length) {
            passClass = 'correct'
            result.password = 'valid'
        }
        if (repeatPassword && repeatPassword.trim().length) {
            repeatPassClass = 'correct'
            result.repeatPassword = 'valid'
        }

        if (password !== repeatPassword) {
            [passClass, repeatPassClass] = ['error', 'error']
            result.password = 'invalid'
            result.repeatPassword = 'invalid'
        }

        this.setState({ userClass, passClass, repeatPassClass })
        return result
    }

    async handleInputChange({ target }) {
        await this.setState({
            [target.name]: target.value
        })

        const { username, password, repeatPassword } = this.state
        this.validateInputFields(username, password, repeatPassword)
    }

    handleFormSubmit = async (event) => {
        event.preventDefault()
        const { username, password, repeatPassword } = this.state
        const isInputValid = this.validateInputFields(username, password, repeatPassword)

        if (isInputValid.username === 'invalid') {
            return toast.info('Please enter a valid username!', {
                className: 'error-toast'
            })
        }
        if (isInputValid.password === 'invalid' &&
            isInputValid.repeatPassword === 'invalid') {
            return toast.info('Both passwords must match!', {
                className: 'error-toast'
            })
        }

        requester.register(username, password)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(res => {

                toast.info('Successful registration! 🍹', {
                    className: 'success-toast',
                })

                requester.login(username, password)
                    .then(res => {
                        if (!res.ok) {
                            return Promise.reject(res)
                        }
                        return res.json()
                    })
                    .then(res => {
                        sessionManager.saveSession(res.authtoken, res.username, res.role)
                        observer.trigger('userLogin')
                    })
                    .catch(err => {
                        err.json().then(error => {
                            toast.info(error.message, {
                                className: 'error-toast',
                            })
                        })
                        this.setState({
                            userClass: 'error'
                        })
                    })
            })
            .catch(err => {
                console.log(err)

                err.json().then(error => {
                    toast.info(error.message, {
                        className: 'error-toast',
                    })
                })
                this.setState({
                    userClass: 'error'
                })
            })
    }

    render() {
        const { userClass, passClass, repeatPassClass } = this.state

        return (
            <UserInfoConsumer>
                {data =>
                    <div className="form">
                        {data.isLogged
                            ? <Redirect to='/' />
                            : null
                        }
                        <form onSubmit={this.handleFormSubmit}>
                            <div className="form-type">Register</div>
                            <hr />

                            <div className="form-fields-wrapper">
                                <label htmlFor="username">Username</label>
                                <input autoFocus onChange={this.handleInputChange} name="username" className={userClass} type="text" id="username" />

                                <label htmlFor="password">Password</label>
                                <input onChange={this.handleInputChange} name="password" className={passClass} type="password" id="password" />

                                <label htmlFor="repeat-password">Repeat password</label>
                                <input onChange={this.handleInputChange} name="repeatPassword" className={repeatPassClass} type="password" id="repeat-password" />
                            </div>

                            <button className="button" type="submit">Submit</button>
                        </form>
                    </div>
                }
            </UserInfoConsumer>
        )
    }
}

export default UserRegister