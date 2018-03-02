import * as React from 'react'
import { Subscribe } from 'laco-react'
import { Link } from 'laco-react-router'
import { CounterStore, increment, decrement } from '../stores/CounterStore'
import Test from './Test'

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

export default (
  <div>
    <h1>Home page</h1>
    <Counter />
    <Link to="/test" component={Test}>Link to Test page</Link>
    <div></div>
    <Link to="/404" component={Test}>Link to Error 404 No match page</Link>
  </div>
)
