const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true, minlength: 2, maxlength: 50 },
    description: { type: String, required: true, minlength: 10, maxlength: 250 },
    image: { type: String },
    price: { type: Number, required: true },
    likes: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User' }],
})

const Product = mongoose.model('Product', productSchema)
module.exports = Product