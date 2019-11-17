const Cart = require('../models/Cart')
const User = require('../models/User')

module.exports = {
    getCart: async (req, res) => {
        const cartId = req.session.user.myCart
        const cart = await Cart.findById(cartId).populate('products.product')

        if (!cart) {
            return res.status(500).send({ message: 'Something went wrong' })
        }
        res.send(cart.products)
    },

    addToCart: async (req, res) => {
        const productId = req.params.productId

        try {
            const cartId = req.session.user.myCart
            const cart = await Cart.findById(cartId)

            const productIndexInCart = cart.products.findIndex(
                p => p.product.toString() === productId.toString()
            )

            if (productIndexInCart >= 0) {
                cart.products[productIndexInCart].quantity++
            } else {
                cart.products = [...cart.products, {
                    product: productId,
                    quantity: 1
                }]
            }
            cart.save()
            return res.send({ success: 'This product was added to your cart!' })

        } catch (err) {
            console.log(err, 'at server/controllers/cart.js, at function addToCart')
            return res.send({ message: err.message })
        }
    },

    updateQty: async (req, res) => {
        const { productInfoId } = req.params
        const action = req.body

        try {
            let cart = await Cart.findOne({ 'products._id': productInfoId }).populate('products.product')
            let index = cart.products.findIndex(p => p._id.toString() === productInfoId.toString())

            if (action.actionType === 'increment') {
                cart.products[index].quantity++

            } else if (action.actionType === 'decrement') {
                cart.products[index].quantity--

                if (cart.products[index].quantity === 0) {
                    // remove the product from the cart
                    cart.products = cart.products.filter(p => p._id.toString() !== productInfoId.toString())
                }
            }

            cart.save()
            return res.send({ products: cart.products, success: `Product was ${action.actionType}ed successfully!` })
        }

        catch (err) {
            return res.status(400).send({ message: 'Product was not found!' })
        }
    },






}