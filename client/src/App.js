import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import './static/css/site.css'
import './static/css/scrollbar.css'

import sessionManager from './utilities/session-util'
import observer from './utilities/observer'

import MyRoutes from './components/routes/router'
import Header from './components/common/header'
import Footer from './components/common/footer'

const defaultValue = { isLogged: false }
const { Consumer: UserInfoConsumer, Provider: UserInfoProvider } = React.createContext(defaultValue)

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogged: sessionManager.isUserLogged(),
      username: sessionManager.getUserInfo().username,
      role: sessionManager.getUserInfo().role
    }

    observer.subscribe('userLogin', this.onUserLogin)
    observer.subscribe('userLogout', this.onUserLogout)
  }

  onUserLogin = () => {
    this.setState(prevState => ({ // asyncronous
      isLogged: true,
      username: sessionManager.getUserInfo().username,
      role: sessionManager.getUserInfo().role
    }))
  }

  onUserLogout = () => {
    this.setState(prevState => ({
      isLogged: false,
      username: '',
      role: []
      // role: ''
    }))
  }

  render() {
    const { isLogged, username, role } = this.state

    return (
      <UserInfoProvider value={{ isLogged, username, role }}>
        <BrowserRouter>
          <ToastContainer />
          <Header />
          <MyRoutes />
          <Footer />
        </BrowserRouter>
      </UserInfoProvider>
    )
  }

  componentDidMount() {
    sessionManager.isUserLogged()
      ? this.setState({ isLogged: true })
      : this.setState({ isLogged: false })
  }
}

export { UserInfoProvider } // used in tests
export { UserInfoConsumer }
export default App