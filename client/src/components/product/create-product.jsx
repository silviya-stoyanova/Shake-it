import React from 'react'
import withProcessForm from '../hocs/withProcessForm'
import useTitle from '../page-title/useTitle'
import { productValidations } from '../hocs/validations'
import promiseExtraMethods from '../hocs/promiseExtraMethods'

const CreateProduct = (props) => {
    useTitle('Add a new product')
    const { handleInputChange, handleFormSubmit } = props
    const { title, description, price,
        titleClass, descriptionClass, imageClass, priceClass, uploadedImg } = props.data

    return (
        <section className="form" >
            <form onSubmit={handleFormSubmit} encType="multipart/form-data" >
                <div className="form-type">Add a product</div>
                <hr />

                <div className="form-fields-wrapper">
                    <label htmlFor="title">Title</label>
                    <input autoFocus value={title} onChange={handleInputChange} type="text" name="title" className={titleClass} id="title" />

                    <label htmlFor="description">Description</label>
                    <textarea value={description} onChange={handleInputChange} type="text" name="description" className={descriptionClass} id="description"></textarea>

                    <div className="update-img-container">
                        <label className="input-file-container" htmlFor="image">
                            <div className="upload-img-text-wrapper">
                                <span className="upload-img-text">Upload an image</span>
                                <img className="update-img" style={{ left: '20%', top: '5%' }} src={require('../../static/images/update-pic.png')} alt="update-product" />
                            </div>

                            <div className="img-visualiser">
                                {uploadedImg
                                    ? <img src={uploadedImg} className="add-product-img" alt="product-img" />
                                    : <img src={require('../../static/images/create-product-img.png')} className="add-product-img opacity-img" alt="product-img" />
                                }
                            </div>
                        </label>
                        <input type="file" accept="image/*" onChange={handleInputChange} name="image" id="image" className={imageClass} />
                    </div>

                    <label htmlFor="price">Price</label>
                    <input type="number" value={price} onChange={handleInputChange} name="price" className={priceClass} id="price" min="0" step="0.01" />
                </div>

                <hr />
                <button className="button" type="submit">Submit</button>
            </form>
        </section>
    )
}

const initialData = {
    title: '',
    description: '',
    image: '',
    price: '',

    titleClass: '',
    descriptionClass: '',
    imageClass: '',              // new, just for testing purposes
    priceClass: '',

    uploadedImg: ''
}

const requestType = 'createProduct'

const extraMethods = {
    success: promiseExtraMethods.product().onProductPromiseSuccess,
    fail: promiseExtraMethods.product().onProductPromiseFail,
}

export { CreateProduct }
export default withProcessForm(CreateProduct, 'create', productValidations, initialData, requestType, extraMethods)