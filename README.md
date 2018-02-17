# Laco (WIP)
[![npm version](https://badge.fury.io/js/laco.svg)](https://badge.fury.io/js/laco)

Very simple and powerful state management solution for React and Inferno.

Set up your stores and subscribe to them. Easy as that!

## Summary
- :rocket: Simple to use
- :tada: Lightweight (under 1kb in size)
- :sparkles: Partial [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) support (time travel, persist state)

## Example
```javascript
import { render } from 'inferno' // or 'react-dom'
import { Store, Subscribe } from 'laco'

// Creating a new store with an initial state { count: 0 }
const CounterStore = new Store({ count: 0 })

// Utility function to get the state of the store
const getState = () => CounterStore.getState()

// Implementing some actions to update the store
const increment = () => CounterStore.setState({ count: getState().count + 1 })
const decrement = () => CounterStore.setState({ count: getState().count - 1 })

const Counter = () => (
  <Subscribe to={[CounterStore]}>
    {(state) => (
      <div>
        <button onClick={decrement}>-</button>
        <span>{state.count}</span>
        <button onClick={increment}>+</button>
      </div>
    )}
  </Subscribe>
)

render(<Counter />, document.getElementById('root'))
```

For more examples check the examples folder.

Following commands are available for each example project:

`npm run start:dev`

`npm run start:prod`

## Redux DevTools Extension
Checkout [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension).
### Time travel
Just click on the stopwatch icon and you will get a slider which you can play with.
That's it! :)

### State persisting
Persist of state is **ON** by default when in **development mode** so a full page refresh does not destroy your state. This makes hot-reloading like [react-hot-loader](https://github.com/gaearon/react-hot-loader) absolute because you already have a persisting state. The only caveat is that a full page refresh may seem slower by a tiny bit.

You may want to **RESET** the persisted state, you can do that by using the PAUSE button on the DevTools Extension. This a bit of a hack because the persist state button on the extension does not have an API for it.

## API
### `Store`
#### Arguments
1. [Required] - Object
2. [Optional] - String
```javascript
// Initializing with an initial state and a name:
const NewStore = Store({ count: 0 }, "Counter")
```
The name is optional and is used to get an overview of action and store relationship in Redux DevTools Extension. Action names for the Store will now show up as `Counter - ${actionType}` in DevTools Extension where as before only `${actionType}` was shown.

### `Store.setState()`
#### Arguments
1. [Required] - Function or Object
2. [Optional] - String
```javascript
// Setting a new state and passing an optional action name "increment"
Store.setState({ count: getState().count + 1 }, "increment")
```
Immutability is taking care of to a certain extent behind the scenes with the spread operator but you may want more control over the state. You can do this by passing a function like so:
```javascript
// Setting a new state and passing an optional action name "increment"
Store.setState((state) => { /* return modified state */}, "increment")
```

### `Store.dispatch()`
#### Arguments
1. [Required] - Some side effect
2. [Required] - String
```javascript
// Dispatching an action that does not change the state of the store
Store.dispatch(changeLocation(), "Location change")
```
You may want to dispatch an action that is associated with a certain store but don't want to change the state. The action will in this case be shown as `StoreName - Location change`.

### `dispatch()`
#### Arguments
1. [Required] - Some side effect
2. [Required] - String
```javascript
import { dispatch } from 'laco'

// Dispatching a global action that does not change any state
dispatch(changeLocation(), "Location change")
```
You may want to dispatch a global action that is **NOT** associated with any store. The action will in this case just be shown as `Location change`.

### `<Subscribe />`
#### Props
- `to` - Array of stores you want to subscribe to
```javascript
<Subscribe to={[CounterStore]}>
  {({ count }) => (
    <div>
      <button onClick={decrement}>-</button>
      <span>{count}</span>
      <button onClick={increment}>+</button>
    </div>
  )}
</Subscribe>
```
The `Subscribe` component is making use of the new render prop idea. Related articles:
- [Apollo Query Component](https://dev-blog.apollodata.com/whats-next-for-react-apollo-4d41ba12c2cb)
- [Use a render prop!](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce)

## Credits
Heavily inspired by:
- [Unstated](https://github.com/jamiebuilds/unstated)
- [Redux](https://github.com/reactjs/redux)
