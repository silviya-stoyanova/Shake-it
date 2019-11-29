import requester from '../../utilities/requests-util'
import observer from '../../utilities/observer'
import sessionManager from '../../utilities/session-util'

const promiseExtraMethods = {
    user() {
        function onLoginSuccess(res) {
            sessionManager.saveSession(res.authtoken, res.username, res.role)
            observer.trigger('userLogin')
        }

        function onRegisterSuccess(res, data) {
            let nextPromise = requester.login(data)
            this.handleFetchPromise(nextPromise, onLoginSuccess, onLoginFail, data) // { username: data.username, password: data.password }
        }

        function onLoginFail(err) {
            this.setState(prevState => ({
                data: {
                    ...prevState.data,
                    userClass: 'error',
                    passClass: 'error'
                }
            }))
        }

        function onRegisterFail(err) {
            this.setState(prevState => ({
                data: {
                    ...prevState.data,
                    userClass: 'error',
                    passClass: 'correct',
                    repeatPassClass: 'correct'
                }
            }))
        }

        return {
            onLoginSuccess,
            onRegisterSuccess,
            onLoginFail,
            onRegisterFail
        }
    },

    product() {
       function onProductPromiseSuccess(err) {
            return err // do nothing
        }

       function onProductPromiseFail(err) {
            if (!err.titleIsTaken) {
                this.props.history.push('/')
            }
        }

        return {
            onProductPromiseSuccess,
            onProductPromiseFail
        }
    }
}

export default promiseExtraMethods