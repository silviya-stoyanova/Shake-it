import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import { UserInfoConsumer } from '../../App'
import requester from '../utilities/requests-util'
import sessionManager from '../utilities/session-util'
import '../../static/css/user-profile.css'

class UserProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            profilePic: '',
            firstName: '',
            lastName: '',
            email: '',
            adress: '',
            phoneNumber: '',
            purchasedProducts: ''
        }
    }

    handleInputChange = () => {


    }

    handleFormSumbit = (event) => {
        event.preventDefault()
        const { profilePic, firstName, lastName, email, adress, phoneNumber } = this.state
        requester.updateProfileInfo(profilePic, firstName, lastName, email, adress, phoneNumber)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(res => {


            })

    }

    render() {
        const { profilePic, firstName, lastName, email, adress, phoneNumber, purchasedProducts } = this.state

        return <UserInfoConsumer>
            {(data) => (
                <div className='content-wrapper'>
                    {
                        !data.isLogged
                            ? <Fragment>
                                < Redirect to='/user/login' />
                                {toast.info('Please log in to view your profile page!', {
                                    className: 'error-toast'
                                })}
                            </Fragment>
                            : null
                    }

                    <form onSubmit={this.handleFormSumbit} className='profile-wrapper'>
                        <span>
                            <img className='profile-img' src={require('../../static/images/profile-pic.png')} alt="profile-pic" />
                        </span>
                        <span className="user-info-username" >Username: {data.username}</span>
                        <hr />

                        <div className="user-info">
                            <label htmlFor="firstName" >First name:</label>
                            <input onChange={this.handleInputChange} name="firstName" id="firstName" defaultValue={firstName} />

                            <label htmlFor="lastName" >Last name:</label>
                            <input onChange={this.handleInputChange} name="lastName" id="lastName" defaultValue={lastName} />

                            <label htmlFor="email" >Email:</label>
                            <input onChange={this.handleInputChange} name="email" id="email" defaultValue={email} />

                            <label htmlFor="adress" >Adress:</label>
                            <input onChange={this.handleInputChange} name="adress" id="adress" defaultValue={adress} />

                            <label htmlFor="phoneNumber" >Phone number:</label>
                            <input onChange={this.handleInputChange} name="phoneNumber" id="phoneNumber" defaultValue={phoneNumber} />

                            <label htmlFor="purchasedProducts" >Purchased products: {purchasedProducts}</label>
                        </div>

                        <hr />
                        <button type="submit" className="edit-profile-btn">Save changes</button>
                    </form>
                </div >
            )}
        </UserInfoConsumer>
    }

    componentDidMount() {
        const jwtToken = sessionManager.getAuthtoken()

        requester.getProfileInfo(jwtToken)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(res => {
                this.setState({
                    profilePic: res.profilePic,
                    firstName: res.firstName,
                    lastName: res.lastName,
                    email: res.email,
                    adress: res.adress,
                    phoneNumber: res.phoneNumber,
                    purchasedProducts: res.purchasedProducts
                })
            })
            .catch(err => {
                err.json()
                    .then(error => {
                        return toast(error.message, {
                            className: 'error-toast'
                        })
                    })
            })
    }
}

export default UserProfile