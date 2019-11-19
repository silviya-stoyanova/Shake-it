import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'
import { toast } from 'react-toastify'

const RemoveFromCart = (props) => {
    const { productInfoId } = props.match.params
    const jwtToken = sessionManager.getUserInfo().authtoken

    requester.removeFromCart(productInfoId, jwtToken)
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
            err.json()
                .then(error => {
                    toast.info(error.message, {
                        className: 'error-toast'
                    })
                })
        })

    props.history.goBack()

    return null
}

export default RemoveFromCart