import React, { Component } from 'react'
import { toast } from 'react-toastify'
import requester from '../../utilities/requests-util'
import observer from '../../utilities/observer'
import sessionManager from '../../utilities/session-util'

const withProcessForm = (Form, formType, validations, initialData) => {
    return class extends Component {
        constructor(props) {
            super(props)
            this.state = {
                data: initialData
            }

            this.validateData = validations.validateData.bind(this)
            this.validateOnSubmit = validations.validateOnSubmit.bind(this)
        }

        // =============================================================================
        onLoginPromise = (res) => {
            sessionManager.saveSession(res.authtoken, res.username, res.role)
            observer.trigger('userLogin')
        }

        onRegisterPromise = (res, data) => {
            let nextPromise = requester.login(data.username, data.password)
            this.handleFetchPromise(nextPromise, this.onLoginPromise, null,
                { username: data.username, password: data.password })
        }

        // onLoadInfo = (res, data) => {
        // }

        onUserPromiseFail = (err) => {
            this.setState(prevState => ({
                data: {
                    ...prevState,
                    userClass: 'error',
                    passClass: formType === 'register' ? 'correct' : 'error',
                    repeatPassClass: formType === 'register' ? 'correct' : 'error'
                }
            }))
        }

        onProductPromiseFail = (err) => {
            if (!err.titleIsTaken) {
                this.props.history.push('/')
            }
        }
        // =============================================================================

        handleInputChange = async ({ target }) => {
            await this.setState(prevState => ({
                data: {
                    ...prevState.data,
                    [target.name]: target.files ? target.files : target.value.trim(),
                    uploadedImg: target.files ? URL.createObjectURL(target.files[0]) : prevState.data.uploadedImg
                }
            }))

            const updateState = true
            if (formType === 'create' || formType === 'edit' || formType === 'delete' || formType === 'details') {
                const { title, description, image, price } = this.state.data
                this.validateData(formType, title, description, image, price, updateState)
            } else if (formType === 'login' || formType === 'register') {
                const { username, password, repeatPassword } = this.state.data
                this.validateData(formType, username, password, repeatPassword, updateState)
            }
        }

        handleFetchPromise = (promise, onSuccessFunc, onFailFunc, data = '') => {
            promise.then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()

            }).then(res => {
                toast.info(res.success, {
                    className: 'success-toast'
                })

                data.redirectOnSuccess && this.props.history.push('/')
                onSuccessFunc && onSuccessFunc(res, data)

            }).catch(err => {
                err.json().then(error => {
                    toast.info(error.message, {
                        className: 'error-toast'
                    })

                    data.redirectOnFail && this.props.history.push('/')
                    onFailFunc && onFailFunc(err)
                })
            })
        }

        handleFormSubmit = async (event) => {
            event.preventDefault()
            let [promise, isValid] = ['', '']
            const jwtToken = sessionManager.getUserInfo().authtoken
            const { username, password, repeatPassword } = this.state.data
            const { _id, title, description, image, price } = this.state.data

            if (formType === 'create' || formType === 'edit' || formType === 'delete' || formType === 'details') {
                isValid = this.validateOnSubmit(formType, title, description, image, price)

            } else if (formType === 'login' || formType === 'register') {
                isValid = this.validateOnSubmit(formType, username, password, repeatPassword)
            }

            if (!isValid) {
                return
            }

            if (formType === 'login') {
                promise = requester.login(username, password)
                this.handleFetchPromise(promise, this.onLoginPromise, this.onUserPromiseFail, { redirectOnSuccess: true })

            } else if (formType === 'register') {
                promise = requester.register(username, password)
                this.handleFetchPromise(promise, this.onRegisterPromise, this.onUserPromiseFail, { username, password, redirectOnSuccess: true })

            } else if (formType === 'create') {
                promise = requester.createProduct(title, description, image, price, jwtToken)
                this.handleFetchPromise(promise, null, null, { redirectOnSuccess: true })

            } else if (formType === 'edit') {
                promise = requester.editProduct(_id, title, description, image, price, jwtToken)
                this.handleFetchPromise(promise, null, this.onProductPromiseFail, { redirectOnSuccess: true })

            } else if (formType === 'delete') {
                promise = requester.deleteProduct(_id, jwtToken)
                this.handleFetchPromise(promise, null, this.onProductPromiseFail, { redirectOnSuccess: true })
            }
        }

        render() {
            return <Form {...this.state} handleInputChange={this.handleInputChange} handleFormSubmit={this.handleFormSubmit} />
        }

        componentDidMount() {
            if (formType === 'create' || formType === 'login' || formType === 'register') {
                return
            }

            // let promise = requester.getProductInfo(this.state.productInfo._id)
            // this.handleFetchPromise(promise, null, null, { redirectOnFail: true })

            requester.getProductInfo(this.state.data._id)
                .then(res => {
                    if (!res.ok) {
                        return Promise.reject(res)
                    }
                    return res.json()
                })
                .then(res => {
                    this.setState({
                        data: res
                    })
                })
                .catch(error => {
                    error.json().then(err => {
                        toast.info(err.message, {
                            className: 'error-toast'
                        })

                        this.props.history.push('/')
                    })
                })
        }
    }
}

export default withProcessForm