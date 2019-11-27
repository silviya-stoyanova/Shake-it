import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import '../../static/css/products.css'
import { UserInfoConsumer } from '../../App'
import useTitle from '../page-title/useTitle'
import withProcessForm from '../hocs/withProcessForm'
import { productValidations } from '../hocs/validations'
import promiseExtraMethods from '../hocs/promiseExtraMethods'

const ProductDetails = (props) => {
    const { _id, title, description, image, price, likes } = props.data
    useTitle(title)
    // <textarea disabled>{description}</textarea>

    const userFunctionalities = (data, _id) => {
        return data.isLogged
            && <Fragment>
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
                        <div className="product-details-wrapper" >
                            {title
                                ? <Fragment>
                                    <div className="product-title">{title}</div>
                                    <img src={'data:image/png;base64, ' + image} alt={title} className="product-img" />
                                    <div className="product-description">{description}</div>

                                    <div className="product-actions">
                                        <span className="product-price-details">Price: {price}<span className="price-sign">$</span></span>
                                        <span className="product-likes">{likes ? likes.length : 0} ♥</span>
                                        {userFunctionalities(data, _id)}
                                    </div>
                                </Fragment>
                                : <img src={require('../../static/images/loading-circle.gif')} alt="loading-img" className="product-img" />
                            }
                        </div>
                    </div>)
            }}
        </UserInfoConsumer>
    )
}

const initialData = {
    // _id: props.match.params.productId,
    title: '',
    description: '',
    image: '',
    price: '',
}

const requestType = null

const extraMethods = {
    success: promiseExtraMethods.product().onProductPromiseSuccess,
    fail: promiseExtraMethods.product().onProductPromiseFail,
}

export default withProcessForm(ProductDetails, 'details', productValidations, initialData, requestType, extraMethods)