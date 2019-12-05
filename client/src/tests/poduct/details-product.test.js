import React from 'react'
import { mount } from 'enzyme'
import { BrowserRouter } from 'react-router-dom'
import { UserInfoProvider } from '../../App'
import { ProductDetails } from '../../components/product/details-product'
import withProcessForm from '../../components/hocs/withProcessForm'

// when someone accesses non-existing product's details
// => just before they are redirected, they will see loading - circle.gif
// => and then will be redirected

const mockProductFetching = () => {
    const sampleData = JSON.stringify({
        _id: '1',
        title: 'Test',
        description: 'This is a test for the React component ProductDetails',
        image: 'no-img',
        price: 1,
        likes: ['firstUserId', 'secondUserId', 'thirdUserId', 'fourthUserId']
    })

    // wrap the data in a new Response object to be able to handle it correctly in withProcessForm.js
    return Promise.resolve(new Response(sampleData))
}

const initialData = {
    title: '', description: '', image: '', price: ''
}

describe('tests for ProductDetails component', () => {
    it("should render product details without any links below it, when a [guest] accesses [existing] product's details", () => {

        const TestHoc = withProcessForm(ProductDetails, 'details', null, initialData, null, null, mockProductFetching) // replaced productValidations, extraMethods with null
        const defaultUserValue = { isLogged: false, username: '', role: '' }

        const wrapper = mount(
            <UserInfoProvider value={defaultUserValue}>
                <TestHoc />
            </UserInfoProvider>
        )

        mockProductFetching()
            .then(res => res.json())
            .then(res => {
                wrapper.setState({
                    data: res
                })
                wrapper.update()

                expect(wrapper.html()).toMatchSnapshot()
                expect(wrapper.find('a.product-actions-btn').length).toEqual(0)
            })
    })

    it("should render product details with links for [like] and [add to cart] below it, when a [user] accesses [existing] product's details", () => {

        const TestHoc = withProcessForm(ProductDetails, 'details', null, initialData, null, null, mockProductFetching)
        const defaultUserValue = { isLogged: true, username: 'some-username', role: 'User' }

        const wrapper = mount(
            <BrowserRouter>
                <UserInfoProvider value={defaultUserValue}>
                    <TestHoc />
                </UserInfoProvider>
            </BrowserRouter>
        )

        mockProductFetching()
            .then(res => res.json())
            .then(res => {
                wrapper.setState({
                    data: res
                })
                wrapper.update()

                expect(wrapper.html()).toMatchSnapshot()
                expect(wrapper.find('a.product-actions-btn').length).toEqual(2)

                expect(wrapper.find('a[href="/product/like/1"]').length).toEqual(1)
                expect(wrapper.find('a[href="/product/like/1"]').text()).toEqual('like')

                expect(wrapper.find('a[href="/cart/add/1"]').length).toEqual(1)
                expect(wrapper.find('a[href="/cart/add/1"]').text()).toEqual('add to cart')
            })

    })

    it("should render product details with all links for [like][edit][delete][add to cart] below it, when The [Admin] accesses [existing] product's details", () => {

        const TestHoc = withProcessForm(ProductDetails, 'details', null, initialData, null, null, mockProductFetching)
        const defaultUserValue = { isLogged: true, username: 'admin', role: 'Admin' }

        const wrapper = mount(
            <BrowserRouter>
                <UserInfoProvider value={defaultUserValue}>
                    <TestHoc />
                </UserInfoProvider>
            </BrowserRouter>
        )

        mockProductFetching()
            .then(res => res.json())
            .then(res => {
                wrapper.setState({
                    data: res
                })
                wrapper.update()

                expect(wrapper.html()).toMatchSnapshot()
                expect(wrapper.find('a.product-actions-btn').length).toEqual(4)

                expect(wrapper.find('a[href="/product/like/1"]').length).toEqual(1)
                expect(wrapper.find('a[href="/product/like/1"]').text()).toEqual('like')

                expect(wrapper.find('a[href="/product/edit/1"]').length).toEqual(1)
                expect(wrapper.find('a[href="/product/edit/1"]').text()).toEqual('edit')

                expect(wrapper.find('a[href="/product/delete/1"]').length).toEqual(1)
                expect(wrapper.find('a[href="/product/delete/1"]').text()).toEqual('delete')

                expect(wrapper.find('a[href="/cart/add/1"]').length).toEqual(1)
                expect(wrapper.find('a[href="/cart/add/1"]').text()).toEqual('add to cart')
            })
    })

    it("should render loading circle gif, when a [guest] accesses [non-existing] product's details", () => {

        const TestHoc = withProcessForm(ProductDetails, 'details', null, initialData, null, null, null)
        const defaultUserValue = { isLogged: false, username: '', role: '' }

        const wrapper = mount(
            <UserInfoProvider value={defaultUserValue}>
                <TestHoc />
            </UserInfoProvider>
        )

        expect(wrapper.html()).toMatchSnapshot()
        expect(wrapper.find('a').length).toEqual(0)
        expect(wrapper.find('img[alt="loading-img"]').length).toEqual(1)
    })

    it("should render loading circle gif, when a [user] accesses [non-existing] product's details", () => {

        const TestHoc = withProcessForm(ProductDetails, 'details', null, initialData, null, null, null)
        const defaultUserValue = { isLogged: true, username: 'my-name-is-this', role: 'User' }

        const wrapper = mount(
            <UserInfoProvider value={defaultUserValue}>
                <TestHoc />
            </UserInfoProvider>
        )

        expect(wrapper.html()).toMatchSnapshot()
        expect(wrapper.find('a').length).toEqual(0)
        expect(wrapper.find('img[alt="loading-img"]').length).toEqual(1)
    })

    it("should render loading circle gif, when The [Admin] accesses [non-existing] product's details", () => {

        const TestHoc = withProcessForm(ProductDetails, 'details', null, initialData, null, null, null)
        const defaultUserValue = { isLogged: true, username: 'admin', role: 'Admin' }

        const wrapper = mount(
            <UserInfoProvider value={defaultUserValue}>
                <TestHoc />
            </UserInfoProvider>
        )

        expect(wrapper.html()).toMatchSnapshot()
        expect(wrapper.find('a').length).toEqual(0)
        expect(wrapper.find('img[alt="loading-img"]').length).toEqual(1)
    })
})