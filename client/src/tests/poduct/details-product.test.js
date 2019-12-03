import React from 'react'
import { mount } from 'enzyme'
import { UserInfoProvider } from '../../App'
import withProcessForm from '../../components/hocs/withProcessForm'
import ProductDetails from '../../components/product/details-product'

import { productValidations } from '../../components/hocs/validations'
import promiseExtraMethods from '../../components/hocs/promiseExtraMethods'

// https://dev.to/papaponmx/unit-testing-hoc-connected-components-2d8h
const mockProductFetching = () => {
    const sampleData = JSON.stringify({
        _id: '1',
        title: 'Test',
        description: 'This is a test for the React component ProductDetails',
        image: 'no-img',
        price: '1',
        likes: '100'
    })

    // wrap the data in a new Response object to be able to handle it correctly in withProcessForm.js
    return Promise.resolve(new Response(sampleData))
}

const initialData = {
    // _id: props.match.params.productId,
    title: '',
    description: '',
    image: '',
    price: '',
}

const extraMethods = {
    success: promiseExtraMethods.product().onProductPromiseSuccess,
    fail: promiseExtraMethods.product().onProductPromiseFail,
}

describe('tests for ProductDetails component', () => {
    it('should render product details without any buttons below it, when a user is not logged in', () => {
        const productPromise = mockProductFetching()

        const TestHoc = withProcessForm(<ProductDetails />, 'details', productValidations, initialData, null, extraMethods, mockProductFetching)

        const wrapper = mount(
            <UserInfoProvider>
                {TestHoc}
            </UserInfoProvider>
        )
        console.log(wrapper)

        // const wrapper = mount(
        //     withProcessForm(
        //         <UserInfoProvider>
        //             <ProductDetails />
        //         </UserInfoProvider>,
        //         'details', productValidations, initialData, null, extraMethods, mockProductFetching)
        // )

        // const wrapper = mount(
        //     <withProcessForm Form={
        //         <UserInfoProvider>
        //             <ProductDetails />
        //         </UserInfoProvider>}

        //         formType={'details'} validations={productValidations} initialData={initialData} requestType={null} promiseExtraMethods={extraMethods} service={mockProductFetching}
        //     />
        // )

        productPromise
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(res => {
                // do stuff here
                wrapper.update()
            })


        expect(wrapper.debug()).toMatchSnapshot()
        // expect(wrapper.find('div.product-title').length).toEqual(1)
    })






})
