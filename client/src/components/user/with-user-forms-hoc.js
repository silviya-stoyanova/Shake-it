import React, { Component } from 'react'
import { toast } from 'react-toastify'
import requester from '../../utilities/requests-util'
import observer from '../../utilities/observer'
import sessionManager from '../../utilities/session-util'
import { userValidations } from '../hocs/validations'

const withProcessUserForm = (Form, formType) => {
    return class hoc extends Component {
        constructor(props) {
            super(props)
            this.state = {
                userInfo: {
                    username: '',
                    password: '',
                    repeatPassword: '',

                    userClass: '',
                    passClass: '',
                    repeatPassClass: '',
                }
            }

            this.validateUserData = userValidations.validateUserData.bind(this)
            this.validateUserOnSubmit = userValidations.validateUserOnSubmit.bind(this)
        }

        onLoginPromise = (res) => {
            sessionManager.saveSession(res.authtoken, res.username, res.role)
            observer.trigger('userLogin')
        }

        onUserFetchFail = () => {
            this.setState(prevState => ({
                userInfo: {
                    ...prevState,
                    userClass: 'error',
                    passClass: formType === 'register' ? 'correct' : 'error',
                    repeatPassClass: formType === 'register' ? 'correct' : 'error'
                }
            }))
        }

        onRegisterPromise = (res, data) => {
            let nextPromise = requester.login(data.username, data.password)
            this.handleFetchPromise(nextPromise, this.onLoginPromise, null,
                { username: data.username, password: data.password })
        }

        handleFetchPromise = (promise, onFetchFunc, onFailFunc, data = '') => {
            promise.then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()

            }).then(res => {
                onFetchFunc && onFetchFunc(res, data)
                this.props.history.push('/')

                toast.info(res.success, {
                    className: 'success-toast',
                })

            }).catch(err => {
                err.json().then(error => {
                    toast.info(error.message, {
                        className: 'error-toast',
                    })

                    onFailFunc()
                })
            })
        }

        handleInputChange = async ({ target }) => {
            await this.setState(prevState => ({
                userInfo: {
                    ...prevState.userInfo,
                    [target.name]: target.value
                }
            }))

            const updateState = true
            const { username, password, repeatPassword } = this.state.userInfo
            this.validateUserData(formType, username, password, repeatPassword, updateState)
        }

        handleFormSubmit = async (event) => {
            event.preventDefault()
            const { username, password, repeatPassword } = this.state.userInfo
            const isValid = this.validateUserOnSubmit(formType, username, password, repeatPassword)

            if (!isValid) {
                return
            }
            if (formType === 'login') {
                const promise = requester.login(username, password)
                this.handleFetchPromise(promise, this.onLoginPromise, this.onUserFetchFail)

            } else if (formType === 'register') {
                const promise = requester.register(username, password)
                this.handleFetchPromise(promise, this.onRegisterPromise, this.onUserFetchFail, { username, password })
            }
        }

        render() {
            return <Form {...this.state.userInfo} handleInputChange={this.handleInputChange} handleFormSubmit={this.handleFormSubmit} />
        }
    }
}

export default withProcessUserForm