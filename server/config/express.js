const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')

module.exports = (app, config) => {
    // Set up the parser for the request's data.
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
        extended: true
    }))

    // Session is storage for cookies, which will be de/encrypted with that 'secret' key.
    app.use(session({
        secret: 's3cr3t5tr1ng',
        resave: false,
        saveUninitialized: false
    }))

    // For user validation we will use passport module.
    app.use(passport.initialize())
    app.use(passport.session())

    app.use((req, res, next) => {
        if (req.user) {
            res.locals.user = req.user

            if (res.locals.user.isInRole('Admin')) {
                res.locals.isAdmin = res.locals.user.isInRole('Admin')
            }
        }

        next()
    })

    // middleware that allows access of this domain (http://lohalhost:3000)
    // and restricts all the others due to CORS
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "http://localhost:3000") // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Access-Control-Request-Origin, Authorization, Origin, X-Requested-With, Content-Type, Accept")
        res.header("Access-Control-Allow-Credentials", true)
        next()
    })
}