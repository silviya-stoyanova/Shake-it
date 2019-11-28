const mongoose = require('mongoose')
const encryption = require('../utilities/encryption')
const Cart = require('../models/Cart')

let userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 5 },
    profilePic: {
        type: String,
        default: 'default.png'  // default: 'https://cms.qz.com/wp-content/uploads/2016/03/shake.jpg?quality=75&strip=all&w=350&h=449&crop=1'
    },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String, },
    email: { type: String, },             // unique: true
    country: { type: String },
    city: { type: String },
    postcode: { type: String },
    adress: { type: String, },
    purchasedProducts: { type: Number, default: 0 }, // boughtProducts ?

    myCart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    roles: [{ required: true, default: 'User', type: mongoose.Schema.Types.String }],
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true }
}, {
    usePushEach: true
})

userSchema.method({
    authenticate: function (password) {
        let inputPasswordHash = encryption.hashPassword(password, this.salt)
        let isSamePasswordHash = inputPasswordHash === this.passwordHash
        return isSamePasswordHash
    },

    isInRole: function (role) {
        return this.roles.indexOf(role) !== -1
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User

User.seedAdmin = async () => {
    try {
        let users = await User.find()
        if (users.length > 0) return
        const cart = await Cart.create({})
        const salt = encryption.generateSalt()
        const passwordHash = encryption.hashPassword('admin123', salt)

        return User.create({
            username: 'admin',

            profilePic: 'default.png',
            firstName: '',
            lastName: '',
            email: '',
            country: '',
            city: '',
            postcode: '',
            adress: '',
            phoneNumber: '',
            purchasedProducts: '',
            myCart: cart._id,

            // email: 'admin@admin.bg',
            roles: ['Admin'],
            salt,
            passwordHash
        })
    } catch (e) {
        console.log(e)
    }
}