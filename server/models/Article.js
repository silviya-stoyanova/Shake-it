const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    // author: { type: mongoose.SchemaTypes.ObjectId },
    title: { type: mongoose.SchemaTypes.String, required: true },
    content: { type: mongoose.SchemaTypes.String, required: true },

    // to call Date.now() ??
    time: { type: mongoose.SchemaTypes.Date, default: Date.now }
})

const Article = mongoose.model('Article', articleSchema)
module.exports = Article