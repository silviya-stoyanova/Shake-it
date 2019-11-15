import React, { Component, Fragment as div } from 'react'
import '../../static/css/forms.css'

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
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5842.18144046166!2d26.508194563092392!3d42.48606336154913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a634309f91e3c9%3A0x51b0a9e04be4122f!2z0J7QsdGJ0LjQvdCwINCv0LzQsdC-0Ls!5e0!3m2!1sbg!2sbg!4v1573846071952!5m2!1sbg!2sbg" style={{ width: "600", height: "450", frameborder: "0", style: "border:0", allowfullscreen: "" }}></iframe>

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
            </div >
        )
    }
}

export default ContactForm