import React from 'react'
import { mount } from 'enzyme'
import Terms from '../../components/static-pages/terms'

describe('tests for the component Terms', () => {
    it('should match the snapshot', () => {
        const wrapper = mount(<Terms />)
        expect(wrapper.debug()).toMatchSnapshot()
    })
})
