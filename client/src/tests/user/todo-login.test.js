import React from 'react'
import { mount } from 'enzyme'
import withProcessForm from '../../components/hocs/withProcessForm'
import UserLogin from '../../components/user/login'
import { userValidations } from '../../components/hocs/validations'
import promiseExtraMethods from '../../components/hocs/promiseExtraMethods'

// to test the document's title also

//! todo
describe('tests for Login component', () => {
    it('should login the user when valid data is passed', () => {
        const initialData = {
            username: '',
            password: '',

            userClass: '',
            passClass: '',
        }

        const extraMethods = {
            success: promiseExtraMethods.user().onLoginSuccess,
            fail: promiseExtraMethods.user().onLoginFail
        }

        // const wrapper = mount(
        //     withProcessForm(<UserLogin />, 'login', userValidations, initialData, 'login', extraMethods)
        // )

        // wrapper.find('button.button').simulate('click')
        // expect()

    })










})
