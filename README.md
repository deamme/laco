# Laco (WIP)
[![npm version](https://badge.fury.io/js/laco.svg)](https://badge.fury.io/js/laco)

Very simple and powerful state management solution for React and Inferno.

Set up your stores and subscribe to them. Easy as that!

## Summary
- :rocket: Simple to use
- :tada: Lightweight (under 1kb in size)
- :sparkles: [Redux DevTools Extension support](https://github.com/zalmoxisus/redux-devtools-extension) (time travel, persist state etc.)

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
      <button onClick={decrement}>-</button>
      <span>{state.count}</span>
      <button onClick={increment}>+</button>
    )}
  </Subscribe>
)

render(<Counter />, document.getElementById('root'))
```

For more examples check the examples folder.

Following commands are available for each example project:

`npm run start:dev`

`npm run start:prod`

## API
### `Store`
#### Arguments
1. [Required] - Object
2. [Optional] - String
```javascript
// Initializing with an initial state and a name:
const NewStore = Store({ count: 0 }, "Counter")
```
The name is optional and is used to get an overview of action and store relationship in Redux DevTools Extension. Action names for the Store will now show up as `Counter - ${actionType}` in DevTools Extension where as before only `${actionType}`.

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

## Credits
Heavily inspired by [Unstated](https://github.com/jamiebuilds/unstated)
