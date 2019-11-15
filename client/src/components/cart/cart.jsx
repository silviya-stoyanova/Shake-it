import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import requester from '../utilities/requests-util'
import sessionManager from '../utilities/session-util'
import '../../static/css/cart.css'

class Cart extends Component {
    constructor(props) {
        super(props)
        this.state = {
            productsInCart: []
        }
    }

    handleInputChange = () => {


    }

    handleFormSubmit = () => {


    }

    tableHeader = () => {
        return (
            <thead>
                <tr className="cart-header">
                    <td>Product</td>
                    <td>Quantity</td>
                    <td>Price</td>
                    <td>Total</td>
                </tr>
            </thead>
        )
    }

    tableBody = () => {
        const { productsInCart } = this.state

        return (
            <tbody>
                {productsInCart.map(p => {
                    return (
                        <tr key={p._id}>
                            <td>
                                <Link to={{
                                    pathname: `/product/details/${p.product._id}`
                                }}>
                                    {p.product.title}
                                </Link>
                            </td>
                            <td>
                                <input className="cart-product-qty" onChange={this.handleInputChange} type="number" min="1" value={p.quantity} />
                            </td>
                            <td>{p.product.price}<span className="price-sign">$</span></td>
                            <td>{p.quantity * p.product.price}<span className="price-sign">$</span></td>
                            <td>
                                <Link to={{
                                    pathname: `/cart/remove/${p._id}`
                                }}>
                                    <img src={require('../../static/images/cart-del-product.png')} alt="cart-del-product-img" className="cart-del-product-img" />
                                </Link>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    render() {
        return (
            <div className="form" >
                <form onSubmit={this.handleFormSubmit} encType="multipart/form-data" className="cart-form">
                    <div className="form-type">Shopping cart</div>
                    <hr />

                    <div className="form-fields-wrapper">
                        <table className="cart-table">
                            {this.tableHeader()}
                            {this.tableBody()}
                        </table>
                    </div>

                    <hr />
                    <button type="submit" className="button">Complete order</button>
                </form>
            </div>
        )
    }

    componentDidMount() {
        const jwtToken = sessionManager.getAuthtoken()

        requester.getCart(jwtToken)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(res => {
                console.log(res)

                this.setState({ productsInCart: res })
            })
            .catch(err => {
                err.json().then(error => {
                    console.log(error)

                    return toast.info(error.message, {
                        className: 'error-toast',
                    })
                })
            })
    }
}

export default Cart