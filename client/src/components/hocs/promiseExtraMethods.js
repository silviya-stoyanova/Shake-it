import requester from '../../utilities/requests-util'
import observer from '../../utilities/observer'
import sessionManager from '../../utilities/session-util'

const promiseExtraMethods = {
    user: {
        onLoginSuccess(res) {
            sessionManager.saveSession(res.authtoken, res.username, res.role)
            observer.trigger('userLogin')
        },
        onRegisterSuccess(res, data) {
            let nextPromise = requester.login(data)
            this.handleFetchPromise(nextPromise, this.onLoginSuccess, this.onLoginFail, data) // { username: data.username, password: data.password }
        },
        onLoginFail(err) {
            this.setState(prevState => ({
                data: {
                    ...prevState,
                    userClass: 'correct',
                    passClass: 'error',
                    repeatPassClass: 'error'
                }
            }))
        },
        onRegisterFail(err) {
            this.setState(prevState => ({
                data: {
                    ...prevState,
                    userClass: 'error',
                    passClass: 'correct',
                    repeatPassClass: 'correct'
                }
            }))
        }
    },

    product: {
        onProductPromiseSuccess(err) {
            return err // do nothing
        },

        onProductPromiseFail(err) {
            if (!err.titleIsTaken) {
                this.props.history.push('/')
            }
        }
    }
}

export default promiseExtraMethods