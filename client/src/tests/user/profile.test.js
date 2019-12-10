import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import AuthRoute from '../../components/routes/auth-route'
import { UserInfoProvider } from '../../App'
import UserProfile from '../../components/user/profile'

// what if submit button is pressed before the data is fetched? ==> all the user info is cleared


// scenarious:

//// guest tries to reach the UserProfile page           ==> should be redirected
//// logged in user tries to reach the UserProfile page  ==> should be able to view UserProfile page
//// logged in admin tries to reach the UserProfile page ==> should be able to view UserProfile page


// should render empty form until user's data is fetched and <img src="loading-circle.gif" />

// [[sampleEvents.onFormSubmit]] should be called in all of the cases listed below:

// -- submit button is not clicked yet and..  /or/  -- submit button is clicked
//
//    -- info is passed to all fields
//    -- info is passed for [profilePic] / [firstName] / [lastName] / [*email*] / [adress]
//                          [phoneNumber] /[country] / [city] / [postcode] / [purchasedProducts] / [uploadedImg]

const mockUploadedImg = () => {
    const fileBits = ['shaky-maky']
    const filename = 'shakyto.jpg'
    const options = { type: 'image/jpg' }
    return new File(fileBits, filename, options)
}

const mockGetProfileInfo = () => {
    const sampleReturnedData = JSON.stringify({
        username: 'YesBe',
        profilePic: 'banana-shake.jpeg',
        firstName: 'My name',
        lastName: 'Cowboy',
        email: 'shake-it@gmail.com',
        country: 'BG',
        city: 'Yambol',
        postcode: '8600',
        adress: 'Yambol city, baby',
        phoneNumber: '123',
        purchasedProducts: '2'
    })

    return Promise.resolve(new Response(sampleReturnedData))
}

const sampleEvents = {
    profilePic: {
        target: 'profilePic', files: [mockUploadedImg()]
    },
    firstName: {
        target: 'firstName', value: 'I am the'
    },
    lastName: {
        target: 'lastName', value: 'Coolest Banana'
    },
    phoneNumber: {
        target: 'phoneNumber', value: '+333 000 000 000'
    },
    email: {
        target: 'email', value: 'info@shake-it.com'
    },
    country: {
        target: 'country', value: 'Bulgaria'
    },
    city: {
        target: 'city', value: 'Yambol'
    },
    postcode: {
        target: 'postcode', value: '8600'
    },
    adress: {
        target: 'adress', value: 'Yambol city LTD'
    },
    uploadedImg: {
        target: 'uploadedImg', value: '*TODOOOO**********************************'
    },
    onFormSubmit: {
        preventDefault() {
            return 'I am fake prevent-defaulter.'
        }
    }
}

describe('tests for the component UserProfile', () => {
    let wrapper

    beforeEach(() => {
        wrapper = mount(<UserProfile service={mockGetProfileInfo} />)
    })

    describe('guest functionalities', () => {

        it('should redirect [guest] to the home page when they accesses UserProfile page', () => {
            const defaultUserValue = { isLogged: false, username: '', role: '' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/user/profile" component={UserProfile} role="User" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.find('Redirect[to="/"]').length).toEqual(1)
        })
    })

    describe('user functionalities', () => {

        it('should let [users] view the UserProfile page', () => {
            const defaultUserValue = { isLogged: true, username: 'strawberry-me', role: 'User' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/user/profile" component={UserProfile} role="User" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.find('Route[path="/user/profile"]').length).toEqual(1)
        })

        it("should render an empty form with disabled button and a loading-circle.gif until user's data is fetched", () => {
            expect(wrapper.find('input[id="firstName"]').prop('value')).toEqual(undefined)
            expect(wrapper.find('input[id="lastName"]').prop('value')).toEqual(undefined)
            expect(wrapper.find('input[id="phoneNumber"]').prop('value')).toEqual(undefined)
            expect(wrapper.find('input[id="email"]').prop('value')).toEqual(undefined)
            expect(wrapper.find('input[id="country"]').prop('value')).toEqual(undefined)
            expect(wrapper.find('input[id="city"]').prop('value')).toEqual(undefined)
            expect(wrapper.find('input[id="postcode"]').prop('value')).toEqual(undefined)
            expect(wrapper.find('input[id="adress"]').prop('value')).toEqual(undefined)

            expect(wrapper.find('img.profile-img').prop('src')).toEqual('loading-circle.gif')

            expect(wrapper.find('button.edit-profile-btn').prop('disabled')).toEqual(true)

            mockGetProfileInfo()
        })

        it("should render user's profile with fetched data and enabled submit button", () => {
            mockGetProfileInfo()
                .then(res => res.json())
                .then(async res => {
                    await wrapper.setState({
                        username: res.username,
                        profilePic: res.profilePic,
                        firstName: res.firstName,
                        lastName: res.lastName,
                        email: res.email,
                        country: res.country,
                        city: res.city,
                        postcode: res.postcode,
                        adress: res.adress,
                        phoneNumber: res.phoneNumber,
                        purchasedProducts: res.purchasedProducts
                    })
                    wrapper.update()

                    expect(wrapper.debug()).toMatchSnapshot()

                    expect(wrapper.find('span.user-info-username').text()).toEqual(`Username: ${res.username}`)
                    expect(wrapper.find('input[id="firstName"]').prop('defaultValue')).toEqual(res.firstName)
                    expect(wrapper.find('input[id="lastName"]').prop('defaultValue')).toEqual(res.lastName)
                    expect(wrapper.find('input[id="phoneNumber"]').prop('defaultValue')).toEqual(res.phoneNumber)
                    expect(wrapper.find('input[id="email"]').prop('defaultValue')).toEqual(res.email)
                    expect(wrapper.find('input[id="country"]').prop('defaultValue')).toEqual(res.country)
                    expect(wrapper.find('input[id="city"]').prop('defaultValue')).toEqual(res.city)
                    expect(wrapper.find('input[id="postcode"]').prop('defaultValue')).toEqual(res.postcode)
                    expect(wrapper.find('input[id="adress"]').prop('defaultValue')).toEqual(res.adress)

                    expect(wrapper.find('img.profile-img').prop('src')).toEqual(`data:image/png;base64, ${res.profilePic}`)

                    expect(wrapper.find('button.edit-profile-btn').prop('disabled')).toEqual(false)

                })
        })






    })

    describe('admin functionalities', () => {
        it('should let The [Admin] view the UserProfile page', () => {
            const defaultUserValue = { isLogged: true, username: 'awesome-adminny', role: 'Admin' }

            const wrapper = mount(
                <BrowserRouter>
                    <UserInfoProvider value={defaultUserValue}>
                        <AuthRoute path="/user/profile" component={UserProfile} role="User" />
                    </UserInfoProvider>
                </BrowserRouter>
            )

            expect(wrapper.find('Route[path="/user/profile"]').length).toEqual(1)
        })
    })
})