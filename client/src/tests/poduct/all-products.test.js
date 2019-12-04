import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import { UserInfoProvider } from '../../App'
import AllProducts from '../../components/product/all-products'

const mockManyProductsFetch = () => {
    const sampleData = JSON.stringify([
        {
            _id: 1,
            title: 'Tova e title',
            image: 'img',
            price: 5,
            likes: ['firstUserId', 'secondUserId', 'thirdUserId']
        },
        {
            _id: 2,
            title: 'Tova e title 2',
            image: 'img-2',
            price: 6,
            likes: ['firstUserId', 'secondUserId']
        },
        {
            _id: 3,
            title: 'Tova e title 3',
            image: 'img-3',
            price: 3.8,
            likes: ['firstUserId']
        }
    ])

    // wrap the data in a new Response object to be able to handle it correctly in withProcessForm.js
    return Promise.resolve(new Response(sampleData))
}

const mockAProductFetch = () => {
    const sampleData = JSON.stringify([
        {
            _id: 1,
            title: 'Tova e title',
            image: 'img',
            price: 5,
            likes: ['firstUserId', 'secondUserId', 'thirdUserId']
        }
    ])

    return Promise.resolve(new Response(sampleData))
}

const mockNoProductsFetch = () => {
    const sampleData = JSON.stringify([])
    return Promise.resolve(new Response(sampleData))
}

