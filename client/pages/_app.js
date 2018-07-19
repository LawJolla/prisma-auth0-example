import React from "react"
import App, { Container } from "next/app"
import { ApolloProvider } from "react-apollo"
import withApollo from "../lib/withApollo"
import GlobalTheme from "../src/components/GlobalTheme"
import Navigation from "../src/components/Navigation"

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    pageProps.query = ctx.query

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <ApolloProvider client={this.props.apollo}>
          <GlobalTheme>
              <Component {...pageProps} />
          </GlobalTheme>
        </ApolloProvider>
      </Container>
    )
  }
}

export default withApollo(MyApp)
//export default MyApp
