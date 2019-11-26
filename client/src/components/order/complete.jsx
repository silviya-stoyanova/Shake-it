import React, { Component } from 'react'

class CompleteOrder extends Component {






    render() {
        document.title = 'Shake it - Complete your order'
        return <form>
            <div>Complete your order</div>
            <div>Shipping information</div>

            <label for="first-name">First name</label>
            <input id='first-name' />
            <label for="last-name">Last name</label>
            <input id='last-name' />
            <label for="email">Email</label>
            <input id='email' />
            <label for="country">Country</label>
            <input id='country' />
            <label for="city">City</label>
            <input id='city' />
            <label for="postcode">Postcode</label>
            <input id='postcode' />
            <label for="address">Street address</label>
            <input id='address' />

            <button type="submit" className="button" >Confirm 🍹</button>
        </form>
    }

    async componentDidMount() {



    }


}

export default CompleteOrder