import * as test from 'tape'
import { CounterStore, increment, decrement } from '../stores/CounterStore'

test('Counter Store', (t) => {
  CounterStore.reset()
  t.assert(CounterStore.get().count === 0);

  increment()
  t.assert(CounterStore.get().count === 1);

  decrement()
  t.assert(CounterStore.get().count === 0);

  t.end()
})
