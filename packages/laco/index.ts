let devTools

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  console.log(`You're currently using a development version of Laco`)
  if ((window as any).__REDUX_DEVTOOLS_EXTENSION__) {
    devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect()
    setTimeout(() => devTools.init(STORE), 200)
  }
}

let STORE = {}
let COUNTER = 0

export class Store {
  idx
  name = ''
  _listeners = []
  devTools
  initialState
  condition

  constructor(initialState: Object, name?: string) {
    if (name) this.name = name
    this.idx = COUNTER++
    STORE[this.idx] = initialState
    this.initialState = initialState

    if (
      typeof window !== 'undefined' &&
      process.env.NODE_ENV !== 'production'
    ) {
      if (devTools) {
        devTools.subscribe(message => {
          switch (message.payload && message.payload.type) {
            case 'JUMP_TO_STATE':
            case 'JUMP_TO_ACTION':
              STORE[this.idx] = JSON.parse(message.state)[this.idx]
              this._listeners.forEach(fn => fn())
          }
        })
      }
    }
  }

  get() {
    return STORE[this.idx]
  }

  set(state: Function, info?: String) {
    if (this.condition) {
      const newState = this.condition(
        { ...STORE[this.idx], ...state(STORE[this.idx]) },
        info
      )
      if (newState) STORE[this.idx] = newState
    } else {
      STORE[this.idx] = { ...STORE[this.idx], ...state(STORE[this.idx]) }
    }

    if (
      typeof window !== 'undefined' &&
      process.env.NODE_ENV !== 'production'
    ) {
      if (devTools) {
        devTools.send(this.name ? this.name + ' - ' + info : info, STORE)
      }
    }

    this._listeners.forEach(fn => fn())
  }

  replace(state: Function, info?: String) {
    if (this.condition) {
      const newState = this.condition(state(STORE[this.idx]), info)
      if (newState) STORE[this.idx] = newState
    } else {
      STORE[this.idx] = state(STORE[this.idx])
    }

    if (
      typeof window !== 'undefined' &&
      process.env.NODE_ENV !== 'production'
    ) {
      if (devTools) {
        devTools.send(this.name ? this.name + ' - ' + info : info, STORE)
      }
    }

    this._listeners.forEach(fn => fn())
  }

  setCondition(func: Function) {
    this.condition = func
  }

  reset() {
    STORE[this.idx] = this.initialState
  }

  subscribe(fn) {
    this._listeners.push(fn)
  }

  unsubscribe(fn) {
    this._listeners = this._listeners.filter(f => f !== fn)
  }

  dispatch(value: any, info: string) {
    if (
      typeof window !== 'undefined' &&
      process.env.NODE_ENV !== 'production'
    ) {
      if (devTools) {
        devTools.send(this.name ? this.name + ' - ' + info : info, STORE)
      }
    }
    return value
  }
}

export function dispatch(value: any, info: string) {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    if (devTools) {
      devTools.send(info, STORE)
    }
  }
  return value
}

export function getGlobalState() {
  return STORE
}

export function resetGlobalState() {
  STORE = {}
}

export function replaceGlobalState(state: Object) {
  STORE = state
}
