import React from "react"
import Navigation from "../src/components/Navigation"
import Authentication from "../src/auth/auth"

export default ({ children }) => (
  <Authentication>
    <Navigation/>
    {children}
  </Authentication>
)