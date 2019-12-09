import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import AuthRoute from '../../components/routes/auth-route'
import withProcessForm from '../../components/hocs/withProcessForm'
import { userValidations } from '../../components/hocs/validations'
import promiseExtraMethods from '../../components/hocs/promiseExtraMethods'
import { UserRegister } from '../../components/user/register'
import { UserInfoProvider } from '../../App'


// scenarious:

// logged in user tries to reach the Register page  ==> should be redirected
// logged in admin tries to reach the Register page  ==> should be redirected
// logged out user tries to reach the Register page ==> should be able to view Register page

// -- submit button is not clicked yet
//    -- valid info is passed to all fields
//    -- invalid info is passed for [username] / [password] / [repeatPassword]
//    -- invalid info is passed for [password] and [repeat-password]
//    -- invalid info is passed for [username, password and repeatPassword]
//
// -- submit button is clicked
//    -- valid info is passed to to all fields                         *   sampleEvents.onFormSubmit should BE Called !!   *
//    -- invalid info is passed for [username] / [password] / [rePass] * sampleEvents.onFormSubmit should NOT be Called !! *
//    -- invalid info is passed for [password] and [repeat-password]   * sampleEvents.onFormSubmit should NOT be Called !! *
//    -- invalid info is passed for [username, password and rePass]    * sampleEvents.onFormSubmit should NOT be Called !! *


const initialData = {
    username: '',
    password: '',
    repeatPassword: '',

    userClass: '',
    passClass: '',
    repeatPassClass: ''
}

const extraMethods = {
    success: promiseExtraMethods.user().onRegisterSuccess,
    fail: promiseExtraMethods.user().onRegisterFail
}

const mockRegisterSubmit = () => {
    const sampleReturnedData = JSON.stringify({ success: 'Successful registration! ♥' })
    return Promise.resolve(new Response(sampleReturnedData))
}

const sampleEvents = {
    username: {
        validUsername: {
            target: { name: 'username', value: 'cherry' }
        },
        emptyUsername: {
            target: { name: 'username', value: '' }
        },
        tooShortUsername: {
            target: { name: 'username', value: 'yam' }
        }
    },
    password: {
        validPassword: {
            target: { name: 'password', value: 'pass-licious' }
        },
        emptyPassword: {
            target: { name: 'password', value: '' }
        },
        tooShortPassword: {
            target: { name: 'password', value: 'pass' }
        }
    },
    repeatPassword: {
        validRepeatPassword: {
            target: { name: 'repeatPassword', value: 'pass-licious' }
        },
        // long enough but not the same as validPassword
        diffRepeatPassword: {
            target: { name: 'repeatPassword', value: 'delicious' }
        },
        emptyRepeatPassword: {
            target: { name: 'repeatPassword', value: '' }
        },
        tooShortRepeatPassword: {
            target: { name: 'repeatPassword', value: 'pass' }
        }
    },
    onFormSubmit: {
        preventDefault: () => {
            return 'I am fake prevent-defaulter.'
        }
    }
}

const historyMock = {
    push: jest.fn()
}

