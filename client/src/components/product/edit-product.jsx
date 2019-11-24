import React from 'react'
import '../../static/css/products.css'
import withProcessForm from '../hocs/withProcessForm'
import useTitle from '../page-title/useTitle'
import { productValidations } from '../hocs/validations'

const EditProduct = (props) => {
    const { handleInputChange, handleFormSubmit } = props
    const { title, description, image, uploadedImg, price, titleClass, descriptionClass, priceClass } = props.productInfo
    useTitle(`Edit ${title}`)

    return (
        <div className="form" >

            <form onSubmit={handleFormSubmit} encType="multipart/form-data">
                <div className="form-type">Edit a product</div>
                <hr />

                {image
                    ? <div className="form-fields-wrapper">
                        <input autoFocus onChange={handleInputChange} name="title" defaultValue={title} type="text" className={titleClass} id="title" />

                        <div className="update-img-container">
                            <img src={uploadedImg ? uploadedImg : `data:image/png;base64, ${image}`} alt={title} className="product-img" />

                            <div>
                                <label className="input-file-container update-img-content" htmlFor="uploadedImg">
                                    <img src={require('../../static/images/update-pic.png')} alt="update-product" className="update-img" />
                                </label>
                                <input onChange={handleInputChange} name="image" type="file" accept="image/*" id="uploadedImg" />
                            </div>
                        </div>

                        <label htmlFor="description">Description:</label>
                        <textarea onChange={handleInputChange} name="description" value={description} type="text" className={descriptionClass} id="description"></textarea>

                        <div className="price">
                            <label htmlFor="price">Price:</label>
                            <input onChange={handleInputChange} name="price" defaultValue={price} type="number" step='0.01' className={priceClass} id="price" />
                            <span className="price-sign">$</span>
                        </div>
                    </div>
                    : <img src={require('../../static/images/loading-circle.gif')} alt={'loading-img'} className="product-img" />
                }
                <hr />
                <button className="button" type="submit">Save changes</button>
            </form>
        </div>
    )
}

const initialData = {
    _id: this.props.match.params.productId,
    title: '',
    description: '',
    image: '',
    price: '',

    titleClass: 'correct',
    descriptionClass: 'correct',
    priceClass: 'correct',

    uploadedImg: ''
}

export default withProcessForm(EditProduct, 'edit', productValidations, initialData)