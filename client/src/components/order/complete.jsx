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

    handleInputChange = () => {


    }

    handleFormSubmit = (e) => {
        e.preventDefault()

    }

    render() {
        document.title = 'Shake it - Complete your order'

        const { firstName, lastName, adress } = this.state.user

        return <React.Fragment>
            <div className="form">
                <form className='order-form'>
                    <div className="form-type">My products</div>
                    <div>/to add more info here/</div>
                    <hr />
                </form>
            </div>

            <div className="form">
                <form className='order-form'>
                    <div className="form-type">Shipping information</div>
                    <hr />
                    <div className='form-giude'>All fields marked with <span className='asterisk'>*</span> are mandatory</div>

                    <div className='order-form-field'>
                        <label for="first-name">First name </label>
                        <span className='asterisk'>*</span>
                        <input id='first-name' autoFocus onChange={this.handleInputChange} value={firstName} />
                    </div>
                    <div className='order-form-field'>
                        <label for="last-name">Last name </label>
                        <span className='asterisk'>*</span>
                        <input id='last-name' onChange={this.handleInputChange} value={lastName} />
                    </div>
                    <div className='order-form-field order-block-el'>
                        <label for="email">Email </label>
                        <span className='asterisk'>*</span>
                        <input id='email' />
                    </div>
                    <div className='order-form-field order-triple-el'>
                        <label for="country">Country </label>
                        <span className='asterisk'>*</span>
                        <input id='country' />
                    </div>
                    <div className='order-form-field order-triple-el'>
                        <label for="city">City </label>
                        <span className='asterisk'>*</span>
                        <input id='city' />
                    </div>
                    <div className='order-form-field order-triple-el'>
                        <label for="postcode">Postcode </label>
                        <span className='asterisk'>*</span>
                        <input id='postcode' />
                    </div>
                    <div className='order-form-field order-block-el'>
                        <label for="address">Street address </label>
                        <span className='asterisk'>*</span>
                        <input id='address' onChange={this.handleInputChange} value={adress} />
                    </div>

                    <hr />
                    <button type="submit" className="button" >Confirm <span role="img" aria-label='milkshake cup'>🍹</span></button>
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
                debugger
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