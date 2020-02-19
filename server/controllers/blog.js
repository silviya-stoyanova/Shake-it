const Article = require('../models/Article')

module.exports = {

    getBlog: (req, res) => {
        Article.find()
            .then(articles => res.send(articles))
            .catch(err => res.status(400).send({ message: err.message }))
    },

    createArticle: (req, res) => {
        const articleData = req.body

        Article.create({ name: articleData.articleName, content: articleData.articleContent })
            .then((data, err) => {
                if (err) {
                    return res.status(400).send({ message: err.message })
                }

                return res.send({ success: 'Successfully published article! 🍹' })
            })
    },

    detailsArticle: (req, res) => {

    },

    editArticle: (req, res) => {

    },

    deleteArticle: (req, res) => {

    }
}