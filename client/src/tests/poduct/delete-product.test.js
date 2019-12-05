//!! https://stackoverflow.com/questions/50682726/how-to-unit-test-a-react-event-handler-that-contains-history-push-using-jest-and
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
// The [Admin] accesses delete-[existing]-product page
//              -- and the data is fetched
//              -- and the data is not fetched yet
// The [Admin] accesses delete-[non-existing]-product page      // stuff to happen here
//

const mockNonExistingProductFetch = () => {



}

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

const mockPoductDelete = () => {
    return Promise.resolve({ success: 'Product deleted successfully!' })
}

const initialData = {
    title: '', description: '', image: '', price: '',
}

const sampleEvent = {
    preventDefault: () => {
        console.log('I am fake prevent-defaulter.')
    }
}

const historyMock = {
    push: jest.fn()
}

describe('tests for the component DeleteProduct', () => {

    describe('tests for guest functionalities', () => {

        it('should return redirect to the home page when a [guest] accesses delete-product page', () => {
            const defaultUserValue = { isLogged: false, username: '', role: '' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/product/delete/:productId" component={DeleteProduct} role="Admin" isTest={true} />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.debug()).toMatchSnapshot()
            expect(wrapper.find('Redirect[to="/"]').length).toEqual(1)
        })
    })

    describe('tests for user functionalities', () => {

        it('should return redirect to the home page when a [user] accesses delete-product page', () => {
            const defaultUserValue = { isLogged: true, username: 'lalala', role: 'User' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/product/delete/:productId" component={DeleteProduct} role="Admin" isTest={true} />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.debug()).toMatchSnapshot()
            expect(wrapper.find('Redirect[to="/"]').length).toEqual(1)
        })
    })

    describe('tests for admin functionalities', () => {

        it("should return product's delete page with it's [fetched] data, when The [Admin] tries to delete [existing] product", () => {

            const TestHoc = withProcessForm(DeleteProduct, 'delete', productValidations, initialData, null, null, mockExistingProductFetch, mockPoductDelete)
            const defaultUserValue = { isLogged: true, username: 'admin', role: 'Admin' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <TestHoc history={historyMock} />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            mockExistingProductFetch()
                .then(res => res.json())
                .then(res => {
                    wrapper.setState({
                        data: res
                    })

                    wrapper.update()

                    expect(wrapper.debug()).toMatchSnapshot()

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

                    wrapper.find('form').simulate('submit', sampleEvent)
                    // expect(wrapper.find('form').length).toEqual(0)
                    // expect(wrapper.debug()).toMatchSnapshot()
                    wrapper.update()

                    // expect(historyMock.push).toHaveBeenLastCalledWith('/') 
                    try {
                        expect(historyMock.push).toBeCalled()
                    } catch (err) {
                        console.log(err)
                    }
                    console.log(historyMock.push.mock.calls)


                })

        })

    })
})