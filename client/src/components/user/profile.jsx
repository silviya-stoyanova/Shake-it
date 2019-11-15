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
            purchasedProducts: '',

            userExists: true,
            uploadedImg: ''
        }
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
        const jwtToken = sessionManager.getAuthtoken()
        const { profilePic, firstName, lastName, email, adress, phoneNumber } = this.state

        requester.updateProfileInfo(profilePic, firstName, lastName, email, adress, phoneNumber, jwtToken)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(res => {
                return toast.info(res.success, {
                    className: 'success-toast'
                })
            })
            .catch(err => {
                err.json()
                    .then(error => {
                        return toast.info(error.message, {
                            className: 'error-toast'
                        })
                    })
            })
    }

    render() {
        const { profilePic, firstName, lastName, email, adress, phoneNumber, purchasedProducts, userExists, uploadedImg } = this.state

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
                    {!userExists ? <Redirect to="/" /> : null}

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
                                                <img className="update-img" src={require('../../static/images/update-pic.png')} alt="update-profile-picture" />
                                            </label>
                                            <input onChange={this.handleInputChange} type="file" name="profilePic" id="profilePic" />
                                        </div>
                                    </Fragment>
                                    : <img className='profile-img' src={require('../../static/images/loading-circle.gif')} alt="profile-pic" />
                            }
                        </div>

                        <span className="user-info-username" >Username: {data.username}</span>
                        <hr />

                        <div className="user-info">
                            <label htmlFor="firstName" >First name:</label>
                            <input onChange={this.handleInputChange} name="firstName" id="firstName" defaultValue={firstName} />

                            <label htmlFor="lastName" >Last name:</label>
                            <input onChange={this.handleInputChange} name="lastName" id="lastName" defaultValue={lastName} />

                            <label htmlFor="email" >Email:</label>
                            <input onChange={this.handleInputChange} name="email" type="email" id="email" defaultValue={email} />

                            <label htmlFor="adress" >Adress:</label>
                            <input onChange={this.handleInputChange} name="adress" id="adress" defaultValue={adress} />

                            <label htmlFor="phoneNumber" >Phone number:</label>
                            <input onChange={this.handleInputChange} name="phoneNumber" id="phoneNumber" defaultValue={phoneNumber} />

                            <label htmlFor="purchasedProducts" >Purchased products: {purchasedProducts}</label>
                        </div>

                        <hr />
                        <button type="submit" className="edit-profile-btn" >Save changes</button>
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
                    profilePic: res.profilePic !== 'undefined' ? res.profilePic : '',
                    firstName: res.firstName !== 'undefined' ? res.firstName : '',
                    lastName: res.lastName !== 'undefined' ? res.lastName : '',
                    email: res.email !== 'undefined' ? res.email : '',
                    adress: res.adress !== 'undefined' ? res.adress : '',
                    phoneNumber: res.phoneNumber !== 'undefined' ? res.phoneNumber : '',
                    purchasedProducts: res.purchasedProducts !== null ? res.purchasedProducts : 0
                })
            })
            .catch(err => {
                err.json()
                    .then(error => {
                        this.setState({
                            userExists: false
                        })

                        return toast.info(error.message, {
                            className: 'error-toast'
                        })
                    })
            })
    }
}

export default UserProfile