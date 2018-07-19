import React from "react"
import styled, { injectGlobal, ThemeProvider } from "styled-components"

injectGlobal`
  body {
  margin: 0;
  padding: 0;
  font-family: 'Open Sans', sans-serif;
  background: rgba(0, 0, 0, 0.05);
}

html {
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

.post {
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
  width: 350px;
  height: 350px;
  flex: 0 0 350px;
}

.post .description {
  flex: 1;
  padding-left: 25px;
  font-size: 25px;
}

.detail {
  width: 600px;
  height: 600px;
  flex: 0 0 600px;
}

.detail .description {
  flex: 1;
  padding-left: 40px;
  font-size: 38px;
}

.title {
  font-size: 42px;
}

.content {
  font-size: 18px;
}

.new-post {
  background-color: rgba(0, 0, 0, 0.04);
}

.close {
  opacity: 0.5;
  margin-top: 60px;
  margin-right: 60px;
}

.close img {
  width: 20px;
  height: 20px;
}

`

const Theme = ({ children }) => (
  // insert theme here
  <ThemeProvider theme={{}}>
    {children}
  </ThemeProvider>
)

export default Theme