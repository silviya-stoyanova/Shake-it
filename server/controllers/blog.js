const Article = require('../models/Article')

module.exports = {

    getBlog: (req, res) => {
        Article.find()
            .then(articles => res.send(articles))
            .catch(err => res.status(400).send({ message: err.message }))
    },

    createArticle: (req, res) => {
        const articleData = req.body

        Article.create({
            title: articleData.articleTitle,
            content: articleData.articleContent

        }).then((data, err) => {
            return res.send({ success: 'Successfully published article! 🍹' })

        }).catch(err => {
            return res.status(400).send({ message: err.message })
        })
    },

    detailsArticle: async (req, res) => {
        const articleId = req.params.articleId

        Article.findById(articleId)
            .then(article => {
                return res.send(article)
            })
            .catch(err => {
                return res.status(400).send({ message: 'Oops! This article does not exist!' })
            })
    },

    editArticle: (req, res) => {
        const articleId = req.params.articleId
        const articleData = req.body

        Article.findByIdAndUpdate(articleId, articleData, (err, res) => {
            if (err) {
                return res.status(400).send({ message: err.message })
            }

            //! todo

        })
    },

    deleteArticle: (req, res) => {

    }
}