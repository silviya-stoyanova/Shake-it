import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import '../../static/css/products.css'
import withProcessProductForm from './with-product-forms-hoc'

class EditProduct extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { title, description, image, uploadedImg, price, titleClass, descriptionClass, priceClass, isEditted, productExists, handleInputChange, handleFormSubmit } = this.props // this.state
        console.log(handleFormSubmit)

        return (
            <div className="form" >
                {isEditted && <Redirect to='/' />}
                {!productExists && <Redirect to='/' />}

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
                                        <img src={require('../../static/images/update-pic.png')} alt="update-product-picture" className="update-img" />
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
                    <button className="button" type="submit">Edit</button>
                </form>
            </div>
        )
    }
}

// export default EditProduct
export default withProcessProductForm(EditProduct, 'edit')