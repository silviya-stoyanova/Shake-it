import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import requester from '../utilities/requests-util'
import sessionManager from '../utilities/session-util'

class CreateProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            description: '',
            image: '',
            price: '',

            titleClass: '',
            descriptionClass: '',
            imageClass: '',
            priceClass: '',

            isCreated: false,
            uploadedImg: ''
        }
    }

    validateInputFields = (title, description, image, price) => {
        let [titleClass, descriptionClass, imageClass, priceClass] = ['error', 'error', 'error', 'error']
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
        if (image) {
            imageClass = 'correct'
            result.image = 'valid'
        }
        if (price && Number(price) > 0) {
            priceClass = 'correct'
            result.price = 'valid'
        }

        this.setState({ titleClass, descriptionClass, imageClass, priceClass })
        return result
    }

    handleInputChange = async ({ target }) => {
        // console.log(target.files)

        let newState =
            target.files
                ? {
                    [target.name]: target.files,
                    uploadedImg: URL.createObjectURL(target.files[0])
                }
                : { [target.name]: target.value.trim() }

        await this.setState(newState)

        // await this.setState(prevState => {
        //     if (target.files) {
        //         return { [target.name]: target.files }
        //     } else {
        //         return { [target.name]: target.value.trim() }
        //     }
        // })

        const { title, description, image, price } = this.state
        this.validateInputFields(title, description, image, price)
    }

    handleFormSubmit = async (event) => {
        event.preventDefault()
        const jwtToken = sessionManager.getUserInfo().authtoken

        const { title, description, image, price } = this.state
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
        if (isInputValid.image === 'invalid') {
            return toast.info('Please provide an image.', {
                className: 'error-toast',
            })
        }
        if (isInputValid.price === 'invalid') {
            return toast.info('Please enter a valid price.', {
                className: 'error-toast',
            })
        }

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
    }

    render() {
        const { titleClass, descriptionClass, priceClass, imageClass, isCreated, uploadedImg } = this.state

        return (
            <div className="form" >
                {isCreated ? <Redirect to="/" /> : null}

                <form onSubmit={this.handleFormSubmit} encType="multipart/form-data" >
                    <div className="form-type">Add a product</div>
                    <hr />

                    <div className="form-fields-wrapper">
                        <label htmlFor="title">Title</label>
                        <input autoFocus onChange={this.handleInputChange} type="text" name="title" className={titleClass} id="title" />

                        <label htmlFor="description">Description</label>
                        <textarea type="text" onChange={this.handleInputChange} name="description" className={descriptionClass} id="description"></textarea>

                        <div className="update-img-container">
                            <label className="input-file-container" htmlFor="image">
                                <div className="upload-img-text-wrapper">
                                    <span className="upload-img-text">Upload an image</span>
                                    <img className="update-img" style={{ left: '20%', top: '5%' }} src={require('../../static/images/update-pic.png')} alt="update-product-picture" />
                                </div>

                                <div className="img-visualiser">
                                    {uploadedImg
                                        ? <img src={uploadedImg} className="product-img" />
                                        : <img src={require('../../static/images/create-product-img.png')} className="product-img opacity-img" />
                                    }
                                </div>
                            </label>
                            <input type="file" accept="image/*" onChange={this.handleInputChange} name="image" id="image" />
                        </div>

                        {/* <div>
                            <label className="update-img-content" htmlFor="profilePic">
                                <img className="update-img" src="" alt="update-your-profile-picture" />
                            </label>
                            <input onChange={this.handleInputChange} type="file" name="profilePic" id="profilePic" />
                        </div> */}


                        <label htmlFor="price">Price</label>
                        <input type="number" onChange={this.handleInputChange} name="price" className={priceClass} id="price" min="0" step="0.01" />
                    </div>

                    <hr />
                    <button className="button" type="submit">Submit</button>
                </form>
            </div>
        )
    }
}

export default CreateProduct