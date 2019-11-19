import { toast } from 'react-toastify'
import requester from '../../utilities/requests-util'
import sessionManager from '../../utilities/session-util'

const LikeProduct = (props) => {
    const { productId } = props.match.params
    const jwtToken = sessionManager.getUserInfo().authtoken

    requester.likeProduct(productId, jwtToken)
        .then(res => !res.ok ? Promise.reject(res) : res.json())
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

export default LikeProduct