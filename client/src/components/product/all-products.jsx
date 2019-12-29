import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UserInfoConsumer } from '../../App'
import requester from '../../utilities/requests-util'
import '../../static/css/products.css'
import '../../static/css/search.css'

class AllProducts extends Component {
    constructor(props) {
        super(props)
        this.state = {
            products: [],
            filteredProducts: [],
            isFetched: false
        }

        this.renderProducts = this.renderProducts.bind(this)
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

    filterProducts = async (query) => {
        const { products } = this.state
        const filteredProducts = products.filter(p => p.title.toLowerCase().includes(query.toLowerCase()))

        await this.setState({
            filteredProducts
        })
    }

    onSearchChange = (e) => {
        const querySearch = e.target.value
        this.filterProducts(querySearch)
    }

    searchField = () => (
        <div className="search">
            <label htmlFor="search">Find milkshake: </label>
            <input onChange={this.onSearchChange} name="search" placeholder="type here" type="text" id="search" />
        </div>
    )

    userFunctionalities = (data, id) => {
        return data.isLogged
            && <Fragment>
            <div className="btn-group">
                <Link
                    to={{
                        pathname: `/product/like/${id}`
                    }} className="product-actions-btn">like
                </Link>
                {
                    data.role === 'Admin'
                    && <Fragment>
                        <Link
                            to={{
                                pathname: `/product/edit/${id}`
                            }} className="product-actions-btn">edit
                            </Link>

                        <Link
                            to={{
                                pathname: `/product/delete/${id}`
                            }} className="product-actions-btn">delete
                            </Link>
                    </Fragment>
                }
             </div>
                <Link
                    to={{
                        pathname: `/cart/add/${id}`
                    }} className="product-actions-btn add-to-cart-btn">add to cart
                </Link>
            </Fragment>
    }

    renderProducts = (data, products) => (
        <Fragment>
            {products.map(p => {
                return (
                    <div key={p._id} className="product-wrapper" >
                        <Link to={{
                            pathname: `/product/details/${p._id}`
                        }} ><img src={'data:image/png;base64, ' + p.image} alt={p.title} className="product-img" />
                        </Link>

                        <Link className="product-title" to={{
                            pathname: `/product/details/${p._id}`
                        }}>
                            {p.title}
                        </Link>


                        <span className="product-price">Price: {p.price}<span className="price-sign">$</span></span>
                        <span className="product-likes">{p.likes ? p.likes.length : 0} ♥</span>
                        <div className="product-actions">
                            {this.userFunctionalities(data, p._id)}
                        </div>
                    </div>
                )
            })}
        </Fragment >
    )

    render() {
        const { products, isFetched, filteredProducts } = this.state
        const productsToRender = filteredProducts.length ? filteredProducts : products

        return (
            <div className='content-wrapper' >
                <UserInfoConsumer>
                    {(data) => (
                        isFetched
                            ? productsToRender.length
                                ? (
                                    <Fragment>
                                        {this.searchField()}
                                        {this.renderProducts(data, productsToRender)}
                                    </Fragment>)
                                : (this.noProductsLeft())

                            : this.showLoading()
                    )}
                </UserInfoConsumer>
            </div>
        )
    }

    componentDidMount() {
        document.title = 'Shake it - Your shake is a click away'
        const { service } = this.props

        service()
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