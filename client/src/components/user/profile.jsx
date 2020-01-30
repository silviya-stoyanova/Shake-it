import React, { Component, Fragment } from 'react'
import { toast } from 'react-toastify'
import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'
import '../../static/css/user-profile.css'

class UserProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            profilePic: '',
            firstName: '',
            lastName: '',
            email: '',
            country: '',
            city: '',
            postcode: '',
            adress: '',
            phoneNumber: '',
            purchasedProducts: '',

            uploadedImg: ''
        }
    }

    static defaultProps = {
        serviceOnSubmit: requester.updateProfileInfo,
        serviceOnMount: requester.getProfileInfo,
        toast: toast
    }

    handleInputChange = ({ target }) => {
        let newState = target.files
            ? {
                [target.name]: target.files,
                uploadedImg: URL.createObjectURL(target.files[0])
            }
            : { [target.name]: target.value.trim() }

        this.setState(newState)
    }

    handleFormSumbit = (event) => {
        event.preventDefault()
        const jwtToken = sessionManager.getUserInfo().authtoken
        const { profilePic, firstName, lastName, phoneNumber, email, country, city, postcode, adress } = this.state
        const { toast, serviceOnSubmit } = this.props
        serviceOnSubmit(profilePic, firstName, lastName, phoneNumber, email, country, city, postcode, adress, jwtToken)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(res => {
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

    render() {
        const { username, profilePic, firstName, lastName, email, country, city,
            postcode, adress, phoneNumber, purchasedProducts, uploadedImg } = this.state

        return (
            <div className='content-wrapper'>
                <form onSubmit={this.handleFormSumbit} className='profile-wrapper' encType="multipart/form-data">
                    <div className="update-img-container">
                        {
                            profilePic
                                ? <Fragment>
                                    <div>
                                        <img className='profile-img' src={uploadedImg ? uploadedImg : `data:image/png;base64, ${profilePic}`} alt="profile-pic" />
                                    </div>
                                    <div>
                                        <label className="update-img-content" htmlFor="profilePic">
                                            <img className="update-img" src={require('../../static/images/update-pic.png')} alt="update-profile" />
                                        </label>
                                        <input onChange={this.handleInputChange} type="file" name="profilePic" id="profilePic" />
                                    </div>
                                </Fragment>
                                : <img className='profile-img' src={require('../../static/images/loading-circle.gif')} alt="profile-pic" />
                        }
                    </div>

                    <span className="user-info-username" >Username: {username}</span>
                    <hr />

                    <div className="user-info">
                        <label htmlFor="firstName" >First name:</label>
                        <input onChange={this.handleInputChange} name="firstName" id="firstName" defaultValue={firstName} />

                        <label htmlFor="lastName" >Last name:</label>
                        <input onChange={this.handleInputChange} name="lastName" id="lastName" defaultValue={lastName} />

                        <label htmlFor="phoneNumber" >Phone:</label>
                        <input onChange={this.handleInputChange} name="phoneNumber" id="phoneNumber" defaultValue={phoneNumber} />

                        <label htmlFor="email" >Email:</label>
                        <input onChange={this.handleInputChange} name="email" type="email" id="email" defaultValue={email} />

                        <label htmlFor="country" >Country:</label>
                        <input onChange={this.handleInputChange} name="country" id="country" defaultValue={country} />

                        <label htmlFor="city" >City:</label>
                        <input onChange={this.handleInputChange} name="city" id="city" defaultValue={city} />

                        <label htmlFor="postcode" >Postcode:</label>
                        <input onChange={this.handleInputChange} name="postcode" id="postcode" defaultValue={postcode} />

                        <label htmlFor="adress" >Shipping address:</label>
                        <input onChange={this.handleInputChange} name="adress" id="adress" defaultValue={adress} />

                        <label>Purchased products: {purchasedProducts}</label>
                    </div>

                    <hr />
                    <button type="submit" className="edit-profile-btn" disabled={username ? false : true} >Save changes</button>
                </form>
            </div >
        )
    }

    componentDidMount() {
        document.title = 'My profile - Shake it'
        const jwtToken = sessionManager.getUserInfo().authtoken

        const { serviceOnMount } = this.props
        const { toast } = this.props

        // requester.getProfileInfo(jwtToken)
        serviceOnMount(jwtToken)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(res => {
                this.setState({
                    username: res.username,
                    // profilePic: res.profilePic !== 'undefined' ? res.profilePic : '',
                    profilePic: res.profilePic,
                    firstName: res.firstName !== 'undefined' ? res.firstName : '',
                    lastName: res.lastName !== 'undefined' ? res.lastName : '',
                    email: res.email !== 'undefined' ? res.email : '',
                    country: res.country !== 'undefined' ? res.country : '',
                    city: res.city !== 'undefined' ? res.city : '',
                    postcode: res.postcode !== 'undefined' ? res.postcode : '',
                    adress: res.adress !== 'undefined' ? res.adress : '',
                    phoneNumber: res.phoneNumber !== 'undefined' ? res.phoneNumber : '',
                    purchasedProducts: res.purchasedProducts !== null ? res.purchasedProducts : 0
                })
            })
            .catch(err => {
                err.json()
                    .then(error => {
                        return toast.info(error.message + ' Please fill in the login form and try again.', {
                            className: 'error-toast'
                        })
                    })
            })
    }
}

export default UserProfile