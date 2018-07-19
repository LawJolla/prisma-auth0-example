import withApollo from "next-with-apollo"
import { InMemoryCache } from "apollo-cache-inmemory"
import { ApolloLink, split } from "apollo-link"
import ApolloClient from "apollo-client"
import fetch from "node-fetch"
import { HttpLink } from "apollo-link-http"
import { setContext } from "apollo-link-context"
import { onError } from "apollo-link-error"
import { getMainDefinition } from "apollo-utilities"
import {
  getAccessToken,
  getIdToken,
  isValidToken
} from "../src/auth/token_functions"


export default withApollo(({ headers }) => {
  const ssrMode = !process.browser
  const renewAuth0Token = setContext((request, { renewToken }) => {
    if (
      !isValidToken(getAccessToken()) &&
      isValidToken(getIdToken()) &&
      renewToken
    ) {
      return renewToken()
    }
    return null
  })

  const Authorization = () =>
    typeof window !== `undefined` && isValidToken(getAccessToken())
      ? `Bearer ${getAccessToken()}`
      : null
  const httpLink = new HttpLink({
    uri: `http://localhost:4000`,
    fetch
  })

  const contextLink = setContext(async () => ({
    headers: {
      ...headers,
      Authorization: Authorization() || ``
    }
  }))

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(err =>
        console.log(`[GraphQL error]: Message: ${err.message}`)
      )
    }
    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  const link = ApolloLink.from([
    renewAuth0Token,
    errorLink,
    contextLink,
    httpLink
  ])

  const cache = new InMemoryCache({
    dataIdFromObject: ({ id, __typename }) =>
      id && __typename ? `${__typename}:${id}` : null
  })

  return new ApolloClient({ link, ssrMode, cache })
})

