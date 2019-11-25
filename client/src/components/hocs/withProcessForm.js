import React, { Component } from 'react'
import { toast } from 'react-toastify'
import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'

const withProcessForm = (Form, formType, validations, initialData, requestType, promiseExtraMethods) => {
    return class extends Component {
        constructor(props) {
            super(props)
            this.state = {
                data: initialData
            }

            this.validateData = validations.validateData.bind(this)
            this.validateOnSubmit = validations.validateOnSubmit.bind(this)

            this.promiseSuccess = promiseExtraMethods.success.bind(this)
            this.promiseFail = promiseExtraMethods.fail.bind(this)
        }

        handleInputChange = async ({ target }) => {
            await this.setState(prevState => ({
                data: {
                    ...prevState.data,
                    [target.name]: target.files ? target.files : target.value.trim(),
                    uploadedImg: target.files ? URL.createObjectURL(target.files[0]) : prevState.data.uploadedImg
                }
            }))

            const updateState = true
            const { data } = this.state
            this.validateData(formType, data, updateState)
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

                // data.redirectOnSuccess &&
                this.props.history.push('/')

                onSuccessFunc && onSuccessFunc(res, data)

            }).catch(err => {
                err.json().then(error => {
                    toast.info(error.message, {
                        className: 'error-toast'
                    })

                    onFailFunc && onFailFunc(error)
                })
            })
        }

        handleFormSubmit = async (event) => {
            event.preventDefault()
            const { data } = this.state
            const jwtToken = sessionManager.getUserInfo().authtoken
            let isValid = this.validateOnSubmit(formType, data)


            if (!isValid) {
                return
            }

            const promise = requester[requestType](data, jwtToken)
            this.handleFetchPromise(promise, this.promiseSuccess, this.promiseFail, data)
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

            const productId = this.props.match.params.productId
            // requester.getProductInfo(this.state.data._id)
            requester.getProductInfo(productId)
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