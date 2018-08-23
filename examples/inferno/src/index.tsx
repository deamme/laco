import { render } from 'inferno'

import { Subscribe } from 'laco-inferno'

import {
  CounterStore,
  increment,
  decrement,
  sudoDecrement,
} from './stores/CounterStore'
import { ToggleStore, toggle } from './stores/ToggleStore'

const Counter = () => (
  <Subscribe to={[CounterStore, ToggleStore]}>
    {(counterState, toggleState) => (
      <div>
        <button onClick={decrement}>-</button>
        <span>{counterState.count}</span>
        <button onClick={increment}>+</button>
        <button onClick={sudoDecrement}>Go below zero</button>
        <p>Toggle state: {JSON.stringify(toggleState.toggle)}</p>
        <button onClick={toggle}>Toggle</button>
      </div>
    )}
  </Subscribe>
)

render(<Counter />, document.getElementById('root'))
