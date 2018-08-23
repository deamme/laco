import * as test from 'tape'
import { Store } from '../dist'

test('Correct store index', t => {
  const FirstStore = new Store({ test: true })
  const SecondStore = new Store({ test: true })

  t.assert(FirstStore.idx === 0)
  t.assert(SecondStore.idx === 1)
  t.end()
})

test('Correct store names', t => {
  const CounterStore = new Store({ count: 0 }, 'Counter')
  const TestStore = new Store({ test: true })

  t.assert(CounterStore.name === 'Counter')
  t.assert(TestStore.name === '')
  t.end()
})

test('CounterStore actions', t => {
  // Creating a new store with an initial state { count: 0 }
  const CounterStore = new Store({ count: 0 }, 'Counter')

  // Implementing some actions to update the store
  const increment = () => CounterStore.set(prev => ({ count: prev.count + 1 }), 'Increment')
  const decrement = () => CounterStore.set(prev => ({ count: prev.count - 1 }), 'Decrement')

  const replaceWithTen = () => CounterStore.replace(() => ({ count:  10 }), 'Replace with ten')

  CounterStore.reset()
  t.assert(CounterStore.get().count === 0)

  increment()
  t.assert(CounterStore.get().count === 1)

  decrement()
  t.assert(CounterStore.get().count === 0)

  decrement()
  t.assert(CounterStore.get().count === -1)

  replaceWithTen()
  t.assert(CounterStore.get().count === 10)

  t.end()
})

test('CounterStore actions with condition', t => {
  // Creating a new store with an initial state { count: 0 }
  const CounterStore = new Store({ count: 0 }, 'Counter')

  // Setting a condition to prevent count from going below 0
  // and a special case for `SudoDecrement` action which can make count go below 0
  CounterStore.setCondition((state, actionType) => {
    if (state.count >= 0) {
      return state
    } else if (actionType === 'SudoDecrement') {
      return state
    }
  })

  // Implementing some actions to update the store
  const increment = () => CounterStore.set(prev => ({ count: prev.count + 1 }), 'Increment')
  const decrement = () => CounterStore.set(prev => ({ count: prev.count - 1 }), 'Decrement')
  const sudoDecrement = () => CounterStore.set(prev => ({ count: prev.count - 1 }), 'SudoDecrement')

  const replaceWithTen = () => CounterStore.replace(() => ({ count:  10 }), 'Replace with ten')

  CounterStore.reset()
  t.assert(CounterStore.get().count === 0)

  increment()
  t.assert(CounterStore.get().count === 1)

  decrement()
  t.assert(CounterStore.get().count === 0)

  // Making sure decrement can't go below 0
  decrement()
  t.assert(CounterStore.get().count === 0)

  // Special case for `SudoDecrement` actions which CAN go below 0
  sudoDecrement()
  t.assert(CounterStore.get().count === -1)

  replaceWithTen()
  t.assert(CounterStore.get().count === 10)

  t.end()
})
