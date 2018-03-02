import { Link } from 'laco-inferno-router'
import Home from './Home'

export default (
  <div>
    <h1> Error 404 - No match!</h1>
    <Link to="/" component={Home}>Link to Home page</Link>
  </div>
)
