import { Store } from 'laco'

export const ToggleStore = new Store({ toggle: false })

export const toggle = () => ToggleStore.set(({ toggle }) => ({ toggle: !toggle }), 'Toggle')
