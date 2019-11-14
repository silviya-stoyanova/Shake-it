const homeController = require('./home');
const userController = require('./user');
const productController = require('./product')
const cartController = require('./cart')

module.exports = {
    home: homeController,
    user: userController,
    product: productController,
    cart: cartController,
}