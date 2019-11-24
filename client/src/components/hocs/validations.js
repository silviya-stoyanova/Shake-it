import { toast } from 'react-toastify'

const userValidations = {
    validateData(formType, username, password, repeatPassword, updateState) {
        let [userClass, passClass, repeatPassClass] = ['error', 'error', 'error']
        let result = {
            username: 'invalid',
            password: 'invalid',
            repeatPassword: 'invalid'
        }

        if (username && username.trim().length >= 5) {
            userClass = 'correct'
            result.username = 'valid'
        }
        if (password && password.length >= 8) {
            passClass = 'correct'
            result.password = 'valid'
        }

        if (repeatPassword) {
            if (repeatPassword && repeatPassword.length >= 8) {
                repeatPassClass = 'correct'
                result.repeatPassword = 'valid'
            }

            if (password !== repeatPassword) {
                [passClass, repeatPassClass] = ['error', 'error']
                result.password = 'invalid'
                result.repeatPassword = 'invalid'
            }
        }

        updateState && this.setState(prevState => ({
            userInfo: {
                ...prevState.userInfo,
                userClass,
                passClass,
                repeatPassClass
            }
        }))

        return result
    },

    validateOnSubmit(formType, username, password, repeatPassword) {
        debugger
        const isInputValid = this.validateData(formType, username, password, repeatPassword, false)
        let isValid = false
        let errorMsg = ''

        if (formType === 'login') {
            if (isInputValid.username === 'invalid' || isInputValid.password === 'invalid') {
                errorMsg = 'Either your username or password is invalid.'
            }
        } else if (formType === 'register') {
            if (isInputValid.password === 'invalid' || isInputValid.repeatPassword === 'invalid') {
                errorMsg = 'Both passwords must consist of at least 8 characters and they both must match!'
            }
            if (isInputValid.username === 'invalid') {
                errorMsg = 'Please enter a valid username!'
            }
        }
        if (errorMsg) {
            toast.info(errorMsg, {
                className: 'error-toast'
            })
            return isValid
        }

        isValid = true
        return isValid
    }
}

const productValidations = {
    validateData(formType, title, description, image, price, updateState) {
        let [titleClass, descriptionClass, priceClass] = ['error', 'error', 'error', 'error']
        let result = {
            title: 'invalid',
            description: 'invalid',
            image: 'invalid',
            price: 'invalid',
        }

        if (title && title.length > 2 && title.length <= 50) {
            titleClass = 'correct'
            result.title = 'valid'
        }
        if (description && description.length > 9 && description.length <= 250) {
            descriptionClass = 'correct'
            result.description = 'valid'
        }

        // validate only when creating a new product
        if (formType === 'create' && image) {
            result.image = 'valid'
        }
        if (price && Number(price) > 0) {
            priceClass = 'correct'
            result.price = 'valid'
        }

        updateState && this.setState(prevState => ({
            productInfo: {
                ...prevState.productInfo,
                titleClass,
                descriptionClass,
                priceClass
            }
        }))
        return result
    },

    validateOnSubmit(formType, title, description, image, price) {
        const updateState = false
        const isInputValid = this.validateData(formType, title, description, image, price, updateState)
        let isValid = false
        let errorMsg = ''

        if (isInputValid.price === 'invalid') {
            errorMsg = 'Please enter a valid price.'
        }
        // when adding a product
        if (formType === 'create' && isInputValid.image === 'invalid') {
            errorMsg = 'Please provide an image.'
        }
        if (isInputValid.description === 'invalid') {
            errorMsg = 'The description must be at least 10 symbols long.'
        }
        if (isInputValid.title === 'invalid') {
            errorMsg = 'The title length must be between 3 and 50 symbols including.'
        }
        if (errorMsg) {
            toast.info(errorMsg, {
                className: 'error-toast',
            })
            return isValid
        }

        isValid = true
        return isValid
    }
}

export { userValidations }
export { productValidations }