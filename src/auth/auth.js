import Auth0Lock from 'auth0-lock'
import gql from 'graphql-tag'
import { AUTH_CONFIG } from './auth0-variables'

const AUTHENTICATE = gql`
    mutation authenticate($idToken: String!) {
        authenticate(idToken: $idToken) {
            id
            name
            email
        }
    }
`

class Auth {
  lock = new Auth0Lock(AUTH_CONFIG.clientId, AUTH_CONFIG.domain, {
    oidcConformant: true,
    autoclose: true,
    auth: {
      sso: false,
      redirectUrl: AUTH_CONFIG.callbackUrl,
      responseType: 'token id_token',
      audience: `https://${AUTH_CONFIG.domain}/api/v2/`,
      params: {
        scope: `openid profile email user_metadata app_metadata picture`
      }
    },
  })

  constructor(cb, apolloClient) {
    this.handleAuthentication()
    // binds functions to keep this context
    this.apolloClient = apolloClient
    this.cb = cb.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
  }

  login() {
    // Call the show method to display the widget.
    console.log('lock', this.isAuthenticated())
    this.lock.show()
  }

  handleAuthentication() {
    // Add a callback for Lock's `authenticated` event
    this.lock.on('authenticated', this.setSession.bind(this))
    // Add a callback for Lock's `authorization_error` event
    this.lock.on('authorization_error', err => {
      console.log(err)
      alert(`Error: ${err.error}. Check the console for further details.`)
      const data = { status: `error`, errMessage: err.error }
      this.cb(data)
    })
  }

  setSession(authResult) {
    if (authResult && authResult.accessToken && authResult.idToken) {
      // Set the time that the access token will expire at
      let expiresAt = JSON.stringify(
          authResult.expiresIn * 1000 + new Date().getTime()
      )
      localStorage.setItem('access_token', authResult.accessToken)
      localStorage.setItem('id_token', authResult.idToken)
      localStorage.setItem('expires_at', expiresAt)
      const data = {
        status: `success`,
        accessToken: authResult.accessToken,
        idToken: authResult.idToken,
        expiresAt
      }
      this.signinOrCreateAccount({ ...data })
      this.cb(data)
    }
  }

  signinOrCreateAccount({ accessToken, idToken, expiresAt }) {
    console.log(this.apolloClient)
    this.apolloClient
        .mutate({
          mutation: AUTHENTICATE,
          variables: { idToken }
        })
        .then(res => {
          if (window.location.href.includes(`callback`)) {
            window.location.href = '/'
          } else {
            window.location.reload()
          }
        }).catch(err => console.log('Sign in or create account error: ', err))
  }
  logout() {
    // Clear access token and ID token from local storage
    localStorage.removeItem('access_token')
    localStorage.removeItem('id_token')
    localStorage.removeItem('expires_at')

    window.location.reload()
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'))
    return new Date().getTime() < expiresAt
  }
}

export default Auth
