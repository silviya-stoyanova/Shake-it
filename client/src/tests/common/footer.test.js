import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { mount } from 'enzyme'
import Footer from '../../components/common/footer'

describe('tests for the component Footer', () => {
    it('should render properly', () => {
        const wrapper = mount(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        )
        expect(wrapper.html()).toMatchSnapshot()
    })

    it('should have a div element with className "left-al"', () => {
        const wrapper = mount(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        )
        expect(wrapper.find("div[className='left-al']").length).toEqual(1)
    })

    it('should have a div element with className "right-al"', () => {
        const wrapper = mount(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        )
        expect(wrapper.find("div[className='right-al']").length).toEqual(1)
    })

    it('should have 4 span elements with proper text', () => {
        const spanElsText = ['Terms', 'Data use policy', 'Make contact with us', 'Shake it, Bulgaria']

        const wrapper = mount(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        )

        wrapper.find('span').map((span, index) => {
            expect(span.text()).toMatch(new RegExp(`${spanElsText[index]}`, 'i'))
        })
    })
})