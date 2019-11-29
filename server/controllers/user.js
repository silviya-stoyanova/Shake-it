const jwt = require('jsonwebtoken')
const jwtConfig = require('../config/jwt-config')
const encryption = require('../utilities/encryption')
const multiparty = require('multiparty')
const path = require('path')
const fs = require('fs')
const mv = require('mv')
const User = require('../models/User')
const Cart = require('../models/Cart')
const uploadFilesPath = path.join(__dirname, '../upload/profile-pics/')

module.exports = {
    register: (req, res) => {
        let registerArgs = req.body

        User.findOne({
            username: registerArgs.username
        }).then(async user => {
            let errorMsg = ''
            if (user) {
                errorMsg = 'User with the same username exists!'
                return res.status(400).send({ message: errorMsg })
            }

            if (!registerArgs.username || registerArgs.username.length < 5) {
                errorMsg = 'The username field must consist at least of 5 characters!'
                return res.status(400).send({ message: errorMsg })
            }
            if (!registerArgs.password || registerArgs.password.length < 5) {
                errorMsg = 'The password field must consist at least of 8 characters!'
                return res.status(400).send({ message: errorMsg })
            }

            const salt = encryption.generateSalt()
            const passwordHash = encryption.hashPassword(registerArgs.password, salt)
            const cart = await Cart.create({})

            let userObject = {
                username: registerArgs.username,

                profilePic: 'default.png',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
                country: '',
                city: '',
                postcode: '',
                adress: '',
                purchasedProducts: '',
                myCart: cart._id,

                roles: ['User'],
                passwordHash,
                salt
            }

            User.create(userObject).then((user, err) => {
                if (err) {
                    return res.status(400).send({ message: err.message })
                }
                res.send({ success: 'Successful registration! 🍹' })

                // req.logIn(user, (err) => {
                //     if (err) {
                //         registerArgs.error = err.message
                //         return registerArgs
                //     }
                // })
            })

        })
    },

    login: (req, res) => {
        let loginArgs = req.body

        User.findOne({
            username: loginArgs.username
        }).then(user => {
            if (!user || !user.authenticate(loginArgs.password)) {
                let errorMsg = 'Either username or password is invalid!'
                return res.status(400).send({ message: errorMsg })
            }

            req.login(user, (err) => {
                if (err) {
                    return res.status(400).send({ message: err.message })
                }

                // let returnUrl = '/'
                // if (req.session.returnUrl) {
                //     returnUrl = req.session.returnUrl
                //     delete req.session.returnUrl
                // }

                const payload = { user }
                const authtoken = jwt.sign(payload, jwtConfig.secret, jwtConfig.options)
                res.send({ authtoken, username: user.username, role: user.roles[0], success: 'Wellcome! 🍹' })
            })
        })
    },

    logout: (req, res) => {
        try {
            req.logOut()
            return res.send({ success: 'Logged out! :)' })
        } catch (err) {
            return res.status(500).send({ message: 'Something went wrong when trying to log you out. Please try again later.' })
        }
    },

    getProfile: async (req, res) => {
        const userId = req.session.user._id

        let user = await User.findById(userId)
        if (!user) {
            return res.status(500).send({ message: 'This user does not exist!' })
        }

        user.profilePic = fs.readFileSync(uploadFilesPath + user.profilePic).toString('base64')
        return res.send(user)
    },

    updateProfile: (req, res) => {
        const userId = req.session.user._id
        let form = new multiparty.Form()

        form.parse(req, async (err, fields, files) => {
            const profilePic = files.profilePic ? files.profilePic[0] : ''
            const firstName = fields.firstName[0]
            const lastName = fields.lastName[0]
            const phoneNumber = fields.phoneNumber[0]
            const email = fields.email[0]
            const country = fields.country[0]
            const city = fields.city[0]
            const postcode = fields.postcode[0]
            const adress = fields.adress[0]

            if (err) {
                return res.status(500).send({ message: err.message })
            }

            const user = await User.findById(userId)
            if (!user) {
                return res.status(500).send({ message: user.message })
            }

            if (email) {
                if (!email.match(/(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/)) {
                    return res.status(500).send({ message: 'Please provide valid email!' })
                }
            }

            user.firstName = firstName
            user.lastName = lastName
            user.phoneNumber = phoneNumber
            user.email = email
            user.country = country
            user.city = city
            user.postcode = postcode
            user.adress = adress

            // if the users passed a new profilePic, update the old one
            if (profilePic) {
                const newFileName = profilePic.path.split('\\').reverse()[0]

                // move the new pic to the new directory
                mv(profilePic.path, uploadFilesPath + newFileName,
                    (err => {
                        if (err) {
                            return res.status(500).send({ message: err.message })
                        }
                    })
                )

                // unlink the previous one
                if (user.profilePic !== 'default.png') {
                    fs.unlink(uploadFilesPath + user.profilePic,
                        (err => {
                            if (err) {
                                return res.status(500).send({ message: err.message })
                            }
                        })
                    )
                }
                // update the user's profile picture name in the database
                user.profilePic = newFileName
            }

            await user.save()
            res.send({ success: 'Your profile was editted successfully! 🍹' })
        })
    }
}