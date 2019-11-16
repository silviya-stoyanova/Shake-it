import React, { Component, Fragment as div } from 'react'
import '../../static/css/forms.css'
//import ContactsMap from '../static-pages/contacts-map'

class ContactForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            google: {
                lat: 42.483780, lng: 26.510771
            },

        }
    }

    render() {
        const { google } = this.state

        return (
            <div>

                <div className="form">
                    <form>
                        <div className="form-type">Contact form</div>
                        <hr />

                        <div className="form-fields-wrapper">
                            <label htmlFor="username">Your name</label>
                            <input autoFocus type="text" id="username" />

                            <label htmlFor="number">Phone number</label>
                            <input type="text" id="number" />

                            <label htmlFor="email">Email adress</label>
                            <input type="text" id="email" />

                            <label htmlFor="subject">Subject</label>
                            <input type="text" id="subject" />

                            <label htmlFor="message">Message</label>
                            <textarea type="text" id="message"></textarea>
                        </div>

                        <hr />
                        <button className="button" type="submit">Send</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default ContactForm