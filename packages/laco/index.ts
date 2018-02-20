// let jsanParse
let devTools
let persistedStore

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  console.log(`You're currently using a development version of Laco`)
  // jsanParse = require('jsan').parse
  if ((window as any).__REDUX_DEVTOOLS_EXTENSION__) {
    devTools = (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect()
    // const persistedStore = jsanParse(localStorage.getItem('__LACO__'))
    if (window.localStorage) {
      const content = localStorage.getItem('__LACO__')
      if (content) {
        persistedStore = JSON.parse(content)
        devTools.init(persistedStore)
      }
    }
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

  constructor(initialState: Object, name?: string) {
    if (name) this.name = name
    this.idx = COUNTER++
    STORE[this.idx] = initialState
    this.initialState = initialState

    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      if (devTools) {
        if (persistedStore) {
          STORE[this.idx] = persistedStore[this.idx]
        }

        devTools.subscribe(message => {
          switch (message.payload && message.payload.type) {
            case 'JUMP_TO_STATE':
            case 'JUMP_TO_ACTION':
              STORE[this.idx] = JSON.parse(message.state)[this.idx]
              this._listeners.forEach(fn => fn())
              break
            case 'PAUSE_RECORDING':
              if (window.localStorage) {
                localStorage.setItem('__LACO__', '')
              }
              location.reload()
          }
        })
      }
    }
  }

  get() {
    return STORE[this.idx]
  }

  set(state: Object | Function, info?: String) {
    STORE[this.idx] =
      typeof state === 'function'
        ? state(STORE[this.idx])
        : { ...STORE[this.idx], ...state }

    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      if (window.localStorage) {
        localStorage.setItem('__LACO__', JSON.stringify(STORE))
      }
      if (devTools) {
        devTools.send(this.name ? this.name + ' - ' + info : info, STORE)
      }
    }

    this._listeners.forEach(fn => fn())
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
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
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
