import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import '../../static/css/products.css'
import { UserInfoConsumer } from '../../App'
import useTitle from '../page-title/useTitle'
import withProcessForm from '../hocs/withProcessForm'

const ProductDetails = (props) => {
    const { _id, title, description, image, price, likes } = props.data
    useTitle(title)
    // <textarea disabled>{description}</textarea>

    const userFunctionalities = (data, _id) => {
        return data.isLogged
            && <Fragment>
                <div className="btn-group">

                    <Link
                        to={{
                            pathname: `/product/like/${_id}`
                        }} className="product-actions-btn">like
                </Link>

                    {
                        data.role === 'Admin'
                        && <Fragment>
                            <Link
                                to={{
                                    pathname: `/product/edit/${_id}`
                                }} className="product-actions-btn">edit
                            </Link>

                            <Link
                                to={{
                                    pathname: `/product/delete/${_id}`
                                }} className="product-actions-btn">delete
                            </Link>
                        </Fragment>
                    }
                </div>
                <Link
                    to={{
                        pathname: `/cart/add/${_id}`
                    }} className="product-actions-btn add-to-cart-btn">add to cart
                </Link>
            </Fragment>
    }

    return (
        <UserInfoConsumer>
            {(data) => {
                return (
                    <div className='content-wrapper'>
                        <div className="product-details-wrapper product-wrapper" >
                            {title
                                ? <Fragment>
                                    {/* className='img-container' */}
                                    <div className='relative-container'>
                                        <img src={'data:image/png;base64, ' + image} alt={title} className="product-img-details" />
                                        <span className="product-likes">{likes ? likes.length : 0} ♥</span>
                                    </div>
                                    <div className="product-title">{title}</div>
                                    <div className="product-description">{description}</div>

                                    <span className="product-price-details">Price: {price}<span className="price-sign">$</span></span>
                                    <div className="product-actions">
                                        {userFunctionalities(data, _id)}
                                    </div>
                                </Fragment>
                                : <img src={require('../../static/images/loading-circle.gif')} alt="loading-img" className="product-img-details" />
                            }
                        </div>
                    </div>)
            }}
        </UserInfoConsumer>
    )
}

const initialData = {
    title: '',
    description: '',
    image: '',
    price: '',
}

const requestType = null

export { ProductDetails }     // for testing purposes only
export default withProcessForm(ProductDetails, 'details', null, initialData, requestType, null) // replaced productValidations, extraMethods with null