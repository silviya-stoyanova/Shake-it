import { toast } from 'react-toastify'
import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'

const AddToCart = (props) => {
    const { productId } = props.match.params
    const jwtToken = sessionManager.getUserInfo().authtoken

    requester.addToCart(productId, jwtToken)
        .then(res => {
            if (!res.ok) {
                return Promise.reject(res)
            }
            return res.json()
        })
        .then(res => {
            toast.info(res.success, {
                className: 'success-toast'
            })
        })
        .catch(err => {
            err.json().then(error => {
                toast.info(error.message, {
                    className: 'error-toast'
                })
            })
        })

    props.history.goBack()
    return null
}

export default AddToCart