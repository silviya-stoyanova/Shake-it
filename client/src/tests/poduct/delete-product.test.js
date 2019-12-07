// https://stackoverflow.com/questions/50682726/how-to-unit-test-a-react-event-handler-that-contains-history-push-using-jest-and
// what does jest.fn() ?
// https://airbnb.io/enzyme/docs/api/ShallowWrapper/simulate.html
// https://stackoverflow.com/questions/44419318/how-to-test-form-submission-in-react-with-jest-and-enzyme-cannot-read-property

import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import { UserInfoProvider } from '../../App'
import withProcessForm from '../../components/hocs/withProcessForm'
import { DeleteProduct } from '../../components/product/delete-product'
import { productValidations } from '../../components/hocs/validations'
import AuthRoute from '../../components/routes/auth-route'

// when someone accesses non-existing product's details
// => just before they are redirected, they will see loading - circle.gif
// => and then will be redirected

// scenarios:
//
//// a [guest] accesses delete-product page => and then will be redirected => DeleteProduct component should not be rendered??
//
//// a [user] accesses delete-product page => and then will be redirected => nothing should be rendered??
//
//// The [Admin] accesses delete-[existing]-product page
////              -- and the data is fetched        /submit button is (not) clicked/
////              -- and the data is not fetched yet
// The [Admin] accesses delete-[non-existing]-product page
//

const mockExistingProductFetch = () => {
    const sampleData = JSON.stringify(
        {
            _id: 1,
            title: 'Gotino zaglavie',
            image: 'дилишъс-шейк.jpg',
            description: 'Представям на Вашето внимание един уникален млечен шейк',
            price: 9.99,
            likes: ['firstUserId', 'secondUserId', 'thirdUserId', 'fourthuserId', 'fifthUserId', 'sixthUserId', 'seventhUserId', 'eighthUserId']
        })

    return Promise.resolve(new Response(sampleData))
}

const mockNonExistingProductFetch = () => {
    const sampleReturnedData = JSON.stringify({ message: 'This product does not exist!' })
    const responseOptions = { status: 404, ok: false, statusText: 'Not found!' }

    return Promise.reject(
        new Response(sampleReturnedData, responseOptions)
    )
}

const mockPoductDelete = () => {
    const sampleReturnedData = JSON.stringify({ success: 'Product deleted successfully!' })
    return Promise.resolve(new Response(sampleReturnedData))
}

const initialData = {
    title: '', description: '', image: '', price: '',
}

const sampleEvent = {
    preventDefault: () => {
        // console.log('I am fake prevent-defaulter.')
    }
}

const historyMock = {
    push: jest.fn()
}

describe('tests for the component DeleteProduct', () => {

    describe('tests for guest functionalities', () => {

        it('should redirect [guests] to the home page when they accesses delete-product page', () => {
            const defaultUserValue = { isLogged: false, username: '', role: '' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        {/* isTest={true}  */}
                        <AuthRoute path="/product/delete/:productId" component={DeleteProduct} role="Admin" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.html()).toMatchSnapshot()
            expect(wrapper.find('Redirect[to="/"]').length).toEqual(1)
        })
    })

    describe('tests for user functionalities', () => {

        it('should redirect [users] to the home page when they accesses delete-product page', () => {
            const defaultUserValue = { isLogged: true, username: 'lalala', role: 'User' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/product/delete/:productId" component={DeleteProduct} role="Admin" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.html()).toMatchSnapshot()
            expect(wrapper.find('Redirect[to="/"]').length).toEqual(1)
        })
    })

    describe('tests for admin functionalities', () => {

        it('should let The [Admin] accesses delete-product page by returning <Route path="/product/delete/:productId" .... />', () => {
            const defaultUserValue = { isLogged: true, username: 'xixix-name', role: 'Admin' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/product/delete/:productId" component={DeleteProduct} role="Admin" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.html()).toMatchSnapshot()
            expect(wrapper.find('Route[path="/product/delete/:productId"]').length).toEqual(1)
        })



        it("should render [existing] product's delete page with it's [fetched] data", () => {
            const TestHoc = withProcessForm(DeleteProduct, 'delete', productValidations, initialData, null, null, mockExistingProductFetch, null)

            const wrapper = mount(
                <BrowserRouter>
                    <TestHoc history={historyMock} />
                </BrowserRouter>
            )

            mockExistingProductFetch()
                .then(res => res.json())
                .then(async res => {
                    wrapper.setState({
                        data: res
                    })

                    wrapper.update()

                    expect(wrapper.html()).toMatchSnapshot()

                    expect(wrapper.find('div.product-title').length).toEqual(1)
                    expect(wrapper.find('div.product-title').text()).toEqual('Gotino zaglavie')

                    expect(wrapper.find('img.product-img').length).toEqual(1)
                    expect(wrapper.find('img.product-img[src="data:image/png;base64, дилишъс-шейк.jpg"]').length).toEqual(1)

                    expect(wrapper.find('textarea[id="description"]').length).toEqual(1)
                    expect(wrapper.find('textarea[id="description"]').text()).toEqual('Представям на Вашето внимание един уникален млечен шейк')

                    expect(wrapper.find('div.price').length).toEqual(1)
                    expect(wrapper.find('input[id="price"]').length).toEqual(1)
                    expect(wrapper.find('input[id="price"]').prop('value')).toEqual(9.99)

                    expect(wrapper.find('button.btn-del').length).toEqual(1)
                    expect(wrapper.find('a[href="/"]').hasClass('btn-del')).toEqual(true)
                })

        })

        it("should redirect to the home page after the data for deleting a product is [fetched] and the form is [submitted]", async () => {
            const TestHoc = withProcessForm(DeleteProduct, 'delete', productValidations, initialData, null, null, mockExistingProductFetch, mockPoductDelete)

            const wrapper = mount(
                <BrowserRouter>
                    <TestHoc history={historyMock} />
                </BrowserRouter>
            )

            mockExistingProductFetch()
                .then(res => res.json())
                .then(async res => {
                    wrapper.setState({
                        data: res
                    })
                    wrapper.update()

                    await wrapper.find('form').simulate('submit', sampleEvent)
                    // expect(historyMock.push).toBeCalled()
                    // expect(historyMock.push).toHaveBeenLastCalledWith('/')

                    expect(historyMock.push.mock.calls.length).toEqual(1)
                    expect(historyMock.push.mock.calls[0][0]).toEqual('/')
                })
        })

        it('should render a loading-circle.gif when the data for deleting a product is not [fetched] yet', () => {
            const TestHoc = withProcessForm(DeleteProduct, 'delete', productValidations, initialData, null, null, mockExistingProductFetch, null)

            const wrapper = mount(
                <BrowserRouter>
                    <TestHoc />
                </BrowserRouter>
            )

            expect(wrapper.html()).toMatchSnapshot()
            expect(wrapper.find('img[src="loading-circle.gif"]').length).toEqual(1)

            mockExistingProductFetch()
        })

        it("should redirect to the home page when accessing a non-existing product's delete page", async () => {
            const TestHoc = withProcessForm(DeleteProduct, 'delete', productValidations, initialData, null, null, mockNonExistingProductFetch, null)

            const wrapper = mount(
                <BrowserRouter>
                    <TestHoc history={historyMock} />
                </BrowserRouter>
            )

            try {
                await mockNonExistingProductFetch()

            } catch (err) {
                expect(historyMock.push).toBeCalled()
                expect(historyMock.push).toHaveBeenLastCalledWith('/')

                expect(historyMock.push.mock.calls.length).toEqual(1)
                expect(historyMock.push.mock.calls[0][0]).toEqual('/')
            }
        })
    })
})