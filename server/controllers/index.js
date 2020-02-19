const homeController = require('./home');
const userController = require('./user');
const productController = require('./product')
const blogController = require('./blog')
const cartController = require('./cart')

module.exports = {
    home: homeController,
    user: userController,
    product: productController,
    blog: blogController,
    cart: cartController,
}