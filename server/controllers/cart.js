const Cart = require('../models/Cart')
const User = require('../models/User')

module.exports = {
    getCart: async (req, res) => {
        const cartId = req.session.user.myCart
        const cart = await Cart.findById(cartId).populate('products.product')
        // to send products' info, not just their ids from the cart

        if (!cart) {
            return res.status(500).send({ message: 'Something went wrong' })
        }

        console.log(cart.products)
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
    }




}