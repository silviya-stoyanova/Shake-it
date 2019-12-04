import React from 'react'
import { mount } from 'enzyme'
import ThanksForOrder from '../../components/order/thank-you'

describe('test for the component ThanksForOrder', () => {

    it('should render an image and text when an order is made', () => {
        const wrapper = mount(<ThanksForOrder />)

        expect(wrapper.find('div.thank-you-img').length).toEqual(1)

        expect(wrapper.find('div.first-line').length).toEqual(1)
        expect(wrapper.find('div.first-line').text()).toEqual('Thank you for your order!')

        expect(wrapper.find('div.first-line').length).toEqual(1)
        expect(wrapper.find('div.second-line').text()).toMatch(/^(order number is)(.)+/i)

        expect(wrapper.find('div.third-line').length).toEqual(1)
        expect(wrapper.find('div.third-line').text()).toEqual('Our call operators will make a contact with you to confirm your purchase.')
    })
})