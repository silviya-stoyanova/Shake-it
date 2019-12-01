import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import AboutUs from '../../components/static-pages/about-us'

describe('tests for the component About Us', () => {
    it('should have one element of type h2', () => {
        const wrapper = mount(
            <BrowserRouter>
                <AboutUs />
            </BrowserRouter>
        )
        expect(wrapper.find('h2').length).toEqual(1)
    })

    it('should have exactly 7 paragraphs', () => {
        const wrapper = mount(
            <BrowserRouter>
                <AboutUs />
            </BrowserRouter>)
        expect(wrapper.find('p').length).toEqual(7)
    })
})