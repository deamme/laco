import * as React from 'react'
import { render } from 'react-dom'
import { Store } from 'laco'
import { Subscribe } from 'laco-react'
import { Route, RouterStore, Switch, Link } from 'laco-react-router'

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
