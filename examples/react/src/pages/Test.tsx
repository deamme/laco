import * as React from 'react'
import { Link } from 'laco-react-router'
import Home from './Home'

export default (
  <div>
    <h1>Test page</h1>
    {/* <Counter /> */}
    <Link to="/" component={Home}>Link to Home page</Link>
  </div>
)
