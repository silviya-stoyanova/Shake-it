import React from 'react'
import { mount } from 'enzyme'
import { CreateProduct } from '../../components/product/create-product'
import withProcessForm from '../../components/hocs/withProcessForm'

// scenarios:

// when a guest access CreateProduct page they should be redirected to the home page

// when a user access CreateProduct page they should be redirected to the home page

// when The Admin access CreateProduct page they should be able to add a product

// -- submit button is not clicked yet
//    -- valid info is passed to 4 of the fields
//      -- invalid info is passed for [title] / [description] / [image] / [price]
//      -- invalid info is passed for [title, description, image and price]

// -- submit button is clicked
//       -- valid info is passed to 4 of the fields                                 *   sampleEvents.onFormSubmit should BE Called !!   *
//       -- invalid info is passed for [title] / [description] / [image] / [price]  * sampleEvents.onFormSubmit should NOT be Called !! *
//       -- invalid info is passed for [title, description, image and price]

describe('tests for the component CreateProduct', () => {

    describe('tests for guest functionalities', () => {

        const wrapper = mount(
            
        )
    })
    
    describe('tests for user functionalities', () => {

    })
    
    describe('tests for admin functionalities', () => {

    })
})