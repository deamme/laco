import { Subscribe } from 'laco-inferno'
import { Link } from 'laco-inferno-router'
import { CounterStore, increment, decrement, sudoDecrement } from '../stores/CounterStore'
import Test from './Test'

const Counter = () => (
  <Subscribe to={[CounterStore]}>
    {(state) => (
      <div>
        <button onclick={decrement}>-</button>
        <span>{state.count}</span>
        <button onclick={increment}>+</button>
        <button onclick={sudoDecrement}>Go below zero</button>
      </div>
    )}
  </Subscribe>
)

export default (
  <div>
    <h1>Home page</h1>
    <Counter />
    <Link to="/test" component={Test}>Link to Test page</Link>
    <div></div>
    <Link to="/404" component={Test}>Link to Error 404 No match page</Link>
  </div>
)
