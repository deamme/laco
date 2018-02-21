import createHistory from "history/createBrowserHistory"
import { Store } from 'laco'

const history = createHistory()

export const RouterStore = new Store({
  pathname: history.location.pathname,
  search: history.location.search,
  hash: history.location.hash,
}, 'Router')

history.listen((location) => {
  RouterStore.set({
    pathname: location.pathname,
    search: location.search,
    hash: location.hash,
  }, 'Location change')
})

export const push = (path: string) => RouterStore.dispatch(history.push(path), 'PUSH')
export const replace = (path: string) => RouterStore.dispatch(history.replace(path), 'REPLACE')
export const go = (n: number) => RouterStore.dispatch(history.go(n), 'GO')
export const goBack = () => RouterStore.dispatch(history.goBack(), 'GO_BACK')
export const goForward = () => RouterStore.dispatch(history.goForward(), 'GO_FORWARD')
