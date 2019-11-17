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
            productsInCart: [],
        }
    }

    updateQty = (event, actionType) => {
        const productInfoId = event.target.id
        const jwtToken = sessionManager.getUserInfo().authtoken

        requester.updateQty(productInfoId, actionType, jwtToken)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(res => {
                this.setState({ productsInCart: res.products })
                toast.info(res.success, {
                    className: 'success-toast'
                })

            })
            .catch(err => {
                err.json()
                    .then(error => {
                        toast.info(error.message, {
                            className: 'error-toast'
                        })
                    })
            })
    }

    handleFormSubmit = (e) => {
        e.preventDefault()

    }

    tableHeader = () => {
        return (
            <thead>
                <tr>
                    <td className="cart-header">Product</td>
                    <td className="cart-header">Quantity</td>
                    <td className="cart-header">Price</td>
                    <td className="cart-header">Total</td>
                    <td> </td>
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
                                <span onClick={(e) => { this.updateQty(e, 'decrement') }} id={p._id} className="change-qty" >-</span>
                                <label className="cart-product-qty">{p.quantity}</label>
                                <span onClick={(e) => { this.updateQty(e, 'increment') }} id={p._id} className="change-qty">+</span>
                            </td>
                            <td>{p.product.price}<span className="price-sign">$</span></td>
                            <td>{(p.quantity * p.product.price).toFixed(2)}<span className="price-sign">$</span></td>
                            <td>
                                <span>
                                    <Link className="cart-del-product-img" to={{
                                        pathname: `/cart/remove/${p._id}`
                                    }}>
                                        <img src={require('../../static/images/cart-del-product.png')} alt="cart-del-product-img" className="cart-del-product-img" />
                                    </Link>
                                </span>
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
        const jwtToken = sessionManager.getUserInfo().authtoken

        requester.getCart(jwtToken)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(res => {
                this.setState({ productsInCart: res })
            })
            .catch(err => {
                err.json().then(error => {
                    return toast.info(error.message, {
                        className: 'error-toast',
                    })
                })
            })
    }
}

export default Cart