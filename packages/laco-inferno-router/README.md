# Laco Inferno Router
[![npm version](https://badge.fury.io/js/laco-inferno-router.svg)](https://badge.fury.io/js/laco-inferno-router)

`laco-inferno-router` is a replacement for [Redux First Router](https://github.com/faceyspacey/redux-first-router) which makes routing a part of the state.

Routing now works with time travel and you can dispatch routing related actions that get logged in the debugger.

## Example
```javascript
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
```

Check out the `examples` folder.

## API
Refer to [React Router](https://github.com/ReactTraining/react-router) documentation for following components:
- Route
- Switch
- Link

### `RouterStore`
This is the main store for routing.
```javascript
// Getting the state of the store
RouterStore.get()
// Outputs something like:
// {
//   hash: "",
//   pathname: "/",
//   search: ""
// }
```

### Actions
You may want to have more control of the routing history. You can do that by dispatching following actions:
- push(path: string)
- replace(path: string)
- go(n: number)
- goBack()
- goForward()

```javascript
import { push } from 'laco-inferno-router'

push('/test')
```
Actions gets automatically logged in the debugger.

For more information check out the history API [here](https://github.com/ReactTraining/history#navigation).

## Credits
Heavily inspired by:
- [React Router](https://github.com/ReactTraining/react-router)
- [Redux First Router](https://github.com/faceyspacey/redux-first-router)
