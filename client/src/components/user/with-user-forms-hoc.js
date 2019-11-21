import React, { Component } from 'react'
import { toast } from 'react-toastify'
import requester from '../../utilities/requests-util'
import observer from '../../utilities/observer'
import sessionManager from '../../utilities/session-util'

const withProcessUserForm = (Form, formType) => {
    return class hoc extends Component {

        constructor(props) {
            super(props)
            this.state = {
                username: '',
                password: '',
                repeatPassword: '',

                userClass: '',
                passClass: '',
                repeatPassClass: '',

                handleInputChange: null,
                handleFormSubmit: null
            }
            this.handleInputChange = this.handleInputChange.bind(this)
            // this.handleFormSubmit = this.handleFormSubmit.bind(this)
        }

        validateInputFields = (username, password, repeatPassword) => {
            let [userClass, passClass, repeatPassClass] = ['error', 'error', 'error']
            let result = {
                username: 'invalid',
                password: 'invalid',
                repeatPassword: 'invalid'
            }

            if (username && username.trim().length >= 5) {
                userClass = 'correct'
                result.username = 'valid'
            }
            if (password && password.length >= 8) {
                passClass = 'correct'
                result.password = 'valid'
            }

            if (repeatPassword) {
                if (repeatPassword && repeatPassword.length >= 8) {
                    repeatPassClass = 'correct'
                    result.repeatPassword = 'valid'
                }

                if (password !== repeatPassword) {
                    [passClass, repeatPassClass] = ['error', 'error']
                    result.password = 'invalid'
                    result.repeatPassword = 'invalid'
                }
            }

            this.setState({ userClass, passClass, repeatPassClass })
            return result
        }

        async handleInputChange({ target }) {
            await this.setState(prevState => ({
                [target.name]: target.value
            }))

            const { username, password, repeatPassword } = this.state
            this.validateInputFields(username, password, repeatPassword)
        }

        loginUser = (username, password) => requester.login(username, password)
        registerUser = (username, password) => requester.register(username, password)

        handleFetchPromise = (promise, reqType, username, password) => {
            promise.then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()

            }).then(async res => {
                let message = ''
                if (reqType === 'login') {
                    message = 'Wellcome! 🍹'
                    sessionManager.saveSession(res.authtoken, res.username, res.role)
                    observer.trigger('userLogin')
                    this.props.history.push('/')

                } else if (reqType === 'register') {
                    message = 'Successful registration! 🍹'
                    let nextResponse = this.loginUser(username, password)
                    this.handleFetchPromise(nextResponse, 'login', username, password)
                }
                toast.info(message, {
                    className: 'success-toast',
                })

            }).catch(err => {
                err.json().then(error => {
                    toast.info(error.message, {
                        className: 'error-toast',
                    })

                    this.setState(prevState => ({
                        userClass: 'error',
                        passClass: 'error',
                        repeatPassClass: 'error'
                    }))
                })
            })
        }

        handleFormSubmit = async (event) => {
            event.preventDefault()
            const { username, password, repeatPassword } = this.state
            const isInputValid = this.validateInputFields(username, password, repeatPassword)
            let response = ''

            if (formType === 'login') {
                if (isInputValid.username === 'invalid' || isInputValid.password === 'invalid') {
                    return toast.info('Either your username or password is invalid.', {
                        className: 'error-toast',
                    })
                }

                response = this.loginUser(username, password)
                this.handleFetchPromise(response, 'login')

            } else if (formType === 'register') {
                if (isInputValid.password === 'invalid' || isInputValid.repeatPassword === 'invalid') {
                    return toast.info('Both passwords must consist of at least 8 characters and they both must match!', {
                        className: 'error-toast'
                    })
                }
                if (isInputValid.username === 'invalid') {
                    return toast.info('Please enter a valid username!', {
                        className: 'error-toast'
                    })
                }
                response = this.registerUser(username, password)
                this.handleFetchPromise(response, 'register', username, password)
            }
        }

        render() {
            return <Form {...this.state} handleInputChange={this.handleInputChange} handleFormSubmit={this.handleFormSubmit} />
        }
    }
}

export default withProcessUserForm