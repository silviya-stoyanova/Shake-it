import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../../static/css/order.css'
import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'
import { toast } from 'react-toastify'

class CompleteOrder extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: '',
            productsInCart: []
        }
    }

    handleInputChange = ({ target }) => {
        this.setState(prevState => ({
            user: {
                ...prevState.user,
                [target.name]: target.value
            }
        }))
    }

    handleFormSubmit = (e) => {
        e.preventDefault()
        const jwtToken = sessionManager.getUserInfo().authtoken
        const { firstName, lastName, phoneNumber, email, country, city, postcode, adress, paymentMethod } = this.state.user

        if (!firstName || !lastName || !phoneNumber || !email || !country || !city || !postcode || !adress || !paymentMethod) {
            return toast.info('All fields are mandatory!', {
                className: 'error-toast'
            })
        }

        requester.emptyCart(jwtToken)
            .then(res => {
                this.props.history.push('/thanks-for-ordering')
            })
            .catch(err => {
                toast.info(err.message, {
                    className: 'error-toast'
                })
            })
    }

    render() {
        document.title = 'Shake it - Complete your order'
        const { productsInCart } = this.state
        const { firstName, lastName, phoneNumber, email, country, city, postcode, adress } = this.state.user

        return <div>
            <div className="order-info">
                <form className='order-form' onSubmit={this.handleFormSubmit}>
                    <div className="form-type">Shipping information</div>
                    <hr />
                    <div className='form-giude'>All fields marked with <span className='asterisk'>*</span> are mandatory</div>

                    <div className='order-form-field'>
                        <label htmlFor="first-name">First name </label>
                        <span className='asterisk'>*</span>
                        <input autoFocus id='first-name' onChange={this.handleInputChange} defaultValue={firstName} name="firstName" />
                    </div>
                    <div className='order-form-field'>
                        <label htmlFor="last-name">Last name </label>
                        <span className='asterisk'>*</span>
                        <input id='last-name' onChange={this.handleInputChange} defaultValue={lastName} name="lastName" />
                    </div>
                    <div className='order-form-field order-two-el'>
                        <label htmlFor="phone">Phone </label>
                        <span className='asterisk'>*</span>
                        <input id='phone' onChange={this.handleInputChange} defaultValue={phoneNumber} name="phoneNumber" />
                    </div>
                    <div className='order-form-field order-two-el'>
                        <label htmlFor="email">Email </label>
                        <span className='asterisk'>*</span>
                        <input id='email' type='email' onChange={this.handleInputChange} defaultValue={email} name="email" />
                    </div>
                    <div className='order-form-field order-triple-el'>
                        <label htmlFor="country">Country </label>
                        <span className='asterisk'>*</span>
                        <input id='country' onChange={this.handleInputChange} defaultValue={country} name="country" />
                    </div>
                    <div className='order-form-field order-triple-el'>
                        <label htmlFor="city">City </label>
                        <span className='asterisk'>*</span>
                        <input id='city' onChange={this.handleInputChange} defaultValue={city} name="city" />
                    </div>
                    <div className='order-form-field order-triple-el'>
                        <label htmlFor="postcode">Postcode </label>
                        <span className='asterisk'>*</span>
                        <input id='postcode' onChange={this.handleInputChange} defaultValue={postcode} name="postcode" />
                    </div>
                    <div className='order-form-field order-block-el'>
                        <label htmlFor="address">Street address </label>
                        <span className='asterisk'>*</span>
                        <input id='address' onChange={this.handleInputChange} defaultValue={adress} name="adress" />
                    </div>

                    <div className='order-form-field order-block-el'>
                        <label htmlFor="paymentMethod">Payment method</label>
                        <span className='asterisk'>*</span>

                        <div>
                            <input className='payment-input' type='radio' value='PayPal' id='PayPal' onChange={this.handleInputChange} name="paymentMethod" />
                            <label className='payment-label paypal-logo' htmlFor="PayPal"></label>

                            <input className='payment-input' type='radio' value='Credit/Debit card' id='Credit/Debit card' onChange={this.handleInputChange} name="paymentMethod" />
                            <label className='payment-label' htmlFor="Credit/Debit card">Credit/Debit card</label>

                            <input className='payment-input' type='radio' value='Cash on delivery' id='Cash on delivery' onChange={this.handleInputChange} name="paymentMethod" />
                            <label className='payment-label' htmlFor="Cash on delivery">Cash on delivery</label>
                        </div>

                    </div>

                    <div>
                        By clicking Confirm, you agree to our
                        <Link to='/terms'> Terms </Link>
                        and that you have read our
                        <Link to='/data-use-policy'> Data Use Policy</Link>
                    </div>

                    <hr />
                    <button type="submit" className="button confirm-btn" >Confirm <span role="img" aria-label='milkshake cup'>🍹</span></button>
                </form>
            </div>

            <div className='ordered-products'>
                <div className='ordered-products-heading'>My products</div>
                {/* <div>/to add more info here/</div> */}

                {productsInCart.map(p => {
                    return (
                        <div key={p._id}>
                            <img src={'data:image/png;base64, ' + p.product.image} alt='product' className="cart-img ordered-products-img" />
                            <div>
                                <span>{p.product.title}</span>
                                <span className="cart-product-qty">{p.quantity}</span>
                                <span>{p.product.price}<span className="price-sign">$</span></span>
                                <span>{(p.quantity * p.product.price).toFixed(2)}<span className="price-sign">$</span></span>
                            </div>
                            <hr />
                        </div>
                    )
                })}

                {/* <hr className='hr-vertical' /> */}
            </div>

            <div className='order-total ordered-products-heading'>Total</div>
        </div >
    }

    async componentDidMount() {
        const jwtToken = sessionManager.getUserInfo().authtoken

        requester.getCart(jwtToken)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(cartRes => {
                // this.setState({ productsInCart: cartRes })

                requester.getProfileInfo(jwtToken)
                    .then(res => {
                        if (!res.ok) {
                            return Promise.reject(res)
                        }
                        return res.json()
                    })
                    .then(async userRes => {
                        await this.setState({
                            productsInCart: cartRes,
                            user: userRes
                        })
                    })
                    .catch(err => {
                        err.json()
                            .then(error => {
                                this.props.history.push('/')

                                toast.info(error.message, {
                                    className: 'error-toast'
                                })
                            })
                    })
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

export default CompleteOrder