import React, { Component, Fragment } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UserInfoConsumer } from '../../App'
import requester from '../utilities/requests-util'
import '../../static/css/products.css'

class ProductDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: {},
            productExists: true,
            isFetched: false
        }
    }

    userFunctionalities = (data, _id) => {
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

    render() {
        const { _id, title, description, image, price, likes } = this.state.product
        const { isFetched } = this.state
        // <textarea disabled>{description}</textarea>

        return (
            <UserInfoConsumer>
                {(data) => {
                    return (
                        <div className='content-wrapper'>
                            {
                                !this.state.productExists && <Redirect to='/' />
                            }
                            <div className="product-details-wrapper" >
                                {isFetched
                                    ? <Fragment>
                                        <div className="product-title">{title}</div>
                                        <img src={'data:image/png;base64, ' + image} alt={title} className="product-img" />
                                        <div className="product-description">{description}</div>

                                        <div className="product-actions">
                                            <span className="product-price-details">Price: {price}<span className="price-sign">$</span></span>
                                            <span className="product-likes">{likes ? likes.length : 0} ♥</span>
                                            {this.userFunctionalities(data, _id)}
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

    async  componentDidMount() {
        // toast.info('Loading...', {
        //     className: 'loading-toast'
        // })
        const id = this.props.match.params.productId

        await requester.getProductInfo(id)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(async product => {
                await this.setState({
                    product,
                    isFetched: true
                })
            })
            .catch(error => {
                this.setState({ productExists: false })

                error.json()
                    .then(err => {
                        toast.info(err.message, {
                            className: 'error-toast'
                        })
                    })
            })
    }
}

export default ProductDetails