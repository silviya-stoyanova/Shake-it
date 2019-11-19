import React from 'react'
import { Redirect } from 'react-router-dom'
import withProcessProductForm from './with-product-forms-hoc'

const CreateProduct = (props) => {
    const { unauthUser, titleClass, descriptionClass, priceClass, isCreated, uploadedImg, handleInputChange, handleFormSubmit } = props

    return (
        <div className="form" >
            {unauthUser && <Redirect to='/' />}
            {isCreated && <Redirect to="/" />}

            <form onSubmit={handleFormSubmit} encType="multipart/form-data" >
                <div className="form-type">Add a product</div>
                <hr />

                <div className="form-fields-wrapper">
                    <label htmlFor="title">Title</label>
                    <input autoFocus onChange={handleInputChange} type="text" name="title" className={titleClass} id="title" />

                    <label htmlFor="description">Description</label>
                    <textarea type="text" onChange={handleInputChange} name="description" className={descriptionClass} id="description"></textarea>

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
                        <input type="file" accept="image/*" onChange={handleInputChange} name="image" id="image" />
                    </div>

                    {/* <div>
                            <label className="update-img-content" htmlFor="profilePic">
                                <img className="update-img" src="" alt="update-your-profile-picture" />
                            </label>
                            <input onChange={handleInputChange} type="file" name="profilePic" id="profilePic" />
                        </div> */}


                    <label htmlFor="price">Price</label>
                    <input type="number" onChange={handleInputChange} name="price" className={priceClass} id="price" min="0" step="0.01" />
                </div>

                <hr />
                <button className="button" type="submit">Submit</button>
            </form>
        </div>
    )
}

// export default CreateProduct
export default withProcessProductForm(CreateProduct, 'create')