import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import { UserInfoProvider } from '../../App'
import AuthRoute from '../../components/routes/auth-route'
import Logout from '../../components/user/logout'

// 1, 2, 3, 4, 5 tests:
// should redirect guests to '/' and return NO msg
// should redirect users to '/' and return (un)successful msg   / successful logout and unsuccessful logout(HTTP error 500) /
// should redirect admin to '/' and return (un)successful msg   / successful logout and unsuccessful logout(HTTP error 500) /

const mockToast = {
    info: jest.fn()
}

const successfulLogout = () => {
    return Promise.resolve()
}

const failedLogout = () => {
    return Promise.reject()
}

describe('tests for the component Logout', () => {

    beforeEach(() => {
        mockToast.info.mockClear()
    })

    describe('guest functionalities', () => {

        it('should redirect [guest] to the home page when they try to accesses Logout page', () => {
            const defaultUserValue = { isLogged: false, username: '', role: '' }

            const wrapper = mount(
                <UserInfoProvider value={defaultUserValue}>
                    <BrowserRouter>
                        <AuthRoute path="/user/logout" component={Logout} role="User" />
                    </BrowserRouter>
                </UserInfoProvider>
            )

            expect(mockToast.info).not.toBeCalled()
            expect(mockToast.info.mock.calls.length).toEqual(0)
            expect(wrapper.find('Redirect[to="/"]').length).toEqual(1)
        })
    })

    // describe('user functionalities', () => {

    // it('should logout a user', async () => {
    //     const wrapper = mount(
    //         <BrowserRouter>
    //             <Logout toast={mockToast} service={successfulLogout} />
    //         </BrowserRouter>
    //     )
    //     await successfulLogout()
    //     wrapper.update()

    //     expect(mockToast.info).toBeCalled()
    //     expect(mockToast.info.mock.calls.length).toEqual(1)
    //     expect(mockToast.info).toHaveBeenLastCalledWith('Successful log out! 🍹', { className: 'success-toast', })

    //     expect(wrapper.find('Redirect[to="/"]').length).toEqual(1)
    // })

    // it('should NOT logout a user', () => {
    //     const wrapper = mount(
    //         <BrowserRouter>
    //             <Logout toast={mockToast} service={failedLogout} />
    //         </BrowserRouter>
    //     )

    //     expect(mockToast.info).toBeCalled()
    //     // expect(mockToast.info.mock.calls.length).toEqual(1)
    //     expect(mockToast.info).toHaveBeenLastCalledWith(
    //         'Something went wrong when trying to log you out.. Please try again later.', { className: 'error-toast' })

    //     expect(wrapper.find('Redirect[to="/"]').length).toEqual(1)
    // })
    // })

    // describe('admin functionalities', () => {



    // })
})