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

                unauthUser: false,
                isCreated: false,
                isEditted: false,
                productExists: true,
                uploadedImg: ''
            }
        }

        validateInputFields = (title, description, image, price) => {
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

            if (formType === 'create') {// check only when creating a new product
                if (image) {
                    result.image = 'valid'
                }
            }
            if (price && Number(price) > 0) {
                priceClass = 'correct'
                result.price = 'valid'
            }

            this.setState({ titleClass, descriptionClass, priceClass })
            return result
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
            const { title, description, image, price } = this.state
            this.validateInputFields(title, description, image, price)
        }

        handleFormSubmit = async (event) => {
            event.preventDefault()
            const jwtToken = sessionManager.getUserInfo().authtoken
            const { productId, title, description, image, price } = this.state
            const isInputValid = this.validateInputFields(title, description, image, price)

            if (isInputValid.title === 'invalid') {
                return toast.info('The title length must be between 3 and 50 symbols including.', {
                    className: 'error-toast',
                })
            }
            if (isInputValid.description === 'invalid') {
                return toast.info('The description must be at least 10 symbols long.', {
                    className: 'error-toast',
                })
            }
            if (formType === 'create') {// do only when creating a new product
                if (isInputValid.image === 'invalid') {
                    return toast.info('Please provide an image.', {
                        className: 'error-toast',
                    })
                }
            }
            if (isInputValid.price === 'invalid') {
                return toast.info('Please enter a valid price.', {
                    className: 'error-toast',
                })
            }

            if (formType === 'create') {// do only when creating a new product
                await requester.createProduct(title, description, image, price, jwtToken)
                    .then(res => {
                        if (!res.ok) {
                            return Promise.reject(res)
                        }
                        return res.json()
                    })
                    .then(res => {
                        this.setState({ isCreated: true })

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
                        this.setState({ isEditted: true })

                        toast.info(res.success, {
                            className: 'success-toast'
                        })
                    })
                    .catch(error => {
                        error.json().then(err => {
                            if (!err.titleIsTaken) {
                                this.setState({ productExists: false })
                            }
                            return toast.info(err.message, {
                                className: 'error-toast',
                            })
                        })
                    })
            }
        }

        render() {
            return <Form {...this.state} handleInputChange={this.handleInputChange} handleFormSubmit={this.handleFormSubmit} />
        }

        async componentDidMount() {
            // ensure only admins have access to this page
            const role = sessionManager.getUserInfo().role
            if (role !== 'Admin') {
                // this.props.history.goBack()

                toast.info('You are unauthorized to view this page!', {
                    className: 'error-toast'
                })

                this.setState({ unauthUser: true})
            }

            if (formType !== 'edit') {
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
                            this.setState({ productExists: false })

                            toast.info(err.message, {
                                className: 'error-toast'
                            })
                        })
                })
        }
    }
}

export default withProcessProductForm