describe('tests for the component AllProducts, a.k.a. Home page', () => {

    describe('guest functionalities tests', () => {
        it('should render loading gif for all [guests] untill the info is fetched', () => {
            const defaultUserValue = { isLogged: false, username: '', role: '' }

            const wrapper = mount(
                <UserInfoProvider value={defaultUserValue}>
                    <AllProducts />
                </UserInfoProvider>
            )

            expect(wrapper.find('img[alt="loading-img"]').length).toEqual(1)
        })

        it('should render a div saying that there are no products for all [guests]', () => {
            const defaultUserValue = { isLogged: false, username: '', role: '' }

            const wrapper = mount(
                <UserInfoProvider value={defaultUserValue}>
                    <AllProducts service={mockNoProductsFetch} />
                </UserInfoProvider>
            )

            mockNoProductsFetch()
                .then(res => res.json())
                .then(res => {
                    wrapper.setState({
                        products: res,
                        isFetched: true
                    })

                    wrapper.update()

                    expect(wrapper.html()).toMatchSnapshot()

                    expect(wrapper.find('div.no-products-container').length).toEqual(1)
                    expect(wrapper.find('div.no-products-text-container').length).toEqual(1)

                    expect(wrapper.find('h1').length).toEqual(1)
                    expect(wrapper.find('h1').text()).toEqual('Our products are so desired that we could not predict we would run out of stock this soon..')

                    expect(wrapper.find('h2').length).toEqual(1)
                    expect(wrapper.find('h2').text()).toEqual('Sorry!')

                    expect(wrapper.find('div.no-products-img').length).toEqual(1)
                })
        })

        it('should render one product without any links below it for all [guests]', () => {
            const defaultUserValue = { isLogged: false, username: '', role: '' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AllProducts service={mockAProductFetch} />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            mockAProductFetch()
                .then(res => res.json())
                .then(res => {
                    wrapper.setState({
                        products: res,
                        isFetched: true
                    })
                    wrapper.update()

                    expect(wrapper.html()).toMatchSnapshot()
                    expect(wrapper.find('a[href="/product/details/1"]').length).toEqual(2)

                    expect(wrapper.find('a[href="/product/like/1"]').length).toEqual(0)
                    expect(wrapper.find('a[href="/product/edit/1"]').length).toEqual(0)
                    expect(wrapper.find('a[href="/product/delete/1"]').length).toEqual(0)
                    expect(wrapper.find('a[href="/cart/add/1"]').length).toEqual(0)
                })
        })

        it('should render three products without any links below it for all [guests]', () => {
            const defaultUserValue = { isLogged: false, username: '', role: '' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AllProducts service={mockManyProductsFetch} />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            mockManyProductsFetch()
                .then(res => res.json())
                .then(res => {
                    wrapper.setState({
                        products: res,
                        isFetched: true
                    })

                    wrapper.update()

                    expect(wrapper.html()).toMatchSnapshot()

                    res.map(product => {
                        expect(wrapper.find(`a[href="/product/details/${product._id}"]`).length).toEqual(2)
                    })
                })
        })
    })

    describe('user functionalities tests', () => {
        it('should render loading gif for all [users] untill the info is fetched', () => {
            const defaultUserValue = { isLogged: true, username: 'my-name-is-yolo', role: 'User' }

            const wrapper = mount(
                <UserInfoProvider value={defaultUserValue}>
                    <AllProducts />
                </UserInfoProvider>
            )

            expect(wrapper.find('img[alt="loading-img"]').length).toEqual(1)
        })

        it('should render a div saying that there are no products for all [users]', () => {
            const defaultUserValue = { isLogged: false, username: 'cucumber', role: 'User' }

            const wrapper = mount(
                <UserInfoProvider value={defaultUserValue}>
                    <AllProducts service={mockNoProductsFetch} />
                </UserInfoProvider>
            )

            mockNoProductsFetch()
                .then(res => res.json())
                .then(res => {
                    wrapper.setState({
                        products: res,
                        isFetched: true
                    })

                    wrapper.update()

                    expect(wrapper.html()).toMatchSnapshot()

                    expect(wrapper.find('div.no-products-container').length).toEqual(1)
                    expect(wrapper.find('div.no-products-text-container').length).toEqual(1)

                    expect(wrapper.find('h1').length).toEqual(1)
                    expect(wrapper.find('h1').text()).toEqual('Our products are so desired that we could not predict we would run out of stock this soon..')

                    expect(wrapper.find('h2').length).toEqual(1)
                    expect(wrapper.find('h2').text()).toEqual('Sorry!')

                    expect(wrapper.find('div.no-products-img').length).toEqual(1)
                })
        })

        it('should render one product without any links below it for all [users]', () => {
            const defaultUserValue = { isLogged: true, username: 'az-sam-tova', role: 'User' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AllProducts service={mockAProductFetch} />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            mockAProductFetch()
                .then(res => res.json())
                .then(res => {

                    wrapper.setState({
                        products: res,
                        isFetched: true
                    })
                    wrapper.update()

                    expect(wrapper.html()).toMatchSnapshot()
                    expect(wrapper.find('a[href="/product/details/1"]').length).toEqual(2)

                    expect(wrapper.find('a[href="/product/like/1"]').length).toEqual(1)
                    expect(wrapper.find('a[href="/product/edit/1"]').length).toEqual(0)
                    expect(wrapper.find('a[href="/product/delete/1"]').length).toEqual(0)
                    expect(wrapper.find('a[href="/cart/add/1"]').length).toEqual(1)
                })
        })

        it('should render three products without any links below it for all [users]', () => {
            const defaultUserValue = { isLogged: true, username: 'az-sam-tova', role: 'User' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AllProducts service={mockManyProductsFetch} />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            mockManyProductsFetch()
                .then(res => res.json())
                .then(res => {
                    wrapper.setState({
                        products: res,
                        isFetched: true
                    })

                    wrapper.update()

                    expect(wrapper.html()).toMatchSnapshot()

                    res.map(product => {
                        expect(wrapper.find(`a[href="/product/details/${product._id}"]`).length).toEqual(2)
                        expect(wrapper.find(`a[href="/product/like/${product._id}"]`).length).toEqual(1)
                        expect(wrapper.find(`a[href="/cart/add/${product._id}"]`).length).toEqual(1)
                    })
                })

        })

    })

    describe('admin functionalities tests', () => {
        it('should render loading gif for The [Admin] untill the info is fetched', () => {
            const defaultUserValue = { isLogged: true, username: 'admin', role: 'Admin' }

            const wrapper = mount(
                <UserInfoProvider value={defaultUserValue}>
                    <AllProducts />
                </UserInfoProvider>
            )

            expect(wrapper.find('img[alt="loading-img"]').length).toEqual(1)
        })

        it('should render a div saying that there are no products for The [Admin]', () => {
            const defaultUserValue = { isLogged: false, username: 'admin4e', role: 'Admin' }

            const wrapper = mount(
                <UserInfoProvider value={defaultUserValue}>
                    <AllProducts service={mockNoProductsFetch} />
                </UserInfoProvider>
            )

            mockNoProductsFetch()

                .then(res => res.json())
                .then(res => {
                    wrapper.setState({
                        products: res,
                        isFetched: true
                    })

                    wrapper.update()

                    expect(wrapper.html()).toMatchSnapshot()

                    expect(wrapper.find('div.no-products-container').length).toEqual(1)
                    expect(wrapper.find('div.no-products-text-container').length).toEqual(1)

                    expect(wrapper.find('h1').length).toEqual(1)
                    expect(wrapper.find('h1').text()).toEqual('Our products are so desired that we could not predict we would run out of stock this soon..')

                    expect(wrapper.find('h2').length).toEqual(1)
                    expect(wrapper.find('h2').text()).toEqual('Sorry!')

                    expect(wrapper.find('div.no-products-img').length).toEqual(1)
                })
        })

        it('should render one product without any links below it for The [Admin]', () => {
            const defaultUserValue = { isLogged: true, username: 'admin', role: 'Admin' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AllProducts service={mockAProductFetch} />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            mockAProductFetch()
                .then(res => res.json())
                .then(res => {

                    wrapper.setState({
                        products: res,
                        isFetched: true
                    })
                    wrapper.update()

                    expect(wrapper.html()).toMatchSnapshot()
                    expect(wrapper.find('a[href="/product/details/1"]').length).toEqual(2)

                    expect(wrapper.find('a[href="/product/like/1"]').length).toEqual(1)
                    expect(wrapper.find('a[href="/product/edit/1"]').length).toEqual(1)
                    expect(wrapper.find('a[href="/product/delete/1"]').length).toEqual(1)
                    expect(wrapper.find('a[href="/cart/add/1"]').length).toEqual(1)
                })
        })

        it('should render three products without any links below it for The [Admin]', () => {
            const defaultUserValue = { isLogged: true, username: 'admin', role: 'Admin' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AllProducts service={mockManyProductsFetch} />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            mockManyProductsFetch()
                .then(res => res.json())
                .then(res => {
                    wrapper.setState({
                        products: res,
                        isFetched: true
                    })

                    wrapper.update()

                    expect(wrapper.html()).toMatchSnapshot()

                    res.map(product => {
                        expect(wrapper.find(`a[href="/product/details/${product._id}"]`).length).toEqual(2)
                        expect(wrapper.find(`a[href="/product/like/${product._id}"]`).length).toEqual(1)
                        expect(wrapper.find(`a[href="/product/edit/${product._id}"]`).length).toEqual(0)
                        expect(wrapper.find(`a[href="/product/delete/${product._id}"]`).length).toEqual(0)
                        expect(wrapper.find(`a[href="/cart/add/${product._id}"]`).length).toEqual(1)
                    })
                })
        })
    })
})