import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import { CreateProduct } from '../../components/product/create-product'
import withProcessForm from '../../components/hocs/withProcessForm'
import AuthRoute from '../../components/routes/auth-route'
import { UserInfoProvider } from '../../App'

// scenarios:

// when a guest access CreateProduct page they should be redirected to the home page

// when a user access CreateProduct page they should be redirected to the home page

// when The Admin access CreateProduct page they should be able to add a product

// -- submit button is not clicked yet
//    -- valid info is passed to 4 of the fields
//      -- invalid info is passed for [title] / [description] / [image] / [price]
//      -- invalid info is passed for [title, description, image and price]

// -- submit button is clicked
//       -- valid info is passed to 4 of the fields                                 *   sampleEvents.onFormSubmit should BE Called !!   *
//       -- invalid info is passed for [title] / [description] / [image] / [price]  * sampleEvents.onFormSubmit should NOT be Called !! *
//       -- invalid info is passed for [title, description, image and price]

describe('tests for the component CreateProduct', () => {

    afterEach(() => {


    })

    describe('tests for guest functionalities', () => {

        it('should redirect [guests] to the home page when they accesses edit-product page', () => {
            const defaultUserValue = { isLogged: false, username: '', role: '' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/product/create" component={CreateProduct} role="Admin" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.find('Redirect[to="/"]').length).toEqual(1)
        })

    })

    describe('tests for user functionalities', () => {

        it('should redirect [users] to the home page when they accesses edit-product page', () => {
            const defaultUserValue = { isLogged: true, username: 'Edin mnogo gotin potrebitel', role: 'User' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/product/create" component={CreateProduct} role="Admin" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.find('Redirect[to="/"]').length).toEqual(1)
        })
    })

    describe('tests for admin functionalities', () => {

        it('should let The [Admin] accesses edit-product page by returning <Route path="/product/create" .... />', () => {
            const defaultUserValue = { isLogged: true, username: 'admin I am', role: 'Admin' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/product/create" component={CreateProduct} role="Admin" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.find('Route[path="/product/create"]').length).toEqual(1)
        })





    })
})