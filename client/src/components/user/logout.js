import React from 'react'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import sessionManager from '../utilities/session-util'
import observer from '../utilities/observer'

function logout() {
    try {
        sessionManager.clearSession()
        observer.trigger('userLogout')
        toast.info('Successful log out! 🍹', {
            className: 'success-toast',
        })

    } catch (err) {
        toast.info('Something went wrong when trying to log you out..', {
            className: 'error-toast',
        })
        console.log(err)
    }

    return <Redirect to='/' />
}

export default logout