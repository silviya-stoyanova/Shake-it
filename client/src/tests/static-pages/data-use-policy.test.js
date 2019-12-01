import React from 'react'
import { mount } from 'enzyme'
import DataUsePolicy from '../../components/static-pages/data-use-policy'

describe('tests for the component DataUsePolicy', () => {

    it('should render correctly', () => {
        const wrapper = mount(<DataUsePolicy />)
        expect(wrapper.html()).toMatchSnapshot()
    })

    it('should have an h1 element with text "Data Usage Policy"', () => {
        const wrapper = mount(<DataUsePolicy />)
        expect(wrapper.find('h1').text()).toEqual("Data Usage Policy")
    })
})