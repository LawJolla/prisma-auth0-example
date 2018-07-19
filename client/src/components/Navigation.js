import React from "react"
import Link from "next/link"
import { AuthContext } from "../contexts/AuthContext";

const Navigation = () => (
  <AuthContext.Consumer>
    {({ renewToken, authenticated, login }) => (
  <nav className='pa3 pa4-ns'>
    <Link href='/'><a>Home</a></Link>
    <Link href='/drafts'><a>Drafts</a></Link>
    <Link href='/feed'><a>Feed</a></Link>
    <button onClick={login}>Login</button>
    {/*{auth.isAuthenticated() ?*/}
      {/*<React.Fragment>*/}
        {/*<button onClick={() => auth.logout()} className='f6 link dim br1 ba ph3 pv2 fr mb2 dib black' >Log Out</button>*/}
        {/*<Link*/}
          {/*to='/create'*/}
          {/*className='f6 link dim br1 ba ph3 pv2 fr mb2 dib black'*/}
        {/*>*/}
          {/*+ Create Draft*/}
        {/*</Link>*/}
      {/*</React.Fragment>*/}
      {/*: <button className='f6 link dim br1 ba ph3 pv2 fr mb2 dib black'  onClick={() => auth.login()} >Login</button>*/}
    {/*}*/}
  </nav>
    )}
  </AuthContext.Consumer>
)

export default Navigation