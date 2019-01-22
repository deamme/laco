import { PureComponent, useState, useEffect } from 'react'

export class Subscribe extends PureComponent<any, any> {
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
    this.forceUpdate()
  }

  render() {
    let stores = []

    const states = this.props.to.map(store => {
      store.unsubscribe(this.onUpdate)
      store.subscribe(this.onUpdate)

      stores.push(store)

      return store.get()
    })

    this.stores = stores
    return (this.props as any).children(...states)
  }
}

export function useStore(store) {
  const [state, setState] = useState(store.get())

  function updateState() {
    setState(store.get())
  }

  useEffect(() => {
    store.subscribe(updateState)
    return () => store.unsubscribe(updateState)
  })

  return state
}

export function useStores(stores: any[]) {
  const [state, setState] = useState(stores.map(store => store.get()))

  function updateState() {
    setState(stores.map(store => store.get()))
  }

  useEffect(() => {
    stores.map(store => store.subscribe(updateState))
    return () => stores.map(store => store.unsubscribe(updateState))
  })

  return state
}
