import React from 'react'
import { mount } from 'enzyme'
import ContactForm from '../../components/static-pages/contacts'

describe('tests for the component ContactForm', () => {

    it('should have a div element with className about-us', () => {
        const wrapper = mount(<ContactForm />)
        expect(wrapper.find('div[className="about-us"]').length).toEqual(1)
    })

    it('should have a div element with className "form-type" and text "Contact form"', () => {
        const wrapper = mount(<ContactForm />)
        expect(wrapper.find('div[className="form-type"]').length).toEqual(1)
        expect(wrapper.find('div[className="form-type"]').text()).toEqual('Contact form')
    })

    it('should have one form', () => {
        const wrapper = mount(<ContactForm />)
        expect(wrapper.find('form').length).toEqual(1)
    })


    it('should have an iframe element', () => {
        const wrapper = mount(<ContactForm />)
        expect(wrapper.find('iframe').length).toEqual(1)
    })

    it('should have a map wrapped inside iframe element', () => {
        const wrapper = mount(<ContactForm />)
        expect(wrapper.find('iframe').prop('src')).toEqual('https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5842.18144046166!2d26.508194563092392!3d42.48606336154913!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a634309f91e3c9%3A0x51b0a9e04be4122f!2z0J7QsdGJ0LjQvdCwINCv0LzQsdC-0Ls!5e0!3m2!1sbg!2sbg!4v1573846071952!5m2!1sbg!2sbg')
    })
})