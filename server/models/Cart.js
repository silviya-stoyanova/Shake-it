const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.SchemaTypes.ObjectId, ref: 'Product' },
        quantity: { type: Number }
    }]
})

const Cart = mongoose.model('Cart', cartSchema)
module.exports = Cart