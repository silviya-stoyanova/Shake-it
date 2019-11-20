import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { UserInfoConsumer } from '../../App'
import { toast } from 'react-toastify'

const isAuthed = (currRole, wantedRole) => {
    let pass = false

    if (wantedRole === 'null' || currRole === 'Admin' || currRole === wantedRole) {
        pass = true
    } else {
        toast.info('You are unauthorized to view this page!', {
            className: 'error-toast'
        })
    }
    return pass
}

const AuthRoute = (props) => {
    return <UserInfoConsumer>
        {data => {
            if (!isAuthed(data.role, props.role)) {
                return <Redirect to="/" />
            }

            return <Route {...props} />
        }}
    </UserInfoConsumer>
}

export default AuthRoute