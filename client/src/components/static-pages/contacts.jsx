import React, { Fragment as div } from 'react'
import '../../static/css/forms.css'
import '../../static/css/contacts.css'
import useTitle from '../page-title/useTitle'

const ContactForm = () => {
    useTitle('Contact with us')

    return (
        <div>
            <div className="form">
                <div className="about-us">
                    <div className="about-us-heading">For general inquiries</div>
                    <hr className="hr-heading" />
                    <div>Tel.: +359 111 333 333</div>
                    <div>Email: info@shake-it.com</div>
                    <hr />
                    <div>We’re based in Yambol, Bulgaria</div>
                    <hr />
                    <iframe title="location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5842.18144046166!2d26.508194563092392!3d42.48606336154913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a634309f91e3c9%3A0x51b0a9e04be4122f!2z0J7QsdGJ0LjQvdCwINCv0LzQsdC-0Ls!5e0!3m2!1sbg!2sbg!4v1573846071952!5m2!1sbg!2sbg" style={{ width: "600", height: "450", frameborder: "0", style: "border:0", allowfullscreen: "" }}></iframe>
                    <hr />
                    <div>Have you tried one of our shakes?</div>
                    <div>We’d love to hear about it! </div>
                    <hr />
                </div>

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

export default ContactForm