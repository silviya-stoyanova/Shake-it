// get, save, remove the authtoken (JWT)

const sessionManager = {
    saveSession: (authtoken, username, role) => {
        sessionStorage.setItem('authtoken', authtoken)
        sessionStorage.setItem('username', username)
        sessionStorage.setItem('role', role)
    },

    isUserLogged: () => {
        return sessionStorage.getItem('authtoken') !== null
        // should this be !== undefined ?
    },

    getUserInfo: () => {
        const userInfo = {
            username: sessionStorage.getItem('username'),
            authtoken: sessionStorage.getItem('authtoken'),
            role: sessionStorage.getItem('role'),
        }
        return userInfo
    },

    getUsername: () => {
        return sessionStorage.getItem('username')
    },

    getAuthtoken: () => {
        return sessionStorage.getItem('authtoken')
    },

    getUserRole: () => {
        let role = sessionStorage.getItem('role')
        return role
    },

    clearSession: () => {
        sessionStorage.clear()
    }
}

export default sessionManager