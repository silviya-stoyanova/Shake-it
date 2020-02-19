import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UserInfoConsumer } from '../../App'
import { filterProducts, onSearchChange } from '../search/helpers'
import SearchField from '../search/search-field'
import requester from '../../utilities/requests-util'
import '../../static/css/products.css'

class AllProducts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
            filteredProducts: [],
        }

        // this.renderProducts = this.renderProducts.bind(this)
        this.filterProducts = filterProducts.bind(this)
        this.onSearchChange = onSearchChange.bind(this)
        this.SearchField = SearchField.bind(this)
    }

    static defaultProps = {
        service: requester.getAllProducts
    }

    showLoading = () => (
        <div className="product-wrapper" >
            <img src={require('../../static/images/loading-circle.gif')} alt="loading-img" className="product-img" />
        </div>
    )

    noProductsLeft = () => (
        <div className="no-products-container">
            <div className="no-products-text-container">
                <h1>Our products are so desired that we could not predict we would run out of stock this soon..</h1>
                <h2>Sorry!</h2>
            </div>

            <div className="no-products-img"></div>
        </div>
    )

    userFunctionalities = (data, productId) => {
        return data.isLogged
            && <Fragment>
                <div className="btn-group">
                    <Link to={{ pathname: `/product/like/${productId}` }} className="product-actions-btn">
                        like
                    </Link>
                    {
                        data.role === 'Admin'
                        && <Fragment>
                            <Link to={{ pathname: `/product/edit/${productId}` }} className="product-actions-btn">
                                edit
                            </Link>

                            <Link to={{ pathname: `/product/delete/${productId}` }} className="product-actions-btn">
                                delete
                            </Link>
                        </Fragment>
                    }
                </div>
                <Link to={{ pathname: `/cart/add/${productId}` }} className="product-actions-btn add-to-cart-btn">
                    add to cart
                </Link>
            </Fragment>
    }

    Products = (data, products) => (
        <Fragment>
            {products.map(p => {
                return (
                    <div key={p._id} className="product-wrapper" >
                        <Link to={{ pathname: `/product/details/${p._id}` }} >
                            <div className='img-container'>
                                <img src={'data:image/png;base64, ' + p.image} alt={p.title} className="product-img" />
                                <span className="product-likes">{p.likes ? p.likes.length : 0} ♥</span>
                            </div>
                        </Link>

                        <Link className="product-title" to={{ pathname: `/product/details/${p._id}` }}>
                            {p.title}
                        </Link>

                        <span className="product-price">Price: {p.price}<span className="price-sign">$</span></span>
                        <div className="product-actions">
                            {this.userFunctionalities(data, p._id)}
                        </div>
                    </div>
                )
            })}
        </Fragment >
    )

    render() {
        const { products, filteredProducts } = this.state
        const productsToRender = filteredProducts.length ? filteredProducts : products

        return (
            <div className='content-wrapper' >
                <UserInfoConsumer>
                    {(data) => (
                        products.length
                            ? productsToRender.length
                                ? (
                                    <Fragment>
                                        {this.SearchField(products)}
                                        {this.Products(data, productsToRender)}
                                    </Fragment>)
                                : (this.noProductsLeft())

                            : this.showLoading()
                    )}
                </UserInfoConsumer>
            </div>
        )
    }

    componentDidMount() {
        document.title = 'Your shake is a click away - Shake it'
        const { service } = this.props

        service()
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(products => {
                this.setState({ products })
            })
            .catch(err => {
                err.json()
                    .then(res => {
                        toast.info(res.message, {
                            className: 'error-toast'
                        })
                    })
            })
    }
}

export default AllProducts