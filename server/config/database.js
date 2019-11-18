const mongoose = require('mongoose')
const User = require('../models/User')
mongoose.Promise = global.Promise

module.exports = (config) => {
    mongoose.connect(config.connectionString, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true    // new
        // useMongoClient: true  // old
    })

    let database = mongoose.connection

    database.once('open', (err) => {

        if (err) {
            throw err
        }

        User.seedAdmin()
            .then(() => {
                console.log('Database ready!')
            }).catch((reason) => {
                console.log('Something went wrong while trying to seed the Admin in the database.., in file server/config/database.js')
                console.log(reason)
            })
    })
}