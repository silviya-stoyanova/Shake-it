import React, { Component } from 'react'
import '../../static/css/order.css'
import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'
import { toast } from 'react-toastify'

class CompleteOrder extends Component {
    constructor(props) {
        super(props)

        this.state = {
            user: ''
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
        const { firstName, lastName, phoneNumber, email, country, city, postcode, adress } = this.state.user

        if (!firstName || !lastName || !phoneNumber || !email || !country || !city || !postcode || !adress) {
            return toast.info('All fields are mandatory!', {
                className: 'error-toast'
            })
        }

        this.props.history.push('/thanks-for-ordering')
    }

    render() {
        document.title = 'Shake it - Complete your order'
        const { firstName, lastName, phoneNumber, email, country, city, postcode, adress } = this.state.user

        return <React.Fragment>
            <div className="form">
                <form className='order-form'>
                    <div className="form-type">My products</div>
                    <div>/to add more info here/</div>
                    <hr />
                </form>
            </div>

            <div className="form">
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
                        <input id='email' onChange={this.handleInputChange} defaultValue={email} name="email" />
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
                            <label className='payment-label' htmlFor="PayPal">PayPal</label>

                            <input className='payment-input' type='radio' value='Credit/Debit card' id='Credit/Debit card' onChange={this.handleInputChange} name="paymentMethod" />
                            <label className='payment-label' htmlFor="Credit/Debit card">Credit/Debit card</label>

                            <input className='payment-input' type='radio' value='Cash on delivery' id='Cash on delivery' onChange={this.handleInputChange} name="paymentMethod" />
                            <label className='payment-label' htmlFor="Cash on delivery">Cash on delivery</label>
                        </div>

                        {/* PayPal, Credit/Debit card, Cash on delivery */}
                        {/* <input id='paymentMethod' onChange={this.handleInputChange} name="paymentMethod" /> */}
                    </div>


                    <hr />
                    <button type="submit" className="button confirm-btn" >Confirm <span role="img" aria-label='milkshake cup'>🍹</span></button>
                </form>
            </div>
        </React.Fragment >
    }

    async componentDidMount() {
        const jwtToken = sessionManager.getUserInfo().authtoken

        requester.getProfileInfo(jwtToken)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(async res => {
                await this.setState({ user: res })
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
    }
}

export default CompleteOrder