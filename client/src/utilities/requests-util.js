const baseUrl = 'http://localhost:5000'

const getHeaders = (authtoken = null, contentType = 'application/json') => {
    const headers = {
        'Access-Control-Request-Origin': 'http://localhost:3000',
        'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }

    if (authtoken) {
        headers['Authorization'] = authtoken
    }
    if (contentType) {
        headers['Content-Type'] = contentType
    }
    return headers
}

const makeRequest = (method, body, credentials, authtoken, contentType) => {
    const request = {
        headers: getHeaders(authtoken, contentType),
        method,
        body,
        credentials: credentials ? 'include' : 'omit'
    }
    return request
}

const requester = {
    // fetch('https://your_url/account', {
    //   credentials: 'include'
    // })

    //? to make a logout call to the server??

    login: (data) => {
        const { username, password } = data
        return fetch(baseUrl + '/user/login',
            makeRequest('POST', JSON.stringify({ username, password })))
    },

    register: (data) => {
        const { username, password } = data
        return fetch(baseUrl + '/user/register',
            makeRequest('POST', JSON.stringify({ username, password })))
    },

    getProfileInfo: (jwtToken) => {
        return fetch(baseUrl + '/user/profile',
            makeRequest('GET', null, true, jwtToken))
    },

    updateProfileInfo: (profilePic, firstName, lastName, phoneNumber, email, country, city, postcode, adress, jwtToken) => {
        const form = new FormData()

        form.append('profilePic', profilePic[0])
        form.append('firstName', firstName)
        form.append('lastName', lastName)
        form.append('email', email)
        form.append('country', country)
        form.append('city', city)
        form.append('postcode', postcode)
        form.append('adress', adress)
        form.append('phoneNumber', phoneNumber)

        return fetch(baseUrl + '/user/profile',
            makeRequest('POST', form, true, jwtToken, null))
    },

    getProductInfo: (productId) => {
        return fetch(baseUrl + '/product/details/' + productId,
            makeRequest('GET', null, false))
    },

    getAllProducts: () => {
        return fetch(baseUrl,
            makeRequest('GET', null, false)
        )
    },

    createProduct: (data, jwtToken) => {
        const { title, description, image, price } = data
        let form = new FormData()
        form.append('title', title)
        form.append('description', description)
        form.append('image', image[0])
        form.append('price', price)

        // to view the form data
        // for (let data of form.entries()) {
        //     console.log(data)
        // }

        return fetch(baseUrl + '/product/create',
            // 'Content-Type': 'multipart/form-data', ===> leave it unset, the browser will take care of it
            // otherwise returns a CORS error
            makeRequest('POST', form, true, jwtToken, null))
    },

    editProduct: (data, jwtToken) => {
        const { title, description, image, price } = data
        const productId = data._id
        let form = new FormData()
        form.append('title', title)
        form.append('description', description)
        form.append('image', image[0])
        form.append('price', price)

        return fetch(baseUrl + '/product/edit/' + productId,
            makeRequest('POST', form, true, jwtToken, null))
    },

    deleteProduct: (data, jwtToken) => {
        const productId = data._id
        return fetch(baseUrl + '/product/delete/' + productId,
            makeRequest('POST', null, true, jwtToken))
    },

    likeProduct: (productId, jwtToken) => {
        return fetch(baseUrl + '/product/like/' + productId,
            makeRequest('POST', null, false, jwtToken))
    },

    getCart: (jwtToken) => {
        return fetch(baseUrl + '/cart',
            makeRequest('GET', null, false, jwtToken))
    },

    addToCart: (productId, jwtToken) => {
        return fetch(baseUrl + '/cart/add/' + productId,
            makeRequest('POST', null, false, jwtToken))
    },

    removeFromCart: (productInfoId, jwtToken) => {
        return fetch(baseUrl + '/cart/remove/' + productInfoId,
            makeRequest('POST', null, false, jwtToken))
    },

    emptyCart: (jwtToken) => {
        return fetch(baseUrl + '/cart/remove/all',
            makeRequest('POST', null, false, jwtToken))
    },

    updateQty: (productInfoId, actionType, jwtToken) => {
        return fetch(baseUrl + '/cart/update-qty/' + productInfoId,
            makeRequest('POST', JSON.stringify({ actionType }), false, jwtToken))
    }
}

export default requester