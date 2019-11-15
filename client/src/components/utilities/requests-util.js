const baseUrl = 'http://localhost:5000'

const requester = {
    // fetch('https://your_url/account', {
    //   credentials: 'include'
    // })

    //? to make a logout call to the server??

    login: (username, password) => {
        return fetch(baseUrl + '/user/login', {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Origin': 'http://localhost:3000',
                'Access-Control-Request-Headers': "Origin, X-Requested-With, Content-Type, Accept",
            },
            method: 'POST',
            body: JSON.stringify({ username, password })
        })
    },

    register: (username, password) => {
        return fetch(baseUrl + '/user/register', {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Origin': 'http://localhost:3000',
                'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            },
            method: 'POST',
            body: JSON.stringify({ username, password })
        })
    },

    getProfileInfo: (jwtToken) => {
        return fetch(baseUrl + '/user/profile', {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Origin': 'http://localhost:3000',
                'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                'Authorization': jwtToken
            },
            credentials: "include"
        })
    },

    updateProfileInfo: (profilePic, firstName, lastName, email, adress, phoneNumber, jwtToken) => {
        const form = new FormData()
        form.append('profilePic', profilePic[0])
        form.append('firstName', firstName)
        form.append('lastName', lastName)
        form.append('email', email)
        form.append('adress', adress)
        form.append('phoneNumber', phoneNumber)

        return fetch(baseUrl + '/user/profile', {
            headers: {
                // 'Content-Type': 'application/json',
                'Access-Control-Request-Origin': 'http://localhost:3000',
                'Access-Control-Request-Headers': 'Origin, X-Requested-With, Accept',
                'Authorization': jwtToken
            },
            credentials: 'include',
            method: 'POST',
            body: form
        })
    },

    getProductInfo: (productId) => {
        return fetch(baseUrl + '/product/details/' + productId, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Origin': 'http://localhost:3000',
                'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            }
        })
    },

    getAllProducts: () => {
        return fetch(baseUrl, {
            headers: {
                'Access-Control-Request-Origin': 'http://localhost:3000',
                'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
            }
        })
    },

    createProduct: (title, description, image, price, jwtToken) => {
        let form = new FormData()
        form.append('title', title)
        form.append('description', description)
        form.append('image', image[0])
        form.append('price', price)

        // for (let data of form.entries()) {
        //     console.log(data)
        // }

        return fetch(baseUrl + '/product/create', {
            headers: {
                // 'Content-Type': 'multipart/form-data',
                // 'Content-Type': 'application/x-www-form-urlencoded',
                'Access-Control-Request-Origin': 'http://localhost:3000',
                'Access-Control-Request-Headers': 'Origin, X-Requested-With, Accept',
                'Authorization': jwtToken
            },
            credentials: 'include',
            method: 'POST',
            body: form
            // body: JSON.stringify({ title, description, imageUrl, price })
        })
    },

    editProduct: (productId, title, description, image, price, jwtToken) => {
        let form = new FormData()
        form.append('title', title)
        form.append('description', description)
        form.append('image', image[0])
        form.append('price', price)

        return fetch(baseUrl + '/product/edit/' + productId, {
            headers: {
                // 'Content-Type': 'application/json',
                'Access-Control-Request-Origin': 'http://localhost:3000',
                'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                'Authorization': jwtToken
            },
            credentials: 'include',
            method: 'POST',
            body: form
        })
    },

    deleteProduct: (productId, jwtToken) => {
        return fetch(baseUrl + '/product/delete/' + productId, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Origin': 'http://localhost:3000',
                'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                'Authorization': jwtToken
            },
            method: 'POST',
            credentials: "include"
            // try without the credentials...
        })
    },

    likeProduct: (productId, jwtToken) => {
        return fetch(baseUrl + '/product/like/' + productId, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Origin': 'http://localhost:3000',
                'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                'Authorization': jwtToken
            },
            method: 'POST'
        })
    },

    addToCart: (productId, jwtToken) => {
        return fetch(baseUrl + '/cart/add/' + productId, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Origin': 'http://localhost:3000',
                'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                'Authorization': jwtToken
            },
            method: 'POST'
        })
    },

    getCart: (jwtToken) => {
        return fetch(baseUrl + '/cart', {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Request-Origin': 'http://localhost:3000',
                'Access-Control-Request-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
                'Authorization': jwtToken
            },
        })
    },


}

export default requester