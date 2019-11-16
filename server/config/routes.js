const controllers = require('../controllers')
const restrictedPages = require('../config/auth')

module.exports = (app) => {

    // user routes
    app.post('/user/register', restrictedPages.isNotLogged, controllers.user.register)
    app.post('/user/login', restrictedPages.isNotLogged, controllers.user.login)
    app.post('/user/logout', restrictedPages.isAuthed, controllers.user.logout)
    app.get('/user/profile', restrictedPages.isAuthed, controllers.user.getProfile)
    app.post('/user/profile', restrictedPages.isAuthed, controllers.user.updateProfile)

    // product routes
    app.get('/', controllers.product.getAll);
    app.post('/product/create', restrictedPages.hasRole('Admin'), controllers.product.createPost)
    app.post('/product/edit/:productId', restrictedPages.hasRole('Admin'), controllers.product.editPost)
    app.post('/product/delete/:productId', restrictedPages.hasRole('Admin'), controllers.product.deletePost)

    app.post('/product/like/:productId', restrictedPages.isAuthed, controllers.product.like)
    app.get('/product/details/:productId', controllers.product.getDetails)

    app.get('/cart', restrictedPages.isAuthed, controllers.cart.getCart)
    app.post('/cart/add/:productId', restrictedPages.isAuthed, controllers.cart.addToCart)

}