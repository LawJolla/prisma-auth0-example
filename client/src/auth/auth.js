/* eslint-disable react/forbid-prop-types */
import React from "react"
import Auth0Lock from "auth0-lock"
import PropTypes from "prop-types"
import base64 from "base-64"
import { withApollo, Query } from "react-apollo"
import { AUTH_CONFIG } from "./auth0-variables"
import {
  getExpiresAt,
  getAccessToken,
  getIdToken,
  setIdToken,
  setAccessToken,
  decodeToken,
  clearAccessToken,
  clearIdToken
} from "./token_functions"
import { AuthContext } from "../contexts/AuthContext"

export class Auth extends React.Component {
  state = {
    error: null,
    authenticating: false,
    isAuthenticated: false
  }
  componentDidMount() {
    this.loadTokens()
  }
  componentWillUnmount() {
    clearInterval()
  }

  setTokens = ({ accessToken, idToken }) => {
    return new Promise((resolve) => {
      setAccessToken(accessToken)
      setIdToken(idToken)
      resolve()
    })

  }
  signInOrCreateAccount = ({ accessToken, idToken }) => {
    return this.setTokens({ accessToken, idToken }).then(() =>
      this.props.client.mutate({
        mutation: AUTHENTICATE,
        variables: { idToken },
        refetchQueries: d => [
          { query: USER, options: { fetchPolicy: `cache-and-network` } }
        ]
      })
    )
    // .then(async () => {
    //   console.log("new user query")
    //   const x = await this.props.client.query({ query: USER })
    //   console.log("new query complete", x)
    //   return x
    // })
  }
  login = () => {
    if (!this.lock) this.loadLock()
    this.handleAuthentication()
    // Call the show method to display the widget.
    console.log(`lock`, this.isAuthenticated())
    // console.log(this.options)
    this.lock.show({ ...this.props.showOptions })
  }

  logout = async () => {
    await this.props.client.mutate({ mutation: REMOVE_TOKENS })
    if (!this.lock) {
      this.loadLock()
    }
    this.lock.logout({ returnTo: window.top.location.origin })
  }

  loadLock = () => {
    const { constructorOptions } = this.props
    this.lock = new Auth0Lock(AUTH_CONFIG.clientID, AUTH_CONFIG.domain, {
      _enableIdPInitiatedLogin: true,
      oidcConformant: true,
      autoclose: true,
      auth: {
        ...AUTH_CONFIG
      },
      languageDictionary: { title: `` },
      ...constructorOptions
    })
  }
  loadTokens = async () => {
    const accessToken = getAccessToken()
    const idToken = getIdToken()
    const tokens = {
      accessToken: this.isValidToken(accessToken) ? accessToken : null,
      idToken: this.isValidToken(idToken) ? idToken : null
    }
    // case where access token is expired but Id token isn't
    if (tokens.idToken && !tokens.accessToken) {
      // await this.renewToken()
    } else {
      this.setTokens(tokens)
    }
  }
  shouldUpdateAccessToken = () => {
    const { accessToken, idToken } = this.state
    if (this.isValidToken(accessToken) && !this.isValidToken(idToken)) {
      this.renewToken()
    }
  }
  isAuthenticated = () => this.isValidToken(this.state.accessToken)
  lock = null
  isValidToken(token) {
    if (!token || token.length < 10) return false
    const decoded = decodeToken(token)
    return decoded && new Date().getTime() < decoded.exp * 1000
  }
  decodeToken = token => {
    if (!token || token.length < 10) return null
    const base64Url = token.split(".")[1]
    const base = base64Url.replace("-", "+").replace("_", "/")
    return JSON.parse(base64.decode(base))
  }
  tokenRenewalTimeout = null
  scheduleAccessTokenRenewal = ({ accessToken }) => {
    const decodedToken = decodeToken(accessToken)
    if (!decodedToken || !decodedToken.exp || this.isAuthenticated())
      return false
    const delay = decodedToken * 1000 - Date.now()
    this.tokenRenewalTimeout = setTimeout(() => {
      this.renewToken()
    }, delay - 5000)
  }
  renewToken = () => {
    return new Promise((resolve, reject) => {
      if (!this.lock) this.loadLock()
      if (!this.state.authenticating) {
        this.setState({ authenticating: true })
        this.lock.checkSession({}, (err, authResult) => {
          this.setState({ authenticating: false })
          if (err) {
            console.log("renew token error", err)
            reject(err)
          }
          console.log("auth result", authResult)
          this.props.client
            .mutate({
              mutation: REFRESH_ACCESS_TOKEN,
              variables: { accessToken: authResult.accessToken }
            })
            .then(resolve)
        })
      } else {
        resolve()
      }
    })
  }
  handleAuthentication = () => {
    // Add a callback for Lock's `authenticated` event
    this.lock.on(`authenticated`, async authResult => {
      try {
        await this.signInOrCreateAccount(authResult)
      } catch (err) {
        this.lock.show({ flashMessage: { type: `error`, text: err.message } })
      }
    })
    // Add a callback for Lock's `authorization_error` event
    this.lock.on(`authorization_error`, error => {
      this.lock.show({
        flashMessage: {
          type: `error`,
          text: error.errorDescription
        }
      })
    })
  }
  test = () => this.setState({ test: true })
  render() {
    const { login, isAuthenticated, renewToken, logout } = this
    const auth = {
      login,
      logout,
      isAuthenticated,
      ...this.state
    }

    const tokens = {
      accessToken: getAccessToken(),
      idToken: getIdToken(),
      renewToken,
      authenticated: this.isValidToken(getAccessToken())
    }
    return (
      <AuthContext.Provider value={Object.assign(auth, tokens)}>
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

Auth.defaultProps = {
  constructorOptions: {},
  showOptions: {}
}

Auth.propTypes = {
  constructorOptions: PropTypes.object,
  showOptions: PropTypes.object
}


export default withApollo(Auth)
