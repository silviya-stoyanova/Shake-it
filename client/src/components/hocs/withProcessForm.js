import React, { Component } from 'react'
import { toast } from 'react-toastify'
import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'

const withProcessForm = (Form, formType, validations, initialData, requestType, promiseExtraMethods, testServiceOnMount, testServiceOnSubmit) => {
    return class extends Component {
        constructor(props) {
            super(props)
            this.state = {
                data: initialData
            }

            this.validateData = validations ? validations.validateData.bind(this) : null
            this.validateOnSubmit = validations ? validations.validateOnSubmit.bind(this) : null

            this.promiseSuccess = promiseExtraMethods ? promiseExtraMethods.success.bind(this) : null
            this.promiseFail = promiseExtraMethods ? promiseExtraMethods.fail.bind(this) : null

            this.handleInputChange = this.handleInputChange.bind(this)
            this.handleFetchPromise = this.handleFetchPromise.bind(this)
            this.handleFormSubmit = this.handleFormSubmit.bind(this)
        }

        // static defaultProps = {
        //     service: requester.getProductInfo
        // }

        async handleInputChange({ target }) {
            // console.log(target)

            await this.setState(prevState => ({
                data: {
                    ...prevState.data,
                    [target.name]: target.files ? target.files : target.value.trim(),
                    uploadedImg: target.files ? URL.createObjectURL(target.files[0]) : prevState.data.uploadedImg
                    // uploadedImg: target.files ? target.files[0] : prevState.data.uploadedImg
                }
            }))

            const updateState = true
            const { data } = this.state

            // console.log(data)

            this.validateData(formType, data, updateState)
        }

        handleFetchPromise(promise, onSuccessFunc, onFailFunc, data = '') {
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

        async handleFormSubmit(event) {
            event.preventDefault()
            const { data } = this.state
            const jwtToken = sessionManager.getUserInfo().authtoken
            let isValid = this.validateOnSubmit(formType, data)

            if (!isValid) {
                return
            }

            if (testServiceOnSubmit) {
                testServiceOnSubmit()
                    // to see the message inside the response, uncomment the next two commented out lines
                    // .then(res => res.json())
                    .then(res => {
                        // console.log(res.success)
                        this.props.history.push('/')
                    })
                    .catch(err => {
                        console.log(err)
                    })

            } else {
                const promise = requester[requestType](data, jwtToken)
                this.handleFetchPromise(promise, this.promiseSuccess, this.promiseFail, data)
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
            // requester.getProductInfo(this.state.data._id)

            const serviceReq = testServiceOnMount || requester.getProductInfo  // new

            const productId = this.props.match                      // new
                ? this.props.match.params.productId
                : null
            // const productId = this.props.match.params.productId

            // requester.getProductInfo(productId)                  // prev
            serviceReq && serviceReq(productId)                     // new
                .then(res => {
                    if (!res.ok) {
                        return Promise.reject(res)
                    }
                    return res.json()
                })
                .then(async res => {
                    await this.setState({
                        data: res
                    })
                })
                .catch(error => {
                    this.props.history.push('/')

                    error.json().then(err => {
                        toast.info(err.message, {
                            className: 'error-toast'
                        })
                    })
                })
        }
    }
}

export default withProcessForm