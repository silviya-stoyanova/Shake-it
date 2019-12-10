import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import { CreateProduct } from '../../components/product/create-product'
import withProcessForm from '../../components/hocs/withProcessForm'
import AuthRoute from '../../components/routes/auth-route'
import { UserInfoProvider } from '../../App'
import { productValidations } from '../../components/hocs/validations'
import promiseExtraMethods from '../../components/hocs/promiseExtraMethods'

// scenarios:

//// when a guest access CreateProduct page they should be redirected to the home page
//// when a user access CreateProduct page they should be redirected to the home page

//// when The Admin access CreateProduct page they should be able to add a product
//
// should render a form for creating a product with empty fields
//
// -- submit button is not clicked yet
//   -- valid info is passed to 4 of the fields
//   -- invalid info is passed for [title] / [description] / [image] / [price]
//   -- invalid info is passed for [title, description, image and price]

// -- submit button is clicked
//    -- valid info is passed to 4 of the fields                                *   sampleEvents.onFormSubmit should BE Called !!   *
//    -- invalid info is passed for [title] / [description] / [image] / [price] * sampleEvents.onFormSubmit should NOT be Called !! *
//    -- invalid info is passed for [title, description, image and price]

const initialData = {
    title: '',
    description: '',
    image: '',
    price: '',

    titleClass: '',
    descriptionClass: '',
    imageClass: '',              // new, just for testing purposes
    priceClass: '',

    uploadedImg: ''
}

const extraMethods = {
    success: promiseExtraMethods.product().onProductPromiseSuccess,
    fail: promiseExtraMethods.product().onProductPromiseFail,
}

const mockUploadedImg = () => {
    const fileBts = ["I-am-your-new-milkshake-pls-choose-meeeeee"]
    const fileName = 'cool-shake.png'
    const options = { type: "image/png" }
    return new File(fileBts, fileName, options)
}

const sampleEvents = {
    title: {
        validTitle: {
            target: { name: 'title', value: "shaky-maky" }
        },
        emptyTitle: {
            target: { name: 'title', value: "" }
        },
        tooShortTitle: {
            target: { name: 'title', value: "zd" }
        },
        tooLongTitle: {
            target: { name: 'title', value: "yyyyyyyyyeeeeeeeeeeeeeaaaaaaaaaaaaaaaaaaahhhhhhhhhhhhh" }
        },
    },
    image: {
        validImage: {
            target: { name: 'image', files: [mockUploadedImg()] }
        },
        invalidImage: {
            target: { name: 'image' }
        }
    },
    description: {
        validDescription: {
            target: { name: 'description', value: "this is a new shake" }
        },
        emptyDescription: {
            target: { name: 'description', value: "" }
        },
        tooShortDescription: {
            target: { name: 'description', value: "sho" }
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
            return 'I am fake prevent-defaulter.'
        }
    }
}

const historyMock = {
    push: jest.fn()
}

const mockProductCreate = () => {
    const sampleReturnedData = JSON.stringify({ success: 'This product was editted successfully! :)' })
    return Promise.resolve(new Response(sampleReturnedData))
}

