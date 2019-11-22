import React, { Component } from 'react'
import { toast } from 'react-toastify'
import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'
import { productValidations } from '../hocs/validations'

function withProcessProductForm(Form, formType) {
    return class hoc extends Component {
        constructor(props) {
            super(props)
            this.state = {
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

            this.validateProductData = productValidations.validateProductData.bind(this)
            this.validateProductOnSubmit = productValidations.validateProductOnSubmit.bind(this)
        }

        onProductEditPromiseFail = (err) => {
            console.log(err.titleIsTaken)

            if (!err.titleIsTaken) {
                this.props.history.push('/')
            }
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
                    className: 'success-toast'
                })

            }).catch(err => {
                err.json().then(error => {
                    toast.info(error.message, {
                        className: 'error-toast',
                    })

                    if (formType === 'edit' && onFailFunc) {
                        onFailFunc(error)
                    }
                })
            })
        }

        handleInputChange = async ({ target }) => {
            await this.setState(prevState => ({
                productInfo: {
                    ...prevState.productInfo,
                    [target.name]: target.files ? target.files : target.value.trim(),
                    uploadedImg: target.files ? URL.createObjectURL(target.files[0]) : prevState.productInfo.uploadedImg
                }

            }))

            const updateState = true
            const { title, description, image, price } = this.state.productInfo
            this.validateProductData(formType, title, description, image, price, updateState)
        }

        handleFormSubmit = async (event) => {
            event.preventDefault()
            const jwtToken = sessionManager.getUserInfo().authtoken
            const { _id, title, description, image, price } = this.state.productInfo
            const isValid = this.validateProductOnSubmit(formType, title, description, image, price)
            let promise = ''

            if (!isValid) {
                return
            }
            if (formType === 'create') {
                promise = requester.createProduct(title, description, image, price, jwtToken)
                this.handleFetchPromise(promise)

            } else if (formType === 'edit') {
                promise = requester.editProduct(_id, title, description, image, price, jwtToken)
                this.handleFetchPromise(promise, null, this.onProductEditPromiseFail)

            } else if (formType === 'delete') {
                promise = requester.deleteProduct(_id, jwtToken)
                this.handleFetchPromise(promise)
            }

        }

        render() {
            return <Form {...this.state.productInfo} handleInputChange={this.handleInputChange} handleFormSubmit={this.handleFormSubmit} />
        }

        componentDidMount() {
            if (formType === 'create') {
                return
            }

            requester.getProductInfo(this.state.productInfo._id)
                .then(res => {
                    if (!res.ok) {
                        return Promise.reject(res)
                    }
                    return res.json()
                })
                .then(product => {
                    this.setState({
                        productInfo: product
                    })
                })
                .catch(error => {
                    error.json()
                        .then(err => {
                            this.props.history.push('/')
                            toast.info(err.message, {
                                className: 'error-toast'
                            })
                        })
                })
        }
    }
}

export default withProcessProductForm