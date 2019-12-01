import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import Header from '../../components/common/header'

// is manually wrapping MyComponent in AppContext.Provider
// in each test the only way then ?
describe('tests for the Header component', () => {
    it('should render properly when a user is NOT logged in', () => {
        const defaultValue = { isLogged: false, username: '', role: '' }
        const { Consumer, Provider } = React.createContext(defaultValue)

        const wrapper = mount(
            <Provider value={defaultValue}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </Provider>
        )
        expect(wrapper.html()).toMatchSnapshot()
    })

    it('should render properly when a user is logged in', () => {
        const defaultValue = { isLogged: false, username: 'nqkakvo-si-ime', role: 'User' }
        const { Consumer, Provider } = React.createContext(defaultValue)

        const wrapper = mount(
            <Provider value={defaultValue}>
                <BrowserRouter>
                    <Header />
                </BrowserRouter>
            </Provider>
        )
        expect(wrapper.html()).toMatchSnapshot()
    })


})