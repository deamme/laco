# Laco
[![npm version](https://badge.fury.io/js/laco.svg)](https://badge.fury.io/js/laco)
[![travis](https://travis-ci.org/deamme/laco.svg?branch=master)](https://travis-ci.org/deamme/laco)

Very simple and powerful state management solution for React and Inferno.

Set up your stores and subscribe to them. Easy as that!

[Check out the introductory blog post](https://medium.com/@Deam/laco-intro-5db2077ec829).

`npm install laco`

`npm install laco-inferno` or `npm install laco-react`

## Summary
- :rocket: Simple to use
- :tada: Lightweight (under 1kb in size)
- :sparkles: Partial [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) support (time travel)

## Example
```javascript
import { render } from 'inferno' // or 'react-dom'
import { Store } from 'laco'
import { Subscribe } from 'laco-inferno' // or 'laco-react'

// Creating a new store with an initial state { count: 0 }
const CounterStore = new Store({ count: 0 })

// Implementing some actions to update the store
const increment = () => CounterStore.set({ count: CounterStore.get().count + 1 })
const decrement = () => CounterStore.set({ count: CounterStore.get().count - 1 })

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

`npm run test`

## Redux DevTools Extension
Check out [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension).
### Time travel
Just click on the stopwatch icon and you will get a slider which you can play with.
That's it! :)

## React Native Debugger
Check out [React Native Debugger](https://github.com/jhen0409/react-native-debugger).
### Time travel
Works as you would expect :)!

## API
### `Store`
#### Arguments
1. [Required] - Object
2. [Optional] - String
```javascript
// Initializing a new store with an initial state and a name:
const NewStore = Store({ count: 0 }, "Counter")
```
The name is optional and is used to get an overview of action and store relationship in Redux DevTools Extension. Action names for the Store will now show up as `Counter - ${actionType}` in DevTools Extension where as before only `${actionType}` was shown.

### `Store.get()`
```javascript
// Getting the state of the store
Store.get()
```
Returns an object which could be something like `{ count: 0 }` following the example.

### `Store.set()`
#### Arguments
1. [Required] - Function or Object
2. [Optional] - String
```javascript
// Setting a new state and passing an optional action name "increment"
Store.set({ count: CounterStore.get().count + 1 }, "increment")
```
Immutability is taking care of to a certain extent behind the scenes with the spread operator but you might want more control over the state. You can do this by passing a function like so:
```javascript
// Setting a new state and passing an optional action name "increment"
Store.set((state) => { /* return modified state */}, "increment")
```

### `Store.setCondition()`
#### Arguments
1. [Required] - Function
```javascript
// Setting a condition to prevent count from going below 0
// and a special case for `SudoDecrement` action which CAN make count go below 0
CounterStore.setCondition((state, actiontype) => {
  if (state.count >= 0) {
    return state
  } else if (actionType === 'SudoDecrement') {
    return state
  }
  // Otherwise return nothing which does NOT change any state
})
```
Setting a condition on a store will make every `Store.set()` call go through the condition first.

### `Store.reset()`
```javascript
// Resets the store to initial state
Store.reset()
```
A good practice when testing is to call `reset()` on a store before using the store in a test. This takes care of some edge cases that you might run into. The reason for this is that Laco is using a global object behind the scenes to store all of your stores states into one big object. Redux also operates on one global object which makes time travel possible.

### `Store.dispatch()`
#### Arguments
1. [Required] - Some side effect
2. [Required] - String
```javascript
// Dispatching an action that does not change the state of the store
Store.dispatch(changeLocation(), "Location change")
```
You might want to dispatch an action that is associated with a certain store but don't want to change the state. The action will in this case be shown as `StoreName - Location change`.

### `dispatch()`
#### Arguments
1. [Required] - Some side effect
2. [Required] - String
```javascript
import { dispatch } from 'laco'

// Dispatching a global action that does not change any state
dispatch(changeLocation(), "Location change")
```
You might want to dispatch a global action that is **NOT** associated with any store. The action will in this case just be shown as `Location change`.

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

## Routing
`laco-inferno-router` and `laco-react-router` is a replacement for [Redux First Router](https://github.com/faceyspacey/redux-first-router) which makes routing a part of the state.

You can dispatch routing related actions and get them logged in the debugger and routing now also works with time travel.

The general API is similar to [React Router](https://github.com/ReactTraining/react-router). Check out more about Laco React routing [here](https://github.com/deamme/laco/tree/master/packages/laco-react-router) and Laco Inferno routing [here](https://github.com/deamme/laco/tree/master/packages/laco-inferno-router).

## Testing
Testing using [tape](https://github.com/substack/tape):
```javascript
import * as test from 'tape'
import { CounterStore, increment, decrement } from './CounterStore'

test('counter', (t) => {
  CounterStore.reset()
  t.assert(CounterStore.get().count === 0);

  increment()
  t.assert(CounterStore.get().count === 1);

  decrement()
  t.assert(CounterStore.get().count === 0);

  t.end()
})
```

## Credits
Heavily inspired by:
- [Unstated](https://github.com/jamiebuilds/unstated)
- [Redux](https://github.com/reactjs/redux)