describe('tests for the component UserRegister', () => {
    let TestHoc = withProcessForm(UserRegister, 'register', userValidations, initialData, null, extraMethods, null, mockRegisterSubmit)
    let wrapper

    beforeEach(() => {
        wrapper = mount(
            <TestHoc history={historyMock} />
        )
    })

    afterEach(() => {
        // to reset Jest mock function calls count after every test:
        historyMock.push.mockClear()
    })

    describe('guest functionalities', () => {

        it('should allow [guests] to view the register page', () => {
            const defaultUserValue = { isLogged: false, username: '', role: '' }

            wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue} >
                        <AuthRoute path="/user/register" component={UserRegister} role="null" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.find('Route[path="/user/register"]').length).toEqual(1)
        })

        it('should render the register form with empty fields', async () => {
            expect(wrapper.html()).toMatchSnapshot()

            await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push).not.toBeCalled()
            expect(historyMock.push.mock.calls.length).toEqual(0)
        })

        it('should mark as [valid] all fields of the form', async () => {
            await wrapper.find('input[id="username"]').simulate('change', sampleEvents.username.validUsername)
            expect(wrapper.find('input[id="username"]').prop('value')).toEqual(sampleEvents.username.validUsername.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="username"]').hasClass('correct')).toEqual(true)

            await wrapper.find('input[id="password"]').simulate('change', sampleEvents.password.validPassword)
            expect(wrapper.find('input[id="password"]').prop('value')).toEqual(sampleEvents.password.validPassword.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="password"]').hasClass('correct')).toEqual(true)

            await wrapper.find('input[id="repeat-password"]').simulate('change', sampleEvents.repeatPassword.validRepeatPassword)
            expect(wrapper.find('input[id="repeat-password"]').prop('value')).toEqual(sampleEvents.repeatPassword.validRepeatPassword.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="repeat-password"]').hasClass('correct')).toEqual(true)

            await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push).toBeCalled()
            expect(historyMock.push).toHaveBeenLastCalledWith('/')
            expect(historyMock.push.mock.calls.length).toEqual(1)
        })

        it('should mark as invalid [username] after change', async () => {
            await wrapper.find('input[id="username"]').simulate('change', sampleEvents.username.emptyUsername)
            expect(wrapper.find('input[id="username"]').prop('value')).toEqual(sampleEvents.username.emptyUsername.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="username"]').hasClass('error')).toEqual(true)

            await wrapper.find('input[id="username"]').simulate('change', sampleEvents.username.tooShortUsername)
            expect(wrapper.find('input[id="username"]').prop('value')).toEqual(sampleEvents.username.tooShortUsername.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="username"]').hasClass('error')).toEqual(true)

            await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push).not.toBeCalled()
            expect(historyMock.push.mock.calls.length).toEqual(0)
        })

        it('should mark as invalid [password] after change', async () => {
            await wrapper.find('input[id="password"]').simulate('change', sampleEvents.password.emptyPassword)
            expect(wrapper.find('input[id="password"]').prop('value')).toEqual(sampleEvents.password.emptyPassword.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="password"]').hasClass('error')).toEqual(true)

            await wrapper.find('input[id="password"]').simulate('change', sampleEvents.password.tooShortPassword)
            expect(wrapper.find('input[id="password"]').prop('value')).toEqual(sampleEvents.password.tooShortPassword.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="password"]').hasClass('error')).toEqual(true)

            await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push).not.toBeCalled()
            expect(historyMock.push.mock.calls.length).toEqual(0)
        })

        it('should mark as invalid [repeat-password] after change', async () => {
            await wrapper.find('input[id="repeat-password"]').simulate('change', sampleEvents.repeatPassword.emptyRepeatPassword)
            expect(wrapper.find('input[id="repeat-password"]').prop('value')).toEqual(sampleEvents.repeatPassword.emptyRepeatPassword.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="repeat-password"]').hasClass('error')).toEqual(true)

            await wrapper.find('input[id="repeat-password"]').simulate('change', sampleEvents.repeatPassword.tooShortRepeatPassword)
            expect(wrapper.find('input[id="repeat-password"]').prop('value')).toEqual(sampleEvents.repeatPassword.tooShortRepeatPassword.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="repeat-password"]').hasClass('error')).toEqual(true)

            await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push).not.toBeCalled()
            expect(historyMock.push.mock.calls.length).toEqual(0)
        })

        it('should mark as invalid both [password] and [repeat-password] after change', async () => {
            await wrapper.find('input[id="password"]').simulate('change', sampleEvents.password.validPassword)
            expect(wrapper.find('input[id="password"]').prop('value')).toEqual(sampleEvents.password.validPassword.target.value)

            await wrapper.find('input[id="repeat-password"]').simulate('change', sampleEvents.repeatPassword.diffRepeatPassword)
            expect(wrapper.find('input[id="repeat-password"]').prop('value')).toEqual(sampleEvents.repeatPassword.diffRepeatPassword.target.value)

            wrapper.update()

            expect(wrapper.find('input[id="password"]').hasClass('error')).toEqual(true)
            expect(wrapper.find('input[id="repeat-password"]').hasClass('error')).toEqual(true)

            await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push).not.toBeCalled()
            expect(historyMock.push.mock.calls.length).toEqual(0)
        })

        it('should mark as [invalid] all fields of the form', async () => {
            await wrapper.find('input[id="username"]').simulate('change', sampleEvents.username.tooShortUsername)
            await wrapper.find('input[id="password"]').simulate('change', sampleEvents.password.tooShortPassword)
            await wrapper.find('input[id="repeat-password"]').simulate('change', sampleEvents.repeatPassword.tooShortRepeatPassword)

            expect(wrapper.find('input[id="username"]').prop('value')).toEqual(sampleEvents.username.tooShortUsername.target.value)
            expect(wrapper.find('input[id="password"]').prop('value')).toEqual(sampleEvents.password.tooShortPassword.target.value)
            expect(wrapper.find('input[id="repeat-password"]').prop('value')).toEqual(sampleEvents.repeatPassword.tooShortRepeatPassword.target.value)

            wrapper.update()

            expect(wrapper.find('input[id="username"]').hasClass('error')).toEqual(true)
            expect(wrapper.find('input[id="password"]').hasClass('error')).toEqual(true)
            expect(wrapper.find('input[id="repeat-password"]').hasClass('error')).toEqual(true)

            await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push).not.toBeCalled()
            expect(historyMock.push.mock.calls.length).toEqual(0)
        })
    })

    describe('user functionalities', () => {
        const defaultUserValue = { isLogged: true, username: 'cupcake', role: 'User' }

        it('should redirect [users] to the home page when they accesses register page', () => {
            wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue} >
                        <AuthRoute path="/user/register" component={UserRegister} role="null" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.find('Redirect[to="/"]').length).toEqual(1)
        })

    })

    describe('admin functionalities', () => {
        const defaultUserValue = { isLogged: true, username: 'mushroom4e', role: 'Admin' }

        it('should let The [Admin] view the register page', () => {
            wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue} >
                        <AuthRoute path="/user/register" component={UserRegister} role="null" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.find('Route[path="/user/register"]').length).toEqual(1)
        })

    })
})