describe('tests for the component CreateProduct', () => {
    window.URL.createObjectURL = jest.fn()

    let TestHoc = withProcessForm(CreateProduct, 'create', productValidations, initialData, null, extraMethods, null, mockProductCreate)
    let wrapper

    beforeEach(() => {
        wrapper = mount(<TestHoc history={historyMock} />)
    })

    afterEach(() => {
        // to reset Jest mock function calls count after every test:
        historyMock.push.mockClear()

        window.URL.createObjectURL.mockReset();
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

        it('should render a form for creating a product with empty fields', async () => {
            expect(wrapper.html()).toMatchSnapshot()
            await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push).not.toBeCalled()
        })



        it("should mark as [valid] all of the product's fields after change", async () => {
            await wrapper.find('input[id="title"]').simulate('change', sampleEvents.title.validTitle)
            expect(wrapper.find('input[id="title"]').prop('value')).toEqual(sampleEvents.title.validTitle.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="title"]').hasClass('correct')).toEqual(true)

            await wrapper.find('textarea[id="description"]').simulate('change', sampleEvents.description.validDescription)
            expect(wrapper.find('textarea[id="description"]').prop('value')).toEqual(sampleEvents.description.validDescription.target.value)
            wrapper.update()
            expect(wrapper.find('textarea[id="description"]').hasClass('correct')).toEqual(true)

            await wrapper.find('input[id="image"]').simulate('change', sampleEvents.image.validImage)
            wrapper.update()
            expect(wrapper.find('input[id="image"]').hasClass('correct')).toEqual(true)

            await wrapper.find('input[id="price"]').simulate('change', sampleEvents.price.validPrice)
            expect(wrapper.find('input[id="price"]').prop('value')).toEqual(sampleEvents.price.validPrice.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="price"]').hasClass('correct')).toEqual(true)


            await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push.mock.calls.length).toEqual(1)
            expect(historyMock.push).toHaveBeenLastCalledWith('/')
        })

        it("should mark as [invalid] product's [title] after change", async () => {
            await wrapper.find('input[id="title"]').simulate('change', sampleEvents.title.emptyTitle)
            expect(wrapper.find('input[id="title"]').prop('value')).toEqual(sampleEvents.title.emptyTitle.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="title"]').hasClass('error')).toEqual(true)

            await wrapper.find('input[id="title"]').simulate('change', sampleEvents.title.tooShortTitle)
            expect(wrapper.find('input[id="title"]').prop('value')).toEqual(sampleEvents.title.tooShortTitle.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="title"]').hasClass('error')).toEqual(true)

            await wrapper.find('input[id="title"]').simulate('change', sampleEvents.title.tooLongTitle)
            expect(wrapper.find('input[id="title"]').prop('value')).toEqual(sampleEvents.title.tooLongTitle.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="title"]').hasClass('error')).toEqual(true)

            await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push).not.toBeCalled()
            // expect(historyMock.push).not.toHaveBeenLastCalledWith()
            // expect(historyMock.push.mock.calls.length).toEqual(0)
            // expect(historyMock.push.mock.calls[0]).toEqual(undefined)
        })

        it("should mark as [invalid] product's [description] after change", async () => {
            await wrapper.find('textarea[id="description"]').simulate('change', sampleEvents.description.emptyDescription)
            expect(wrapper.find('textarea[id="description"]').prop('value')).toEqual(sampleEvents.description.emptyDescription.target.value)
            wrapper.update()
            expect(wrapper.find('textarea[id="description"]').hasClass('error')).toEqual(true)

            await wrapper.find('textarea[id="description"]').simulate('change', sampleEvents.description.tooShortDescription)
            expect(wrapper.find('textarea[id="description"]').prop('value')).toEqual(sampleEvents.description.tooShortDescription.target.value)
            wrapper.update()
            expect(wrapper.find('textarea[id="description"]').hasClass('error')).toEqual(true)

            await wrapper.find('textarea[id="description"]').simulate('change', sampleEvents.description.tooLongDescription)
            expect(wrapper.find('textarea[id="description"]').prop('value')).toEqual(sampleEvents.description.tooLongDescription.target.value)
            wrapper.update()
            expect(wrapper.find('textarea[id="description"]').hasClass('error')).toEqual(true)

            await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push.mock.calls.length).toEqual(0)
        })

        it("should mark as [invalid] product's [image] after change", async () => {
            await wrapper.find('input[id="image"]').simulate('change', sampleEvents.image.invalidImage)
            wrapper.update()
            expect(wrapper.find('input[id="image"]').hasClass('error')).toEqual(true)
        })

        it("should mark as [invalid] product's [price] after change", async () => {
            await wrapper.find('input[id="price"]').simulate('change', sampleEvents.price.emptyPrice)
            expect(wrapper.find('input[id="price"]').prop('value')).toEqual(sampleEvents.price.emptyPrice.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="price"]').hasClass('error')).toEqual(true)

            await wrapper.find('input[id="price"]').simulate('change', sampleEvents.price.belowZeroPrice)
            expect(wrapper.find('input[id="price"]').prop('value')).toEqual(sampleEvents.price.belowZeroPrice.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="price"]').hasClass('error')).toEqual(true)

            await wrapper.find('input[id="price"]').simulate('change', sampleEvents.price.zeroPrice)
            expect(wrapper.find('input[id="price"]').prop('value')).toEqual(sampleEvents.price.zeroPrice.target.value)
            wrapper.update()
            expect(wrapper.find('input[id="price"]').hasClass('error')).toEqual(true)

            await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push).not.toBeCalled()
        })

        it("should mark as [invalid] all of the product's fields after change", async () => {
            await wrapper.find('input[id="title"]').simulate('change', sampleEvents.title.tooShortTitle)
            await wrapper.find('textarea[id="description"]').simulate('change', sampleEvents.description.tooShortDescription)
            await wrapper.find('input[id="image"]').simulate('change', sampleEvents.image.invalidImage)
            await wrapper.find('input[id="price"]').simulate('change', sampleEvents.price.belowZeroPrice)

            expect(wrapper.find('input[id="title"]').prop('value')).toEqual(sampleEvents.title.tooShortTitle.target.value)
            expect(wrapper.find('textarea[id="description"]').prop('value')).toEqual(sampleEvents.description.tooShortDescription.target.value)
            expect(wrapper.find('input[id="price"]').prop('value')).toEqual(sampleEvents.price.belowZeroPrice.target.value)

            wrapper.update()

            expect(wrapper.find('input[id="title"]').hasClass('error')).toEqual(true)
            expect(wrapper.find('textarea[id="description"]').hasClass('error')).toEqual(true)
            expect(wrapper.find('input[id="image"]').hasClass('error')).toEqual(true)
            expect(wrapper.find('input[id="price"]').hasClass('error')).toEqual(true)

            await wrapper.find('form').simulate('submit', sampleEvents.onFormSubmit)
            expect(historyMock.push.mock.calls.length).toEqual(0)
        })
    })
})