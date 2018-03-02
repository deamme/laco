import { Link } from 'laco-inferno-router'
import Home from './Home'

export default (
  <div>
    <h1>Test page</h1>
    {/* <Counter /> */}
    <Link to="/" component={Home}>Link to Home page</Link>
  </div>
)
