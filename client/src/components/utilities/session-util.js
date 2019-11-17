// get, save, remove the authtoken (JWT)

const sessionManager = {
    saveSession: (authtoken, username, role) => {
        sessionStorage.setItem('authtoken', authtoken)
        sessionStorage.setItem('username', username)
        sessionStorage.setItem('role', role)
    },

    clearSession: () => {
        sessionStorage.clear()
    },

    isUserLogged: () => {
        return sessionStorage.getItem('authtoken') !== null
        // should this be !== undefined ?
    },

    getUserInfo: () => {
        return {
            username: sessionStorage.getItem('username'),
            authtoken: sessionStorage.getItem('authtoken'),
            role: sessionStorage.getItem('role'),
        }
    },

    // getUsername: () => {
    // return sessionStorage.getItem('username')
    // },
    // 
    // getAuthtoken: () => {
    // return sessionStorage.getItem('authtoken')
    // },
    // 
    // getUserRole: () => {
    // let role = sessionStorage.getItem('role')
    // return role
    // },

}

export default sessionManager