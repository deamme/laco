import { render } from 'inferno'
import { Store } from 'laco'
import { Subscribe } from 'laco-inferno'
import { Route, RouterStore, Switch, Link } from 'laco-inferno-router'

import Home from './pages/Home'
import Test from './pages/Test'
import NoMatch from './pages/NoMatch'

const Counter = () => (
  <Subscribe to={[RouterStore]}>
    {state => (
      <Switch location={state.pathname}>
        <Route exact path="/" component={Home} />
        <Route exact path="/test" component={Test} />
        <Route component={NoMatch} />
      </Switch>
    )}
  </Subscribe>
)

render(<Counter />, document.getElementById('root'))
