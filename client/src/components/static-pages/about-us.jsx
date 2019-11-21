import React from 'react'
import { Link } from 'react-router-dom'
import useTitle from '../page-title/useTitle'

function AboutUs() {
    useTitle('About us')
    return (
        <div>
            <h2>Our mission ...</h2>

            <p>.. is to get you excited about real plant-based foods that taste amazing and leave you feeling great!</p>
            <p><strong>&copy; Shake it</strong> was founded in 2019 with a strong desire to increase access to prepared whole - foods that are free from pesticides, GMOs, animal abuse and highly processed ingredients.</p>
            <p>The Cashew - base of our shakes was hand - crafted to be rich in plant protein, fiber and nutrients, while still being easy to digest.Our shakes provide your body with the fuel it needs to get up & <strong>shake it!</strong></p>
            <p>These days traditional milkshakes aren’t as popular but we’re here to bring them back in a revolutionary way! In our world “mylkshakes” are not only a treat, but a meal replacement in some cases! We think you’ll enjoy our shakes anytime of the day!</p>
            <p>We’re excited to take over the new “mylkshake” market with what we consider to be, “the most delicious rendition of “mylkshakes” since the advent of their cow variant!”</p>
            <p>Interested in trying our shakes yet ? Check out our <Link to='/contacts'>contacts page</Link> to find one near you or reach out if you’d like us to host a private catering (including fundraisers, corporate events, parties, weddings, etc.).</p>
            <p>We look forward to seeing you soon!</p>
        </div>
    )
}

export default AboutUs