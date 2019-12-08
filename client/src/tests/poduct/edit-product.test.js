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
//// The [Admin] accesses edit page of [existing]-product:
//
//   -+- and the data is fetched
////4.      -- submit button is not clicked yet
////5.         -- valid info is passed to 3 of the fields
////6.           -- invalid info is passed for [title] / [description] / [price]
////7.           -- invalid info is passed for [title description and price]
//
////8.      -- submit button is clicked
////9.            -- valid info is passed to 3 of the fields                              *   sampleEvents.onFormSubmit should BE Called !!   *
////10.           -- invalid info is passed for [title] / [description] / [price]         * sampleEvents.onFormSubmit should NOT be Called !! *
////11.           -- invalid info is passed for [title description and price]             * sampleEvents.onFormSubmit should NOT be Called !! *
//
////12. -+-  and the data is not fetched yet
//      /not needed to test the case when the form is submitted now, it will not be processed and will throw an error as it does on create-product, when no data is passed/
//
//
////13. The[Admin] accesses edit page of a [non-existing]-product

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
    const responseOptions = { status: 404, ok: false, statusText: 'Not found!' }

    return Promise.reject(
        new Response(sampleReturnedData, responseOptions)
    )
}

const historyMock = {
    push: jest.fn()
}

const sampleEvents = {
    title: {
        validTitle: {
            target: { name: 'title', value: "new title" }
        },

        emptyTitle: {
            target: { name: 'title', value: "" }
        },

        tooShortTitle: {
            target: { name: 'title', value: "ne" }
        },

        tooLongTitle: {
            target: { name: 'title', value: "yyyyyyyyyeeeeeeeeeeeeeaaaaaaaaaaaaaaaaaaahhhhhhhhhhhhh" }
        },
    },
    // onImageChange: {
    //     target: { name: 'image', files: ["a-file-will-be-here.png"] }
    // },
    description: {
        validDescription: {
            target: { name: 'description', value: "that's right, this is a new description" }
        },

        emptyDescription: {
            target: { name: 'description', value: "" }
        },

        tooShortDescription: {
            target: { name: 'description', value: "shorty" }
        },

        tooLongDescription: {
            target: { name: 'description', value: "We use letters to communicate with other people. To simplify things, the users utilize software to type the document and count the number of words and characters they use. Another way to count the number of characters is through a character counter online." }
        }
    },
    price: {
        validPrice: {
            target: { name: 'price', value: '229' }
        },

        emptyPrice: {
            target: { name: 'price', value: '' }
        },

        zeroPrice: {
            target: { name: 'price', value: '0' }
        },

        belowZeroPrice: {
            target: { name: 'price', value: '-159' }
        }
    },

    onFormSubmit: {
        preventDefault: () => {
            // console.log('I am fake prevent-defaulter.')
        }
    }
}

const mockProductEdit = () => {
    const sampleReturnedData = JSON.stringify({ success: 'This product was editted successfully! :)' })
    return Promise.resolve(new Response(sampleReturnedData))
}

