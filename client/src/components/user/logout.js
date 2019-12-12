import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'
import observer from '../../utilities/observer'
const jwtToken = sessionManager.getUserInfo().authtoken

async function Logout(props) {

    // to be able to test this component, [toast] will be passed down through the props
    const { toast, service } = props

    try {
        // requester.logout(jwtToken)
        service(jwtToken)
        sessionManager.clearSession()
        observer.trigger('userLogout')
        toast.info('Successful log out! 🍹', {
            className: 'success-toast',
        })
    } catch (err) {
        toast.info('Something went wrong when trying to log you out.. Please try again later.', {
            className: 'error-toast',
        })
    }

    return <Redirect to='/' />
}

Logout.defaultProps = {
    toast: toast,
    service: requester.logout(jwtToken)
}

export default Logout