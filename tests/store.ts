import * as test from 'tape'
import { Store } from 'laco'

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
const increment = () => CounterStore.set({ count: CounterStore.get().count + 1 }, 'Increment')
const decrement = () => CounterStore.set({ count: CounterStore.get().count - 1 }, 'Decrement')
const sudoDecrement = () => CounterStore.set({ count: CounterStore.get().count - 1 }, 'SudoDecrement')

test('CounterStore actions with condition', (t) => {
  CounterStore.reset()
  t.assert(CounterStore.get().count === 0);

  increment()
  t.assert(CounterStore.get().count === 1);

  decrement()
  t.assert(CounterStore.get().count === 0);

  // Making sure decrement can't go below 0
  decrement()
  t.assert(CounterStore.get().count === 0);

  // Special case for `SudoDecrement` actions which CAN go below 0
  sudoDecrement()
  t.assert(CounterStore.get().count === -1);

  t.end()
})

const TestStore = new Store({ test: true })

test('Correct store index', (t) => {
  t.assert(CounterStore.idx === 0);
  t.assert(TestStore.idx === 1);
  t.end()
})

test('Correct store names', (t) => {
  t.assert(CounterStore.name === 'Counter');
  t.assert(TestStore.name === '');
  t.end()
})
