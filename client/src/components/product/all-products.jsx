import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UserInfoConsumer } from '../../App'
import requester from '../../utilities/requests-util'
import '../../static/css/products.css'

class AllProducts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
            isFetched: false
        }

        this.renderAllProducts = this.renderAllProducts.bind(this)
    }

    userFunctionalities = (data, p) => {
        return data.isLogged
            && <Fragment>
                <Link
                    to={{
                        pathname: `/product/like/${p._id}`
                    }} className="product-actions-btn">like
                </Link>
                {
                    data.role === 'Admin'
                    && <Fragment>
                        <Link
                            to={{
                                pathname: `/product/edit/${p._id}`
                            }} className="product-actions-btn">edit
                            </Link>

                        <Link
                            to={{
                                pathname: `/product/delete/${p._id}`
                            }} className="product-actions-btn">delete
                            </Link>
                    </Fragment>
                }
                <Link
                    to={{
                        pathname: `/cart/add/${p._id}`
                    }} className="product-actions-btn add-to-cart-btn">add to cart
                </Link>
            </Fragment>
    }

    renderAllProducts(data) {
        const { products } = this.state

        return (
            <Fragment>
                {
                    products.map(p => {
                        return (
                            <div key={p._id} className="product-wrapper" >
                                <Link className="product-title" to={{
                                    pathname: `/product/details/${p._id}`
                                }}>
                                    {p.title}
                                </Link>

                                <Link to={{
                                    pathname: `/product/details/${p._id}`
                                }} ><img src={'data:image/png;base64, ' + p.image} alt={p.title} className="product-img" />
                                </Link>

                                <div className="product-actions">
                                    <span className="product-price">Price: {p.price}<span className="price-sign">$</span></span>
                                    <span className="product-likes">{p.likes ? p.likes.length : 0} ♥</span>
                                    {this.userFunctionalities(data, p)}
                                </div>
                            </div>
                        )
                    })
                }
            </Fragment >
        )
    }

    // <h1>Our site is under constructtion. We will be ready soon..</h1>
    // <h2>xoxo</h2>
    render() {
        const { products, isFetched } = this.state

        return (
            <div className='content-wrapper' >

                <UserInfoConsumer>
                    {(data) => (

                        isFetched
                            ? products.length
                                ? this.renderAllProducts(data)
                                : (<div className="no-products-container">
                                    <div className="no-products-text-container">
                                        <h1>Our products are so desired that we could not predict we would run out of stock this soon..</h1>
                                        <h2>Sorry!</h2>
                                    </div>

                                    <div className="no-products-img"></div>
                                </div>)
                            : < div className="product-wrapper" >
                                <img src={require('../../static/images/loading-circle.gif')} alt="loading-img" className="product-img" />
                            </ div>
                    )}
                </UserInfoConsumer>
            </div>
        )
    }

    componentDidMount() {
        document.title = 'Shake it - Your shake is a click away'

        requester.getAllProducts()
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(allProducts => {
                this.setState({
                    products: allProducts,
                    isFetched: true
                })
            })
            .catch(err => {
                err.json()
                    .then(res => {
                        toast.info(res.message, {
                            className: 'error-toast',
                        })
                    })
            })
    }
}

export default AllProducts