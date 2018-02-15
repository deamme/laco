export let Component

try {
  Component = require("inferno").Component
} catch (error) { /* Fail silent */ }
try {
  Component = require("react").Component
} catch (error) { /* Fail silent */ }

if (!Component) {
  throw 'Please require Inferno or React'
}

if (process.env.NODE_ENV !== 'production') {
  console.error(`You're currently using a development version of Laco`)
}

let STORE = {}
let COUNTER = 0

if (process.env.NODE_ENV !== 'production') {
  if ((window as any).__REDUX_DEVTOOLS_EXTENSION__) {
    (window as any).__LACO_TOOLS__ = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect()
  }
}

export class Store {
  idx
  name = ''
  _listeners = []
  devTools

  constructor(initialState: Object, name?: string) {
    if (name) this.name = name
    this.idx = COUNTER++
    STORE[this.idx] = initialState
  }
  
  getGlobalStore() {
    return STORE
  }

  getState() {
    return STORE[this.idx]
  }

  setState(state: Object | Function, info?: String) {
    STORE[this.idx] = typeof state === 'function'
      ? state(STORE[this.idx])
      : { ...STORE[this.idx], ...state }

    if (process.env.NODE_ENV !== 'production') {
      if ((window as any).__LACO_TOOLS__) {
        (window as any).__LACO_TOOLS__.send(
          this.name ? this.name + ' - ' + info : info,
          STORE
        )
      }
    }

    this._listeners.forEach(fn => fn())
  }

  subscribe(fn) {
    this._listeners.push(fn)
  }

  unsubscribe(fn) {
    this._listeners = this._listeners.filter(f => f !== fn)
  }
}

export class Subscribe extends Component<any, any> {
  stores = []

  componentWillReceiveProps() {
    this._unsubscribe()
  }

  componentWillUnmount() {
    this._unsubscribe()
  }

  _unsubscribe() {
    this.stores.forEach(store => {
      store.unsubscribe(this.onUpdate)
    })
  }

  onUpdate = () => {
    this.setState({})
  }

  render() {
    let stores = []

    const states = this.props.to.map(store => {
      store.unsubscribe(this.onUpdate)
      store.subscribe(this.onUpdate)
      
      stores.push(store)

      return store.getState()
    })

    this.stores = stores
    return (this.props as any).children(...states)
  }
}
