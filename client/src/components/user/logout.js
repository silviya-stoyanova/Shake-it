import React from 'react'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'
import observer from '../../utilities/observer'

function logout() {
    try {
        const jwtToken = sessionManager.getUserInfo().authtoken
        requester.logout(jwtToken)

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

export default logout