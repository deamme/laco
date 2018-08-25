import { Store } from 'laco'

// Creating a new store with an initial state { count: 0 }
export const CounterStore = new Store({ count: 0 }, 'Counter')

// Setting a condition to prevent count from going below 0 when `actionType` is `Decrement`
CounterStore.setCondition((state, actionType) => {
  if (state.count < 0 && actionType === "Decrement") {
    // Returning a falsy value will prevent the state from changing
    return false;
  }

  // For every other `actionTypes` such as `SudoDecrement` will change the state
  return state;
})

// Implementing some actions to update the store
export const increment = () => CounterStore.set((state) => ({ count: state.count + 1 }), 'Increment')
export const decrement = () => CounterStore.set((state) => ({ count: state.count - 1 }), 'Decrement')
export const sudoDecrement = () => CounterStore.set((state) => ({ count: state.count - 1 }), 'SudoDecrement')

