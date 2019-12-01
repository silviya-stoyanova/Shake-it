import React from 'react'
import { mount } from 'enzyme'
import NotFound from '../../components/static-pages/not-found'

describe('tests for the component NotFound', () => {
    it('should render correctly', () => {
        const wrapper = mount(<NotFound />)
        expect(wrapper.html()).toMatchSnapshot()
    })

    it('should have a div element with className "not-found-wrapper"', () => {
        const wrapper = mount(<NotFound />)
        expect(wrapper.find('div[className="not-found-wrapper"]').length).toEqual(1)
    })

    it('should have a div element with className "not-found-img"', () => {
        const wrapper = mount(<NotFound />)
        expect(wrapper.find('div[className="not-found-img"]').length).toEqual(1)
    })

    it('should consist of exactly 2 div elements', () => {
        const wrapper = mount(<NotFound />)
        expect(wrapper.find('div').length).toEqual(2)
    })

    it('should consist of exactly 3 span elements', () => {
        const wrapper = mount(<NotFound />)
        expect(wrapper.find('span').length).toEqual(3)
    })

    it('should have one span element with classNames "four-digit" and "left-al" and text "4"', () => {
        const wrapper = mount(<NotFound />)
        expect(wrapper.find('span[className="four-digit left-al"]').text()).toEqual('4')
    })

    it('should have one span element with classNames "four-digit" and "right-al" and text "4"', () => {
        const wrapper = mount(<NotFound />)
        expect(wrapper.find('span[className="four-digit right-al"]').text()).toEqual('4')
    })
})