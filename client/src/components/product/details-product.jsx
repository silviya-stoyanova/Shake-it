import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { UserInfoConsumer } from '../../App'
import '../../static/css/products.css'
import withProcessProductForm from './with-product-forms-hoc'
import useTitle from '../page-title/useTitle'

const ProductDetails = (props) => {
    const { productId, title, description, image, price, likes } = props
    useTitle(title)
    // <textarea disabled>{description}</textarea>

    const userFunctionalities = (data, productId) => {
        return data.isLogged
            && <Fragment>
                <Link
                    to={{
                        pathname: `/product/like/${productId}`
                    }} className="product-actions-btn">like
                </Link>

                {
                    data.role === 'Admin'
                    && <Fragment>
                        <Link
                            to={{
                                pathname: `/product/edit/${productId}`
                            }} className="product-actions-btn">edit
                            </Link>

                        <Link
                            to={{
                                pathname: `/product/delete/${productId}`
                            }} className="product-actions-btn">delete
                            </Link>
                    </Fragment>
                }

                <Link
                    to={{
                        pathname: `/cart/add/${productId}`
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
                                        {userFunctionalities(data, productId)}
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

export default withProcessProductForm(ProductDetails, 'details')