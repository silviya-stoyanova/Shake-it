import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import { UserInfoProvider } from '../../App'
import Header from '../../components/common/header'

// is manually wrapping MyComponent in AppContext.Provider
// in each test the only way then ?
describe('tests for the Header component', () => {
    it('should render properly when a user is NOT logged in', () => {
        //! lesson: You cannot use a Consumer from one context with Provider of another, be it with the same props passed down
        // const { Consumer, Provider } = React.createContext(defaultValue)
        const defaultValue = { isLogged: false, username: '', role: '' }

        const wrapper = mount(
            <UserInfoProvider value={defaultValue}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </UserInfoProvider>
        )
        expect(wrapper.html()).toMatchSnapshot()
    })

    it('should render properly when a user is logged in', () => {
        //! lesson: You cannot use a Consumer from one context with Provider of another, be it with the same props being passed down
        // const { Consumer: UserInfoConsumer, Provider: UserInfoProvider } = React.createContext(defaultValue)

        const defaultValue = { isLogged: true, username: 'nqkakvo-si-ime-tam', role: 'User' }

        const wrapper = mount(
            <UserInfoProvider value={defaultValue}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </UserInfoProvider>
        )

        expect(wrapper.html()).toMatchSnapshot()

        expect(wrapper.find('li.greeting').length).toEqual(1)
        expect(wrapper.find('li.greeting').text()).toEqual('welcome, nqkakvo-si-ime-tam')

        expect(wrapper.find('li.logout').length).toEqual(1)
        expect(wrapper.find('li.logout').text()).toEqual('logout')
    })

    it('should render properly when The Adnin is logged in', () => {
        const defaultValue = { isLogged: true, username: 'admin', role: 'Admin' }

        const wrapper = mount(
            <UserInfoProvider value={defaultValue}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </UserInfoProvider>
        )

        expect(wrapper.html()).toMatchSnapshot()

        expect(wrapper.find('li.add-product').length).toEqual(1)
        expect(wrapper.find('li.add-product').text()).toEqual('add product')

        expect(wrapper.find('li.greeting').length).toEqual(1)
        expect(wrapper.find('li.greeting').text()).toEqual('welcome, admin')

        expect(wrapper.find('li.logout').length).toEqual(1)
        expect(wrapper.find('li.logout').text()).toEqual('logout')
    })
})