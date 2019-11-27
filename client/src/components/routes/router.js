import React from 'react'
import { Route, Switch } from 'react-router-dom'
import AuthRoute from './auth-route'

// user components
import UserLogin from '../user/login'
import UserRegister from '../user/register'
import UserLogout from '../user/logout'
import UserProfile from '../user/profile'

// product components
import CreateProduct from '../product/create-product'
import AllProducts from '../product/all-products'
import ProductDetails from '../product/details-product'
import LikeProduct from '../product/like-product'
import EditProduct from '../product/edit-product'
import DeleteProduct from '../product/delete-product'

// cart components
import Cart from '../cart/cart'
import AddToCart from '../cart/add-to-cart'
import RemoveFromCart from '../cart/remove-from-cart'

// order components
import CompleteOrder from '../order/complete-order'
import ThanksForOrder from '../order/thank-you'

// static components
import ContactForm from '../static-pages/contacts'
import About from '../static-pages/about-us'
import PageNotFound from '../static-pages/not-found'

function MyRoutes() {
    return (
        <Switch>
            <Route exact path="/" component={AllProducts} />
            <AuthRoute path="/user/login" component={UserLogin} role="null" />
            <AuthRoute path="/user/logout" component={UserLogout} role="User" />
            <AuthRoute path="/user/profile" component={UserProfile} role="User" />
            <AuthRoute path="/user/register" component={UserRegister} role="null" />

            <AuthRoute path="/product/create" component={CreateProduct} role="Admin" />
            <AuthRoute path="/product/edit/:productId" component={EditProduct} role="Admin" />
            <AuthRoute path="/product/delete/:productId" component={DeleteProduct} role="Admin" />

            <Route path="/product/details/:productId" component={ProductDetails} />
            <AuthRoute path="/product/like/:productId" component={LikeProduct} role="User" />

            <AuthRoute exact path="/cart" component={Cart} role="User" />
            <AuthRoute path="/cart/add/:productId" component={AddToCart} role="User" />
            <AuthRoute path="/cart/remove/:productInfoId" component={RemoveFromCart} role="User" />

            <AuthRoute path="/order/complete" component={CompleteOrder} role="User" />
            <AuthRoute path="/thanks-for-ordering" component={ThanksForOrder} role="User"/>

            <Route path="/contacts" component={ContactForm} />
            <Route path="/about" component={About} />
            <Route component={PageNotFound} />
        </Switch>
    )
}

export default MyRoutes