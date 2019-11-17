import React from 'react'
import { Route, Switch } from 'react-router-dom'
import UserLogin from '../user/login'
import UserRegister from '../user/register'
import UserLogout from '../user/logout'
import UserProfile from '../user/profile'

import CreateProduct from '../product/create-product'
import AllProducts from '../product/all-products'
import ProductDetails from '../product/details-product'
import LikeProduct from '../product/like-product'
import EditProduct from '../product/edit-product'
import DeleteProduct from '../product/delete-product'

import Cart from '../cart/cart'
import AddToCart from '../cart/add-to-cart'
import RemoveFromCart from '../cart/remove-from-cart'

import ContactForm from '../static-pages/contacts'
import About from '../static-pages/about-us'

function MyRoutes() {
    return (
        <Switch>
            <Route exact path="/" component={AllProducts} />
            <Route path="/user/login" component={UserLogin} />
            <Route path="/user/logout" component={UserLogout} />
            <Route path="/user/profile" component={UserProfile} />
            <Route path="/user/register" component={UserRegister} />

            <Route path="/product/create" component={CreateProduct} />
            <Route path="/product/edit/:productId" component={EditProduct} />
            <Route path="/product/delete/:productId" component={DeleteProduct} />

            <Route path="/product/details/:productId" component={ProductDetails} />
            <Route path="/product/like/:productId" component={LikeProduct} />

            <Route exact path="/cart" component={Cart} />
            <Route path="/cart/add/:productId" component={AddToCart} />
            <Route path="/cart/remove/:productInfoId" component={RemoveFromCart} />

            <Route path="/contacts" component={ContactForm} />
            <Route path="/about" component={About} />
        </Switch>
    )
}

export default MyRoutes