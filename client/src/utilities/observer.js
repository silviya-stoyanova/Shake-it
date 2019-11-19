const methods = {
    userLogin: [],
    userLogout: []
}

const observer = {
    subscribe: (type, func) => {
        methods[type].push(func)
    },

    trigger: (type) => {
        methods[type].map(async fc => await fc())
    }
}

export default observer