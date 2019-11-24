import React, { Component } from 'react'
import { toast } from 'react-toastify'
import requester from '../../utilities/requests-util'
import observer from '../../utilities/observer'
import sessionManager from '../../utilities/session-util'
import { userValidations, productValidations } from '../hocs/validations'

const withProcessForm = (Form, formType) => {
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
                },
                productInfo: {
                    _id: this.props.match.params.productId,
                    title: '',
                    description: '',
                    image: '',
                    price: '',

                    titleClass: formType === 'create' ? '' : 'correct',
                    descriptionClass: formType === 'create' ? '' : 'correct',
                    priceClass: formType === 'create' ? '' : 'correct',

                    uploadedImg: ''
                }
            }

            this.validateUserData = userValidations.validateUserData.bind(this)
            this.validateUserOnSubmit = userValidations.validateUserOnSubmit.bind(this)

            this.validateProductData = productValidations.validateProductData.bind(this)
            this.validateProductOnSubmit = productValidations.validateProductOnSubmit.bind(this)
        }

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
                userInfo: {
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

        handleInputChange = async ({ target }) => {
            await this.setState(prevState => {
                let infoType
                if (formType === 'create' || formType === 'edit' || formType === 'delete' || formType === 'details') {
                    infoType = 'productInfo'
                } else if (formType === 'login' || formType === 'register') {
                    infoType = 'userInfo'
                }

                return {
                    [infoType]: {
                        ...prevState[infoType],
                        [target.name]: target.files ? target.files : target.value.trim(),
                        uploadedImg: target.files ? URL.createObjectURL(target.files[0]) : prevState[infoType].uploadedImg
                    }
                }
            })

            const updateState = true
            if (formType === 'create' || formType === 'edit' || formType === 'delete' || formType === 'details') {
                const { title, description, image, price } = this.state.productInfo
                this.validateProductData(formType, title, description, image, price, updateState)
            } else if (formType === 'login' || formType === 'register') {
                const { username, password, repeatPassword } = this.state.userInfo
                this.validateUserData(formType, username, password, repeatPassword, updateState)
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

                onSuccessFunc && onSuccessFunc(res, data)
                data.redirectOnSuccess && this.props.history.push('/')

            }).catch(err => {
                err.json().then(error => {
                    toast.info(error.message, {
                        className: 'error-toast'
                    })

                    onFailFunc && onFailFunc(err)
                    data.redirectOnFail && this.props.history.push('/')
                })
            })
        }

        handleFormSubmit = async (event) => {
            event.preventDefault()
            let [promise, isValid] = ['', '']
            const jwtToken = sessionManager.getUserInfo().authtoken
            const { username, password, repeatPassword } = this.state.userInfo
            const { _id, title, description, image, price } = this.state.productInfo

            if (formType === 'create' || formType === 'edit' || formType === 'delete' || formType === 'details') {
                isValid = this.validateProductOnSubmit(formType, title, description, image, price)

            } else if (formType === 'login' || formType === 'register') {
                isValid = this.validateUserOnSubmit(formType, username, password, repeatPassword)
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

            requester.getProductInfo(this.state.productInfo._id)
                .then(res => {
                    if (!res.ok) {
                        return Promise.reject(res)
                    }
                    return res.json()
                })
                .then(res => {
                    this.setState({
                        productInfo: res
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