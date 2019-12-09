import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import AuthRoute from '../../components/routes/auth-route'
import { UserInfoProvider } from '../../App'
import { userValidations } from '../../components/hocs/validations'
import promiseExtraMethods from '../../components/hocs/promiseExtraMethods'
import withProcessForm from '../../components/hocs/withProcessForm'
import { UserLogin } from '../../components/user/login'

// to test the document's title also
// scenarious:

// logged in user tries to reach the Login page  ==> should be redirected
// logged in admin tries to reach the Login page  ==> should be redirected
// logged out user tries to reach the Login page ==> should be able to view Login page

// -- submit button is not clicked yet
//    -- valid info is passed to all fields
//    -- invalid info is passed for [username] / [password]
//    -- invalid info is passed for [username and password]
//
// -- submit button is clicked
//    -- valid info is passed to to all fields                 *   sampleEvents.onFormSubmit should BE Called !!   *
//    -- invalid info is passed for [username] / [password]    * sampleEvents.onFormSubmit should NOT be Called !! *
//    -- invalid info is passed for [username and password]    * sampleEvents.onFormSubmit should NOT be Called !! *
//

const initialData = {
    username: '',
    password: '',

    userClass: '',
    passClass: '',
}

const extraMethods = {
    success: promiseExtraMethods.user().onLoginSuccess,
    fail: promiseExtraMethods.user().onLoginFail
}

const sampleEvents = {
    username: {
        validUsername: {
            target: { name: 'username', value: 'yolo-i-am-valid' }
        },
        emptyUsername: {
            target: { name: 'username', value: '' }
        },
        tooShortUsername: {
            target: { name: 'username', value: 'low' }
        }
    },
    password: {
        validPassword: {
            target: { name: 'password', value: 'stra6na-paroLa' }
        },
        emptyPassword: {
            target: { name: 'password', value: '' }
        },
        tooShortPassword: {
            target: { name: 'password', value: 'парола' }
        }
    },
    onFormSubmit: {
        preventDefault: () => {
            return 'I am fake prevent-defaulter.'
        }
    }
}

const mockLoginSubmit = () => {
    const sampleReturnedData = JSON.stringify({ success: 'Wellcome back! ♥' })
    return Promise.resolve(new Response(sampleReturnedData))
}

const historyMock = {
    push: jest.fn()
}

describe('tests for Login component', () => {
    let TestHoc = withProcessForm(UserLogin, 'login', userValidations, initialData, null, extraMethods, null, mockLoginSubmit)
    let wrapper

    beforeEach(() => {
        wrapper = mount(<TestHoc history={historyMock} />)
    })

    afterEach(() => {
        // to reset Jest mock function calls count after every test:
        historyMock.push.mockClear()
    })

    describe('guest functionalities', () => {

        it('should allow [guests] to view the login page', () => {
            const defaultUserValue = { isLogged: false, username: '', role: '' }

            wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/user/login" component={UserLogin} role="null" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.find('Route[path="/user/login"]').length).toEqual(1)
        })

        it('should render the login form with empty fields', () => {
            expect(wrapper.html()).toMatchSnapshot()

            wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push).not.toBeCalled()
            expect(historyMock.push.mock.calls.length).toEqual(0)
        })


        it('should mark as [valid] all 2 fields of the form', async () => {
            await wrapper.find('input[id="username"]').simulate('change', sampleEvents.username.validUsername)
            expect(wrapper.find('input[id="username"]').prop('value')).toEqual(sampleEvents.username.validUsername.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="username"]').hasClass('correct')).toEqual(true)

            await wrapper.find('input[id="password"]').simulate('change', sampleEvents.password.validPassword)
            expect(wrapper.find('input[id="password"]').prop('value')).toEqual(sampleEvents.password.validPassword.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="password"]').hasClass('correct')).toEqual(true)


            await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push.mock.calls.length).toEqual(1)
            expect(historyMock.push).toHaveBeenLastCalledWith('/')
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
            expect(historyMock.push.mock.calls.length).toEqual(0)
            expect(historyMock.push).not.toBeCalled()
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
            expect(historyMock.push.mock.calls.length).toEqual(0)
            expect(historyMock.push).not.toBeCalled()
        })

        it('should mark as invalid all 2 fields of the form after change', async () => {
            await wrapper.find('input[id="username"]').simulate('change', sampleEvents.username.tooShortUsername)
            await wrapper.find('input[id="password"]').simulate('change', sampleEvents.password.tooShortPassword)

            expect(wrapper.find('input[id="username"]').prop('value')).toEqual(sampleEvents.username.tooShortUsername.target.value)
            expect(wrapper.find('input[id="password"]').prop('value')).toEqual(sampleEvents.password.tooShortPassword.target.value)

            wrapper.update()

            expect(wrapper.find('input[id="username"]').hasClass('error')).toEqual(true)
            expect(wrapper.find('input[id="password"]').hasClass('error')).toEqual(true)


            await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push.mock.calls.length).toEqual(0)
            expect(historyMock.push).not.toBeCalled()
        })
    })

    describe('user functionalities', () => {

        it('should redirect [users] to the home page when they accesses login page', () => {
            const defaultUserValue = { isLogged: true, username: 'i-am-such-a-cool-user', role: 'User' }

            wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/user/login" component={UserLogin} role="null" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.find('Redirect[to="/"]').length).toEqual(1)
        })
    })

    describe('admin functionalities', () => {

        it('should let The [Admin] view the login page', () => {
            const defaultUserValue = { isLogged: true, username: 'The-BeAst', role: 'Admin' }

            wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/user/login" component={UserLogin} role="null" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.find('Route[path="/user/login"]').length).toEqual(1)
        })
    })
})