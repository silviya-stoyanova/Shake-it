import React, { Component, Fragment } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import requester from '../utilities/requests-util'
import sessionManager from '../utilities/session-util'
import '../../static/css/products.css'

class DeleteProduct extends Component {
    constructor(props) {
        super(props)
        this.state = {
            product: {},
            productExists: true,
            isDeleted: false
        }
    }

    handleFormSubmit = (event) => {
        event.preventDefault()
        const { productId } = this.props.match.params
        const jwtToken = sessionManager.getAuthtoken()

        requester.deleteProduct(productId, jwtToken)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(res => {
                this.setState({ isDeleted: true })

                toast.info(res.success, {
                    className: 'success-toast'
                })
            })
            .catch(error => {
                error.json().then(err => {
                    toast.info(err.message, {
                        className: 'error-toast'
                    })
                })
            })
    }

    render() {
        const { product, productExists, isDeleted } = this.state

        return (
            <div className="form" >

                {!productExists ? <Redirect to='/' /> : null}
                {isDeleted ? <Redirect to='/' /> : null}

                <form onSubmit={this.handleFormSubmit}>
                    <div className="form-type">Are you sure you want</div>
                    <div className="form-type">to delete this product?</div>
                    <hr />

                    {product.image
                        ? <div className="form-fields-wrapper">
                            <div className="product-title">{product.title}</div>

                            <img src={'data:image/png;base64, ' + product.image} alt={product.title} className="product-img" />

                            <label htmlFor="description">Description</label>
                            <textarea defaultValue={product.description} type="text" id="description" disabled></textarea>

                            <div className="price">
                                <label htmlFor="price">Price:</label>
                                <input value={product.price} id="price" disabled />
                                <span className="price-sign">$</span>
                            </div>
                        </div>

                        : <img src={require('../../static/images/loading-circle.gif')} alt={'loading'} className="product-img" />
                    }

                    <hr />
                    <button className="button btn-del" type="submit">Yes</button>
                    <Link to="/" className="button btn-del">No</Link>
                </form>
            </div>
        )
    }

    componentDidMount() {
        requester.getProductInfo(this.props.match.params.productId)
            .then(res => {
                if (!res.ok) {
                    return Promise.reject(res)
                }
                return res.json()
            })
            .then(async product => {
                await this.setState({ product })
            })
            .catch(error => {
                this.setState({ productExists: false })
                console.log(error)

                error.json()
                    .then(err => {
                        toast.info(err.message, {
                            className: 'error-toast'
                        })
                    })
            })
    }
}

export default DeleteProduct