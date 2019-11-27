import React from 'react'
import { Link } from 'react-router-dom'
import '../../static/css/products.css'
import withProcessForm from '../hocs/withProcessForm'
import useTitle from '../page-title/useTitle'
import { productValidations } from '../hocs/validations'
import promiseExtraMethods from '../hocs/promiseExtraMethods'

const DeleteProduct = (props) => {
    const { handleFormSubmit } = props
    const { image, title, description, price } = props.data
    useTitle(`Delete ${title}`)

    return (
        <div className="form" >
            <form onSubmit={handleFormSubmit}>
                <div className="form-type">Are you sure you want</div>
                <div className="form-type">to delete this product?</div>
                <hr />

                {image
                    ? <div className="form-fields-wrapper">
                        <div className="product-title">{title}</div>

                        <img src={'data:image/png;base64, ' + image} alt={title} className="product-img" />

                        <label htmlFor="description">Description</label>
                        <textarea defaultValue={description} type="text" id="description" disabled></textarea>

                        <div className="price">
                            <label htmlFor="price">Price:</label>
                            <input value={price} id="price" disabled />
                            <span className="price-sign">$</span>
                        </div>
                    </div>

                    : <img src={require('../../static/images/loading-circle.gif')} alt={'loading'} className="product-img" />
                }

                <hr />
                <button className="button btn-del" type="submit">Yes</button>
                <Link to="/" className="button btn-del">No</Link>
            </form>
        </div>
    )
}

const initialData = {
    // _id: this.props.match.params.productId,
    title: '',
    description: '',
    image: '',
    price: '',
}

const requestType = 'deleteProduct'

const extraMethods = {
    success: promiseExtraMethods.product().onProductPromiseSuccess,
    fail: promiseExtraMethods.product().onProductPromiseFail,
}

export default withProcessForm(DeleteProduct, 'delete', productValidations, initialData, requestType, extraMethods)