import { Component } from 'inferno'

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

      return store.get()
    })

    this.stores = stores
    return (this.props as any).children(...states)
  }
}
