const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt-config')
const tokenIsValid = (token) => token.exp < Date.now()

const getUserInfo = (req, res) => {
    if (!req.headers.authorization) {
        return false
    }

    const jwtToken = jwt.verify(req.headers.authorization, jwtConfig.secret)
    const user = jwtToken.user

    if (!tokenIsValid(jwtToken)) {
        return res.status(400).send({ message: 'This auth token have expired!' })
    }

    // save the user info in the session to be able to reach it later
    req.session.user = user
    req.session.save((err) => {
        if (err) {
            console.log('error in auth.js', err)
        }
    })

    return user
}

module.exports = {
    isAuthed: (req, res, next) => {
        const user = getUserInfo(req, res)

        if (user) {
            next()

        } else {
            return res.status(400).send({ message: 'You are not authorized to perform this action!' })
        }
    },
    hasRole: (role) => {
        return (req, res, next) => {
            const user = getUserInfo(req, res)

            if (user && user.roles && user.roles.indexOf(role) > -1) {
                next()
            } else {
                return res.status(400).send({ message: 'You are unauthorized!' })
            }
        }
    },
    isNotLogged: (req, res, next) => {
        const user = getUserInfo(req, res)

        if (!user) {
            next()

        } else {
            return res.status(400).send({ message: 'You are alredy logged in! Please logout and try again.' })
        }

    }
}