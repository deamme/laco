import { Store } from 'laco'

// Creating a new store with an initial state { count: 0 }
export const CounterStore = new Store({ count: 0 }, 'Counter')

// Setting a condition to prevent count from going below 0
CounterStore.setCondition((state) => {
  if (state.count >= 0) {
    return state
  }
})

// Implementing some actions to update the store
export const increment = () => CounterStore.set({ count: CounterStore.get().count + 1 }, 'Increment')
export const decrement = () => CounterStore.set({ count: CounterStore.get().count - 1 }, 'Decrement')
