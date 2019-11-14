const passport = require('passport')
const LocalPassport = require('passport-local')
const User = require('./../models/User')

// const passportJWT = require('passport-jwt')
// const jwtStrategy = passportJWT.Strategy
// const extractJWT = passportJWT.ExtractJwt

const authenticateUser = (username, password, done) => {
    User.findOne({ username }).then(user => {
        if (!user) {
            return done(null, false)
        }

        if (!user.authenticate(password)) {
            return done(null, false)
        }

        console.log('authenticateUser')
        return done(null, user)
    })
}

module.exports = () => {
    passport.use(new LocalPassport({
        usernameField: 'username',
        passwordField: 'password'
    }, authenticateUser))

    passport.serializeUser((user, done) => {
        if (!user) {
            return done(null, false)
        }

        return done(null, user._id)
        // return done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id).then((user) => {
            if (!user) {
                return done(null, false)
            }

            return done(null, user)
        })
    })
}


