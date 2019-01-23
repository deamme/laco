<p align="center">
  <img src="https://i.imgur.com/7RgJ5nV.png" width="80%">
</p>

# Laco

[![npm version](https://badge.fury.io/js/laco.svg)](https://badge.fury.io/js/laco)
[![travis](https://travis-ci.org/deamme/laco.svg?branch=master)](https://travis-ci.org/deamme/laco)

Very simple and powerful state management solution for React and Inferno.

(Inferno doesn't have hooks support but you can use the [Subscribe component](https://github.com/deamme/laco#subscribe-).)

Set up your stores and subscribe to them. Easy as that!

[Check out the introductory blog post](https://medium.com/@Deam/laco-intro-5db2077ec829).

`npm install laco`

`npm install laco-inferno` or `npm install laco-react`

## Summary

- :rocket: Simple to use
- :tada: Lightweight (under 2kb minified)
- :sparkles: Partial [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension) support (time travel)

## Example

```jsx
import { Store } from 'laco'
import { useStore } from 'laco-react'

// Creating a new store with an initial state { count: 0 }
const CounterStore = new Store({ count: 0 })

// Implementing some actions to update the store
const increment = () => CounterStore.set(state => ({ count: state.count + 1 }))
const decrement = () => CounterStore.set(state => ({ count: state.count - 1 }))

const Counter = () => {
  const state = useStore(CounterStore) // Takes a single store
  return (
    <div>
      <button onClick={decrement}>-</button>
      <span>{state.count}</span>
      <button onClick={increment}>+</button>
    </div>
  )
}
```

For more examples check the following code sandboxes below or the examples folder.

Code sandboxes using hooks:
- [Todo MVC](https://codesandbox.io/s/74yq01ovl1)
- [Counter and toggle](https://codesandbox.io/s/jvly033v63)

Code sandboxes using render props:
- [Todo MVC](https://codesandbox.io/s/207504xx1y)
- [Counter and toggle](https://codesandbox.io/s/6l7on1m473)

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

### `Store(initialState: Object, name?: String)`

```javascript
// Initializing a new store with an initial state and a name:
const NewStore = Store({ count: 0 }, 'Counter')
```

The name is optional and is used to get an overview of action and store relationship in Redux DevTools Extension. Action names for the Store will now show up as `Counter - ${actionType}` in DevTools Extension where as before only `${actionType}` was shown.

### `Store.get()`

```javascript
// Getting the state of the store
Store.get()
```

Returns an object which could be something like `{ count: 0 }` following the example.

### `Store.set(state: Function, info?: String)`

```javascript
// Setting a new state and passing an optional action name "increment"
Store.set(state => {
  count: state.count + 1
}, 'increment')
```

### `Store.replace(state: Function, info?: String)`

Immutability is taking care of to a certain extent behind the scenes with the spread operator with `Store.set()` but you might want more control over the state. You can do this by using `Store.replace()` like so:

```javascript
// Setting a new state and passing an optional action name "increment"
Store.replace(state => {
  /* return modified state */
}, 'increment')
```

### `Store.setCondition(condition: Function)`

```javascript
// Setting a condition to prevent count from going below 0 when `actionType` is `Decrement`
CounterStore.setCondition((state, actionType) => {
  if (state.count < 0 && actionType === 'Decrement') {
    // Returning a falsy value will prevent the state from changing
    return false
  }

  // For every other `actionTypes` such as `SudoDecrement` will change the state
  return state
})
```

Setting a condition on a store will make every `Store.set()` call go through the condition first.

### `Store.reset()`

```javascript
// Resets the store to initial state
Store.reset()
```

A good practice when testing is to call `reset()` on a store before using the store in a test. This takes care of some edge cases that you might run into. The reason for this is that Laco is using a global object behind the scenes to store all of your stores states into one big object. Redux also operates on one global object which makes time travel possible.

### `Store.dispatch(value: any, info: String)`

```javascript
// Dispatching an action that does not change the state of the store
Store.dispatch(changeLocation(), 'Location change')
```

You might want to dispatch an action that is associated with a certain store but don't want to change the state. The action will in this case be shown as `StoreName - Location change`.

### `dispatch(value: any, info: String)`

```javascript
import { dispatch } from 'laco'

// Dispatching a global action that does not change any state
dispatch(changeLocation(), 'Location change')
```

You might want to dispatch a global action that is **NOT** associated with any store. The action will in this case just be shown as `Location change`.

### `getGlobalState()`

```javascript
import { getGlobalState } from 'laco'

getGlobalState()
```

Returns the global object that holds every state - mostly used for [rehydration](https://github.com/deamme/laco#Rehydration) when doing server-side rendering (SSR).

### `resetGlobalState()`

```javascript
import { resetGlobalState } from 'laco'

resetGlobalState()
```

Resets the global state to an empty object.

### `replaceGlobalState()`

```javascript
import { replaceGlobalState } from 'laco'

const newGlobalState = { 0: { test: true } }

replaceGlobalState(newGlobalState)
```

Replaces the global state completely - mostly used for [rehydration](https://github.com/deamme/laco#Rehydration) when doing server-side rendering (SSR).

### `<Subscribe />`

#### Props

- `to` - Array of stores you want to subscribe to

```jsx
import { Subscribe } from 'laco-react' // or 'laco-inferno'

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

### `useStore()`
```jsx
import { Store } from 'laco'
import { useStore } from 'laco-react'

const CounterStore = new Store({ count: 0 })

const Counter = () => {
  const state = useStore(CounterStore) // Takes a single store
  return <div>{state.count}</div>
}
```

### `useStores()`
```jsx
import { Store } from 'laco'
import { useStores } from 'laco-react'

const CounterStore = new Store({ count: 0 })
const AnotherStore = new Store({ test: "hello" })

const Counter = () => {
                                    // Takes an array of stores
  const [counterState, anotherState] = useStores([CounterStore, AnotherStore])
  return <div>{anotherState.test + counterState.count}</div>
}
```

## Rehydration

When doing server-side rendering (SSR) it's important to preserve the state from the server to the client.

Please follow [this](https://redux.js.org/recipes/serverrendering) Redux guide.

On the server: Instead of doing `store.getState()` you will just use `getGlobalState()`.

On the client: Instead of doing `createStore(counterApp, preloadedState)` you can do `replaceGlobalState(preloadedState)`

Keep in mind that trying to do SSR rehydration can introduce JS injections if you don't do it right.

The Redux guide solves it by doing `JSON.stringify(preloadedState).replace(/</g, '\\u003c')`. For another solution look [here](https://github.com/deamme/laco/pull/2#issuecomment-417880218).

## Testing

Testing using [tape](https://github.com/substack/tape):

```javascript
import * as test from 'tape'
import { CounterStore, increment, decrement } from './CounterStore'

test('counter', t => {
  CounterStore.reset()
  t.assert(CounterStore.get().count === 0)

  increment()
  t.assert(CounterStore.get().count === 1)

  decrement()
  t.assert(CounterStore.get().count === 0)

  t.end()
})
```

## Credits

Heavily inspired by:

- [Unstated](https://github.com/jamiebuilds/unstated)
- [Redux](https://github.com/reactjs/redux)
