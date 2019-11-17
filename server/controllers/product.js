const Product = require('../models/Product')
const Cart = require('../models/Cart')
const multiparty = require('multiparty')
const path = require('path')
const fs = require('fs')
const mv = require('mv')
// mv allows to move a file from one disk partition to another
const uploadFilesPath = path.join(__dirname, '../upload/images/')

module.exports = {
    getAll: (req, res) => {
        Product.find()
            .then(products => {
                products = products.map(p => {
                    p.image = fs.readFileSync(uploadFilesPath + p.image).toString('base64')
                    return p
                })

                return res.send(products)
            })
            .catch(err => {
                return res.status(400).send({ message: err.message })
            })
    },

    getDetails: (req, res) => {
        Product.findById(req.params.productId)
            .then(product => {
                product.image = fs.readFileSync(uploadFilesPath + product.image).toString('base64')
                res.contentType('json')
                return res.send(product)
            })
            .catch(err => {
                return res.status(400).send({ message: 'Oops! This product does not exist!' })
            })
    },

    createPost: async (req, res) => {
        let form = new multiparty.Form()

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).send({ message: err })
            }

            let title = fields.title[0]
            let description = fields.description[0]
            let image = files.image[0]
            let price = fields.price[0]
            const titleIsTaken = await Product.findOne({ title })

            if (titleIsTaken) {
                return res.status(400).send({ message: 'This product title is already taken. Please choose another one!' })
            }
            if (!title || !description || !image || !price) {
                return res.status(400).send({ message: 'The product must have title, description, image and price!' })
            }
            if (title.length < 3 || title.length > 50) {
                return res.status(400).send({ message: 'The title length must be between 3 and 50 symbols including!' })
            }
            if (description.length < 10 || description.length > 250) {
                return res.status(400).send({ message: 'The title description must be between 10 and 250 symbols!' })
            }

            Product.create({ title, description, price })
                .then(async newProduct => {
                    let newFileName = image.path.split('\\').reverse()[0]

                    await mv(image.path, uploadFilesPath + newFileName,
                        (err) => {
                            if (err) {
                                res.status(500).send({ message: err.message })
                            }
                        }
                    )

                    newProduct.image = newFileName
                    await newProduct.save()
                    return res.send({ success: 'You have successfully added this product! Cheers! 🍹' })
                })
                .catch(err => {
                    return res.status(400).send({ message: err.message })
                })
        })
    },

    editPost: async (req, res) => {
        let form = new multiparty.Form()

        form.parse(req, async (err, fields, files) => {
            if (err) {
                return res.status(500).send({ message: err })
            }

            let title = fields.title[0]
            let description = fields.description[0]
            let image = files.image ? files.image[0] : ''
            let price = fields.price[0]

            let product = await Product.findById(req.params.productId)
            let productWithSameTitle = await Product.findOne({ title })

            // check if the title is already taken
            // if a product with the same title exists AND it's _id is different that the current one's
            // throw an error
            let titleIsTaken =
                productWithSameTitle
                    ? productWithSameTitle._id.toString() !== product._id.toString()
                    : false

            if (!product) {
                return res.status(400).send({ message: 'This product does not exist!' })
            }
            if (titleIsTaken) {
                return res.status(400).send({ message: 'Please choose another title, this one is already taken!', titleIsTaken: true })
            }
            if (!title || !description || !price) {
                return res.status(400).send({ message: 'The product must have title, description and price!' })
            }
            if (title.length < 3 || title.length > 50) {
                return res.status(400).send({ message: 'The title length must be between 3 and 50 symbols including!' })
            }
            if (description.length < 10 || description.length > 250) {
                return res.status(400).send({ message: 'The title description must be between 10 and 250 symbols!' })
            }

            //*** without encType="multipart/form-data" in the form:
            // headers: {
            //     'content-disposition':
            //     'form-data; name="image"; filename="1448987911-delish-holiday-milkshakes-gingerbread.jpg"',
            //         'content-type': 'image/jpeg'
            // },
            // size: 123029

            //*** with encType="multipart/form-data" in the form:
            // fieldName: 'image',
            //     originalFilename: '1448987911-delish-holiday-milkshakes-gingerbread.jpg',
            //     path: 'C:\\Users\\SILVIq\\AppData\\Local\\Temp\\bxjJ2aRViwM7WhoqdVJa6X7C.jpg',
            //
            // headers: {
            //     'content-disposition':
            //     'form-data; name="image"; filename="1448987911-delish-holiday-milkshakes-gingerbread.jpg"',
            //     'content-type': 'image/jpeg'
            // },
            // size: 123029

            let newFileName = ''
            if (image) {
                console.log('New image is provided');
                
                newFileName = image.path.split('\\').reverse()[0]

                await mv(image.path, uploadFilesPath + newFileName,
                    (err) => {
                        if (err) {
                            return res.status(500).send({ message: err.message })
                        }
                    }
                )

                // remove the previous image
                fs.unlink(uploadFilesPath + product.image,
                    (err) => {
                        if (err) {

                            console.log(err.message)
                            return res.send(500).send({ message: err.message })
                        }
                    }
                )

                product.image = newFileName
            }

            product.title = title
            product.description = description
            product.price = price
            await product.save()
            res.send({ success: 'Product was editted successfully! 🍹' })
        })
    },

    deletePost: (req, res) => {
        const { productId } = req.params

        Product.findByIdAndRemove(productId,
            async (err, response) => {
                if (err) {
                    return res.status(400).send({ message: err })
                }

                // find carts in which this product is present and remove it (only)
                Cart.updateMany({ ['products.product']: productId }, {
                    $pull: {
                        products: { product: productId }
                    }
                }, ((error, response) => {
                    // response is { n: 2, nModified: 2, ok: 1 }
                    if (error) {
                        return res.status(500).send({ message: error.message })
                    }
                }))

                // delete the image
                fs.unlink(uploadFilesPath + response.image,
                    (err) => {
                        if (err) {
                            return res.status(500).send({ message: err.message })
                        }
                        return res.send({ success: 'Product was deleted successfully! 🍹' })
                    }
                )
            }
        )
    },

    like: async (req, res) => {
        const { productId } = req.params
        const { user } = req.session
        const product = await Product.findById(productId)

        if (product.likes.includes(user._id)) {
            return res.status(400).send({ message: 'You cannot vote for this product more than once!' })
        }

        Product.findByIdAndUpdate(productId, {
            $push: { likes: user._id }
        }, (error, response) => {
            if (error) {
                return res.status(400).send({ message: error })
            }
            return res.send({ success: 'Thanks for your vote! 🍹' })
        })
    }


}