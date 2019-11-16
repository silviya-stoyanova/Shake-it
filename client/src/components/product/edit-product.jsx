import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import requester from '../utilities/requests-util'
import sessionManager from '../utilities/session-util'
import '../../static/css/products.css'

class EditProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            productId: this.props.match.params.productId,

            title: '',
            description: '',
            image: '',
            newImage: '',
            price: '',

            titleClass: 'correct',
            descriptionClass: 'correct',
            priceClass: 'correct',

            isEditted: false,
            productExists: true
        }
    }

    validateInputFields = (title, description, price) => {
        let [titleClass, descriptionClass, priceClass] = ['error', 'error', 'error', 'error']
        let result = {
            title: 'invalid',
            description: 'invalid',
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
        if (price && Number(price) > 0) {
            priceClass = 'correct'
            result.price = 'valid'
        }

        this.setState({ titleClass, descriptionClass, priceClass })
        return result
    }

    onInputChange = async ({ target }) => {
        let newState
        if (target.files) {
            newState = {
                [target.name]: target.files,
                newImage: URL.createObjectURL(target.files[0])
            }
        } else {
            newState = { [target.name]: target.value.trim() }
        }

        await this.setState(newState)

        const { title, description, price } = this.state
        this.validateInputFields(title, description, price)
    }

    onFormSubmit = (event) => {
        event.preventDefault()
        const jwtToken = sessionManager.getUserInfo().authtoken
        const { productId, title, description, newImage, price } = this.state
        const isInputValid = this.validateInputFields(title, description, price)

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
        if (isInputValid.price === 'invalid') {
            return toast.info('Please enter a valid price.', {
                className: 'error-toast',
            })
        }

        requester.editProduct(productId, title, description, newImage, price, jwtToken)
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
                error.json()
                    .then(err => {
                        if (!err.titleIsTaken) {
                            this.setState({ productExists: false })
                        }
                        return toast.info(err.message, {
                            className: 'error-toast',
                        })
                    })
            })
    }

    render() {
        const { title, description, image, newImage, price, titleClass, descriptionClass, priceClass, isEditted, productExists } = this.state

        return (
            <div className="form" >
                {isEditted ? <Redirect to='/' /> : null}
                {productExists ? null : <Redirect to='/' />}

                <form onSubmit={this.onFormSubmit} encType="multipart/form-data">
                    <div className="form-type">Edit a product</div>
                    <hr />

                    {image
                        ? <div className="form-fields-wrapper">
                            <input autoFocus onChange={this.onInputChange} name="title" defaultValue={title} type="text" className={titleClass} id="title" />


                            <div className="update-img-container">

                                <img src={newImage ? newImage : `data:image/png;base64, ${image}`} alt={title} className="product-img" />

                                <div>
                                    <label className="input-file-container update-img-content" htmlFor="newImage">
                                        <img src={require('../../static/images/update-pic.png')} alt="update-product-picture" className="update-img" />
                                    </label>
                                    <input onChange={this.onInputChange} name="newImage" type="file" accept="image/*" id="newImage" />
                                </div>

                            </div>

                            <label htmlFor="description">Description:</label>
                            <textarea onChange={this.onInputChange} name="description" value={description} type="text" className={descriptionClass} id="description"></textarea>

                            <div className="price">
                                <label htmlFor="price">Price:</label>
                                <input onChange={this.onInputChange} name="price" defaultValue={price} type="number" step='0.01' className={priceClass} id="price" />
                                <span className="price-sign">$</span>
                            </div>
                        </div>
                        : <img src={require('../../static/images/loading-circle.gif')} alt={'loading-img'} className="product-img" />
                    }
                    <hr />
                    <button className="button" type="submit">Edit</button>
                </form>
            </div>
        )
    }

    async componentDidMount() {
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

export default EditProduct