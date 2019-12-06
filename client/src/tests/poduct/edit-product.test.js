import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import AuthRoute from '../../components/routes/auth-route'
import { UserInfoProvider } from '../../App'
import withProcessForm from '../../components/hocs/withProcessForm'
import { EditProduct } from '../../components/product/edit-product'
import { productValidations } from '../../components/hocs/validations'

// scenarios:
//
////1. a [guest] accesses edit-product page => and then will be redirected
////2. a [user] accesses edit-product page  => and then will be redirected
////3. The [Admin] is allowed to accesses edit-product page => and then will NOT be redirected
//
//
// The [Admin] accesses edit page of [existing]-product:
//
//   -+- and the data is fetched
//4.      -- submit button is not clicked yet
////5.         -- valid info is passed to 3 of the fields
//6.           -- invalid info is passed for [name] / [img] / [description] / [price]
//7.           -- invalid info is passed for [name img description and price]
//
//8.      -- submit button is clicked
//9.           -- valid info is passed to 3 of the fields
//10.           -- invalid info is passed for [name] / [img] / [description] / [price]
//11.           -- invalid info is passed for [name img description and price]
//
//12. -+-  and the data is not fetched yet
//      /not needed to test the case when the form is submitted now, it will not be processed and will throw an error as it does on create-product, when no data is passed/
//
//
//13. The[Admin] accesses edit page of a [non-existing]-product

const initialData = {
    title: '',
    image: '',
    description: '',
    price: '',

    titleClass: 'correct',
    descriptionClass: 'correct',
    priceClass: 'correct',

    uploadedImg: ''
}

const mockExistingProductFetch = () => {
    const sampleData = JSON.stringify(
        {
            _id: 1,
            title: 'Tova e title',
            image: 'yummy-шейк.jpg',
            description: 'This is so cool, I am getting better :)',
            price: 2.93,
            likes: ['firstUserId', 'secondUserId', 'thirdUserId', 'fourthuserId', 'fifthUserId']
        })

    return Promise.resolve(new Response(sampleData))
}

const mockNonExistingProductFetch = () => {
    const sampleReturnedData = JSON.stringify({ message: 'This product does not exist!' })
    const responseOptions = { status: 404, ok: false, statusText: '' }

    return Promise.reject(
        new Response(sampleReturnedData, responseOptions)
    )
}

const historyMock = {
    push: jest.fn()
}

const sampleEvents = {
    onTitleChange: {
        target: { name: 'title', value: "new title" }
    },
    // onImageChange: {
    //     target: { name: 'image', files: ["a-file-will-be-here.png"] }
    // },
    onDescriptionChange: {
        target: { name: 'description', value: "that's right, this is a new title" }
    },
    onPriceChange: {
        target: { name: 'price', value: '229' }
    },

    onFormSubmit: {

    }
}

describe('tests for the component EditProduct', () => {

    describe('tests for guest functionalities', () => {

        it('should redirect [guests] to the home page when they accesses edit-product page', () => {
            const defaultUserValue = { isLogged: false, username: '', role: '' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/product/edit/:productId" component={EditProduct} role="Admin" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.debug()).toMatchSnapshot()
            expect(wrapper.find('Redirect[to="/"]').length).toEqual(1)
        })
    })

    describe('tests for user functionalities', () => {

        it('should redirect [users] to the home page when they accesses edit-product page', () => {
            const defaultUserValue = { isLogged: true, username: 'my-name-is-user', role: 'User' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/product/edit/:productId" component={EditProduct} role="Admin" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.debug()).toMatchSnapshot()
            expect(wrapper.find('Redirect[to="/"]').length).toEqual(1)
        })
    })

    describe('tests for admin functionalities', () => {

        it('should let The [Admin] accesses edit-product page by returning <Route path="/product/edit/:productId" .... />', () => {
            const defaultUserValue = { isLogged: true, username: 'xixix', role: 'Admin' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/product/edit/:productId" component={EditProduct} role="Admin" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.debug()).toMatchSnapshot()
            expect(wrapper.find('Route[path="/product/edit/:productId"]').length).toEqual(1)
        })



        it("should render [existing] product's edit page with it's [fetched] data", () => {
            const TestHoc = withProcessForm(EditProduct, 'edit', productValidations, initialData, null, null, mockExistingProductFetch, null)

            const wrapper = mount(
                <TestHoc />
            )

            mockExistingProductFetch()
                .then(res => res.json())
                .then(res => {
                    wrapper.setState({
                        data: res
                    })

                    wrapper.update()

                    expect(wrapper.debug()).toMatchSnapshot()

                    expect(wrapper.find('div.form-type').length).toEqual(1)
                    expect(wrapper.find('div.form-type').text()).toEqual('Edit a product')

                    expect(wrapper.find('input[id="title"]').length).toEqual(1)
                    expect(wrapper.find('input[id="title"]').prop('defaultValue')).toEqual('Tova e title')

                    expect(wrapper.find('img[src="data:image/png;base64, yummy-шейк.jpg"]').length).toEqual(1)

                    expect(wrapper.find('textarea[id="description"]').text()).toEqual('This is so cool, I am getting better :)')

                    expect(wrapper.find('input[id="price"]').length).toEqual(1)
                    expect(wrapper.find('input[id="price"]').prop('defaultValue')).toEqual(2.93)

                    expect(wrapper.find('button.button[type="submit"]').text()).toEqual('Save changes')
                })
        })

        it("should mark as valid 3 of the product's fields after input change", () => {
            const TestHoc = withProcessForm(EditProduct, 'edit', productValidations, initialData, null, null, mockExistingProductFetch, null)

            const wrapper = mount(
                <TestHoc />
            )

            mockExistingProductFetch()
                .then(res => res.json())
                .then(async res => {
                    wrapper.setState({
                        data: res
                    })
                    wrapper.update()

                    await wrapper.find('input[id="title"]').simulate('change', sampleEvents.onTitleChange)
                    expect(wrapper.find('input[id="title"]').prop('defaultValue')).toEqual(sampleEvents.onTitleChange.target.value)
                    wrapper.update()
                    expect(wrapper.find('input[id="title"]').hasClass('correct')).toEqual(true)

                    await wrapper.find('textarea[id="description"]').simulate('change', sampleEvents.onDescriptionChange)
                    expect(wrapper.find('textarea[id="description"]').text()).toEqual(sampleEvents.onDescriptionChange.target.value)
                    wrapper.update()
                    expect(wrapper.find('textarea[id="description"]').hasClass('correct')).toEqual(true)

                    await wrapper.find('input[id="price"]').simulate('change', sampleEvents.onPriceChange)
                    expect(wrapper.find('input[id="price"]').prop('defaultValue')).toEqual(sampleEvents.onPriceChange.target.value)
                    wrapper.update()
                    expect(wrapper.find('input[id="price"]').hasClass('correct')).toEqual(true)
                })
        })



    })
})