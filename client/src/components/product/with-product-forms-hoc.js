import React, { Component } from 'react'
import { toast } from 'react-toastify'
import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'

function withProcessProductForm(Form, formType) {
    return class hoc extends Component {

        constructor(props) {
            super(props)
            this.state = {
                productId: this.props.match.params.productId,

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

        validateData = (title, description, image, price, updateState) => {
            let [titleClass, descriptionClass, priceClass] = ['error', 'error', 'error', 'error']
            let result = {
                title: 'invalid',
                description: 'invalid',
                image: 'invalid',
                price: 'invalid',
            }

            if (title && title.length > 2 && title.length <= 50) {
                titleClass = 'correct'
                result.title = 'valid'
            }
            if (description && description.length > 9 && description.length <= 250) {
                descriptionClass = 'correct'
                result.description = 'valid'
            }

            // validate only when creating a new product
            if (formType === 'create') {
                if (image) {
                    result.image = 'valid'
                }
            }
            if (price && Number(price) > 0) {
                priceClass = 'correct'
                result.price = 'valid'
            }

            updateState && this.setState({ titleClass, descriptionClass, priceClass })
            return result
        }

        validateOnSubmit = (title, description, image, price) => {
            const updateState = false
            const isInputValid = this.validateData(title, description, image, price, updateState)
            let isValid = false

            if (isInputValid.title === 'invalid') {
                toast.info('The title length must be between 3 and 50 symbols including.', {
                    className: 'error-toast',
                })
                return isValid
            }
            if (isInputValid.description === 'invalid') {
                toast.info('The description must be at least 10 symbols long.', {
                    className: 'error-toast',
                })
                return isValid
            }
            if (formType === 'create') {// do this only when creating a new product
                if (isInputValid.image === 'invalid') {
                    toast.info('Please provide an image.', {
                        className: 'error-toast',
                    })
                    return isValid
                }
            }
            if (isInputValid.price === 'invalid') {
                toast.info('Please enter a valid price.', {
                    className: 'error-toast',
                })
                return isValid
            }
            isValid = true
            return isValid
        }

        handleInputChange = async ({ target }) => {
            let newState =
                target.files
                    ? {
                        [target.name]: target.files,
                        uploadedImg: URL.createObjectURL(target.files[0])
                    }
                    : { [target.name]: target.value.trim() }

            await this.setState(newState)

            const updateState = true
            const { title, description, image, price } = this.state
            this.validateData(title, description, image, price, updateState)
        }

        handleFormSubmit = async (event) => {
            event.preventDefault()
            const jwtToken = sessionManager.getUserInfo().authtoken
            const { productId, title, description, image, price } = this.state
            const isValid = this.validateOnSubmit(title, description, image, price)

            if (!isValid) {
                return
            }

            if (formType === 'create') {// do this only when creating a new product
                await requester.createProduct(title, description, image, price, jwtToken)
                    .then(res => {
                        if (!res.ok) {
                            return Promise.reject(res)
                        }
                        return res.json()
                    })
                    .then(res => {
                        this.props.history.push('/')
                        return toast.info(res.success, {
                            className: 'success-toast',
                        })
                    })
                    .catch(error => {
                        error.json().then(err => {
                            return toast.info(err.message, {
                                className: 'error-toast',
                            })
                        })
                    })
            } else if (formType === 'edit') {
                requester.editProduct(productId, title, description, image, price, jwtToken)
                    .then(res => {
                        if (!res.ok) {
                            return Promise.reject(res)
                        }
                        return res.json()
                    })
                    .then(res => {
                        this.props.history.push('/')

                        toast.info(res.success, {
                            className: 'success-toast'
                        })
                    })
                    .catch(error => {
                        error.json().then(err => {
                            if (!err.titleIsTaken) {
                                this.props.history.push('/')
                            }
                            return toast.info(err.message, {
                                className: 'error-toast',
                            })
                        })
                    })

            } else if (formType === 'delete') {
                requester.deleteProduct(productId, jwtToken)
                    .then(res => {
                        if (!res.ok) {
                            return Promise.reject(res)
                        }
                        return res.json()
                    })
                    .then(res => {
                        this.props.history.push('/')

                        toast.info(res.success, {
                            className: 'success-toast'
                        })
                    })
                    .catch(error => {
                        error.json().then(err => {
                            toast.info(err.message, {
                                className: 'error-toast'
                            })
                        })
                    })
            }
        }

        render() {
            return <Form {...this.state} handleInputChange={this.handleInputChange} handleFormSubmit={this.handleFormSubmit} />
        }

        async componentDidMount() {
            if (formType === 'create') {
                return
            }

            await requester.getProductInfo(this.state.productId)
                .then(res => {
                    if (!res.ok) {
                        return Promise.reject(res)
                    }
                    return res.json()
                })
                .then(product => {
                    this.setState(product)
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