describe('tests for the component EditProduct', () => {

    afterEach(() => {
        // to reset Jest mock function calls count after every test:
        historyMock.push.mockClear()
    })

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

            expect(wrapper.html()).toMatchSnapshot()
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

            expect(wrapper.html()).toMatchSnapshot()
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

            expect(wrapper.html()).toMatchSnapshot()
            expect(wrapper.find('Route[path="/product/edit/:productId"]').length).toEqual(1)
        })



        it("should render [existing] product's edit page with it's [fetched] data", () => {
            const TestHoc = withProcessForm(EditProduct, 'edit', productValidations, initialData, null, null, mockExistingProductFetch, mockProductEdit)
            const wrapper = mount(<TestHoc history={historyMock} />)

            mockExistingProductFetch()
                .then(res => res.json())
                .then(async res => {
                    wrapper.setState({
                        data: res
                    })
                    wrapper.update()

                    expect(wrapper.html()).toMatchSnapshot()

                    expect(wrapper.find('div.form-type').length).toEqual(1)
                    expect(wrapper.find('div.form-type').text()).toEqual('Edit a product')

                    expect(wrapper.find('input[id="title"]').length).toEqual(1)
                    expect(wrapper.find('input[id="title"]').prop('defaultValue')).toEqual('Tova e title')

                    expect(wrapper.find('img[src="data:image/png;base64, yummy-шейк.jpg"]').length).toEqual(1)
                    expect(wrapper.find('textarea[id="description"]').text()).toEqual('This is so cool, I am getting better :)')

                    expect(wrapper.find('input[id="price"]').length).toEqual(1)
                    expect(wrapper.find('input[id="price"]').prop('defaultValue')).toEqual(2.93)

                    expect(wrapper.find('button.button[type="submit"]').text()).toEqual('Save changes')


                    await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
                    expect(historyMock.push.mock.calls.length).toEqual(1)
                    expect(historyMock.push.mock.calls[0][0]).toEqual('/')
                    expect(historyMock.push).toBeCalled()
                    // expect(historyMock.push).toHaveBeenLastCalledWith('/')
                })
        })

        it("should mark as [valid] 3 of the product's fields after change", () => {
            const TestHoc = withProcessForm(EditProduct, 'edit', productValidations, initialData, null, null, mockExistingProductFetch, mockProductEdit)
            const wrapper = mount(<TestHoc history={historyMock} />)

            mockExistingProductFetch()
                .then(res => res.json())
                .then(async res => {
                    wrapper.setState({
                        data: res
                    })
                    wrapper.update()

                    await wrapper.find('input[id="title"]').simulate('change', sampleEvents.title.validTitle)
                    expect(wrapper.find('input[id="title"]').prop('defaultValue')).toEqual(sampleEvents.title.validTitle.target.value)
                    wrapper.update()
                    expect(wrapper.find('input[id="title"]').hasClass('correct')).toEqual(true)

                    await wrapper.find('textarea[id="description"]').simulate('change', sampleEvents.description.validDescription)
                    expect(wrapper.find('textarea[id="description"]').text()).toEqual(sampleEvents.description.validDescription.target.value)
                    wrapper.update()
                    expect(wrapper.find('textarea[id="description"]').hasClass('correct')).toEqual(true)

                    await wrapper.find('input[id="price"]').simulate('change', sampleEvents.price.validPrice)
                    expect(wrapper.find('input[id="price"]').prop('defaultValue')).toEqual(sampleEvents.price.validPrice.target.value)
                    wrapper.update()
                    expect(wrapper.find('input[id="price"]').hasClass('correct')).toEqual(true)


                    await wrapper.find('form').simulate('submit', mockProductEdit)
                    expect(historyMock.push.mock.calls.length).toEqual(1)
                    expect(historyMock.push.mock.calls[0][0]).toEqual('/')
                    // expect(historyMock.push).toBeCalled()
                    // expect(historyMock.push).toHaveBeenLastCalledWith('/')
                })
        })

        it("should mark as [invalid] product's [title] after change", () => {
            const TestHoc = withProcessForm(EditProduct, 'edit', productValidations, initialData, null, null, mockExistingProductFetch, mockProductEdit)
            const wrapper = mount(<TestHoc history={historyMock} />)

            mockExistingProductFetch()
                .then(res => res.json())
                .then(async res => {
                    wrapper.setState({
                        data: res
                    })
                    wrapper.update()

                    await wrapper.find('input[id="title"]').simulate('change', sampleEvents.title.emptyTitle)
                    expect(wrapper.find('input[id="title"]').prop('defaultValue')).toEqual(sampleEvents.title.emptyTitle.target.value)
                    wrapper.update()
                    expect(wrapper.find('input[id="title"]').hasClass('error')).toEqual(true)

                    await wrapper.find('input[id="title"]').simulate('change', sampleEvents.title.tooShortTitle)
                    expect(wrapper.find('input[id="title"]').prop('defaultValue')).toEqual(sampleEvents.title.tooShortTitle.target.value)
                    wrapper.update()
                    expect(wrapper.find('input[id="title"]').hasClass('error')).toEqual(true)

                    await wrapper.find('input[id="title"]').simulate('change', sampleEvents.title.tooLongTitle)
                    expect(wrapper.find('input[id="title"]').prop('defaultValue')).toEqual(sampleEvents.title.tooLongTitle.target.value)
                    wrapper.update()
                    expect(wrapper.find('input[id="title"]').hasClass('error')).toEqual(true)


                    await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
                    expect(historyMock.push.mock.calls.length).toEqual(0)
                    // expect(historyMock.push.mock.calls[0]).toEqual(undefined)
                    // expect(historyMock.push).not.toBeCalled()
                    // expect(historyMock.push).not.toHaveBeenLastCalledWith('/')
                })
        })

        it("should mark as [invalid] product's [description] after change", () => {
            const TestHoc = withProcessForm(EditProduct, 'edit', productValidations, initialData, null, null, mockExistingProductFetch, mockProductEdit)
            const wrapper = mount(<TestHoc history={historyMock} />)

            mockExistingProductFetch()
                .then(res => res.json())
                .then(async res => {
                    wrapper.setState({
                        data: res
                    })
                    wrapper.update()

                    await wrapper.find('textarea[id="description"]').simulate('change', sampleEvents.description.emptyDescription)
                    expect(wrapper.find('textarea[id="description"]').text()).toEqual(sampleEvents.description.emptyDescription.target.value)
                    wrapper.update()
                    expect(wrapper.find('textarea[id="description"]').hasClass('error')).toEqual(true)

                    await wrapper.find('textarea[id="description"]').simulate('change', sampleEvents.description.tooShortDescription)
                    expect(wrapper.find('textarea[id="description"]').text()).toEqual(sampleEvents.description.tooShortDescription.target.value)
                    wrapper.update()
                    expect(wrapper.find('textarea[id="description"]').hasClass('error')).toEqual(true)

                    await wrapper.find('textarea[id="description"]').simulate('change', sampleEvents.description.tooLongDescription)
                    expect(wrapper.find('textarea[id="description"]').text()).toEqual(sampleEvents.description.tooLongDescription.target.value)
                    wrapper.update()
                    expect(wrapper.find('textarea[id="description"]').hasClass('error')).toEqual(true)


                    await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
                    expect(historyMock.push).not.toBeCalled()
                    // expect(historyMock.push).not.toHaveBeenLastCalledWith('/')
                    // expect(historyMock.push.mock.calls.length).toEqual(0)
                    // expect(historyMock.push.mock.calls[0]).toEqual(undefined)
                })
        })

        it("should mark as [invalid] product's [price] after change", () => {
            const TestHoc = withProcessForm(EditProduct, 'edit', productValidations, initialData, null, null, mockExistingProductFetch, mockProductEdit)
            const wrapper = mount(<TestHoc history={historyMock} />)

            mockExistingProductFetch()
                .then(res => res.json())
                .then(async res => {
                    wrapper.setState({
                        data: res
                    })
                    wrapper.update()

                    await wrapper.find('input[id="price"]').simulate('change', sampleEvents.price.emptyPrice)
                    expect(wrapper.find('input[id="price"]').prop('defaultValue')).toEqual(sampleEvents.price.emptyPrice.target.value)
                    wrapper.update()
                    expect(wrapper.find('input[id="price"]').hasClass('error')).toEqual(true)

                    await wrapper.find('input[id="price"]').simulate('change', sampleEvents.price.zeroPrice)
                    expect(wrapper.find('input[id="price"]').prop('defaultValue')).toEqual(sampleEvents.price.zeroPrice.target.value)
                    wrapper.update()
                    expect(wrapper.find('input[id="price"]').hasClass('error')).toEqual(true)

                    await wrapper.find('input[id="price"]').simulate('change', sampleEvents.price.belowZeroPrice)
                    expect(wrapper.find('input[id="price"]').prop('defaultValue')).toEqual(sampleEvents.price.belowZeroPrice.target.value)
                    wrapper.update()
                    expect(wrapper.find('input[id="price"]').hasClass('error')).toEqual(true)


                    await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
                    expect(historyMock.push).not.toBeCalled()
                    // expect(historyMock.push).not.toHaveBeenLastCalledWith('/')
                    // expect(historyMock.push.mock.calls.length).toEqual(0)
                    // expect(historyMock.push.mock.calls[0]).toEqual(undefined)
                })
        })

        it("should mark as [invalid] 3 of the product's fields after change", () => {
            const TestHoc = withProcessForm(EditProduct, 'edit', productValidations, initialData, null, null, mockExistingProductFetch, mockProductEdit)
            const wrapper = mount(<TestHoc history={historyMock} />)

            mockExistingProductFetch()
                .then(res => res.json())
                .then(async res => {
                    wrapper.setState({
                        data: res
                    })
                    wrapper.update()

                    await wrapper.find('input[id="title"]').simulate('change', sampleEvents.title.emptyTitle)
                    await wrapper.find('textarea[id="description"]').simulate('change', sampleEvents.description.emptyDescription)
                    await wrapper.find('input[id="price"]').simulate('change', sampleEvents.price.emptyPrice)

                    expect(wrapper.find('input[id="title"]').prop('defaultValue')).toEqual(sampleEvents.title.emptyTitle.target.value)
                    expect(wrapper.find('textarea[id="description"]').text()).toEqual(sampleEvents.description.emptyDescription.target.value)
                    expect(wrapper.find('input[id="price"]').prop('defaultValue')).toEqual(sampleEvents.price.emptyPrice.target.value)

                    wrapper.update()

                    expect(wrapper.find('input[id="title"]').hasClass('error')).toEqual(true)
                    expect(wrapper.find('textarea[id="description"]').hasClass('error')).toEqual(true)
                    expect(wrapper.find('input[id="price"]').hasClass('error')).toEqual(true)


                    await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
                    expect(historyMock.push).not.toBeCalled()
                    expect(historyMock.push).not.toHaveBeenLastCalledWith('/')
                    expect(historyMock.push.mock.calls.length).toEqual(0)
                    expect(historyMock.push.mock.calls.length).not.toEqual(1)
                    expect(historyMock.push.mock.calls[0]).toEqual(undefined)
                })

        })

        it("should render loading-circle.gif until the server returns a response", () => {
            const TestHoc = withProcessForm(EditProduct, 'edit', productValidations, initialData, null, null, mockExistingProductFetch, null)
            const wrapper = mount(<TestHoc />)

            expect(wrapper.html()).toMatchSnapshot()
            expect(wrapper.find('div.form-fields-wrapper').length).toEqual(0)
            expect(wrapper.find('img[src="loading-circle.gif"]').length).toEqual(1)

            mockExistingProductFetch()
        })

        // unneccessary
        // it("should render loading-circle.gif when [non-existing] product is requested", () => {
        //     const TestHoc = withProcessForm(EditProduct, 'edit', productValidations, initialData, null, null, mockNonExistingProductFetch, null)
        //     const wrapper = mount(<TestHoc history={historyMock} />)

        //     expect(wrapper.html()).toMatchSnapshot()
        //     expect(wrapper.find('div.form-fields-wrapper').length).toEqual(0)
        //     expect(wrapper.find('img[src="loading-circle.gif"]').length).toEqual(1)

        //     mockNonExistingProductFetch()
        //         .catch(err => {
        //             return err
        //         })
        // })

        it("should redirect to the home page when accessing a non-existing product's edit page", async () => {
            const TestHoc = withProcessForm(EditProduct, 'edit', productValidations, initialData, null, null, mockNonExistingProductFetch, null)
            const wrapper = mount(<TestHoc history={historyMock} />)

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