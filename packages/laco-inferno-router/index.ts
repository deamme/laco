import createHistory from 'history/createBrowserHistory'
import { Store } from 'laco'

const history = createHistory()

export const RouterStore = new Store(
  {
    pathname: history.location.pathname,
    search: history.location.search,
    hash: history.location.hash,
  },
  'Router',
)

history.listen(location => {
  RouterStore.set(
    {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
    },
    'Location change',
  )
})

export const push = (path: string) => RouterStore.dispatch(history.push(path), 'PUSH')
export const replace = (path: string) => RouterStore.dispatch(history.replace(path), 'REPLACE')
export const go = (n: number) => RouterStore.dispatch(history.go(n), 'GO')
export const goBack = () => RouterStore.dispatch(history.goBack(), 'GO_BACK')
export const goForward = () => RouterStore.dispatch(history.goForward(), 'GO_FORWARD')

import { Component } from 'inferno'
import * as pathToRegexp from 'path-to-regexp'

const patternCache = {}
const cacheLimit = 10000
let cacheCount = 0

const compilePath = (pattern, options) => {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`
  const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {})

  if (cache[pattern]) return cache[pattern]

  const keys = []
  const re = pathToRegexp(pattern, keys, options)
  const compiledPattern = { re, keys }

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern
    cacheCount++
  }

  return compiledPattern
}

const matchPath = (pathname, options) => {
  const { path, exact = false, strict = false, sensitive = false } = options

  const { re, keys } = compilePath(path, { end: exact, strict, sensitive })
  const match = re.exec(pathname)

  if (!match) return null

  const [url, ...values] = match
  const isExact = pathname === url

  if (exact && !isExact) return null

  return {
    path, // the path pattern used to match
    url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
    isExact, // whether or not we matched exactly
    params: keys.reduce((memo, key, index) => {
      memo[key.name] = values[index]
      return memo
    }, {}),
  }
}

export class Route extends Component<any, any> {
  computeMatch({ computedMatch, location, path, strict, exact, sensitive }) {
    if (computedMatch) return computedMatch // <Switch> already computed the match for us

    return matchPath(location, { path, strict, exact, sensitive })
  }

  render() {
    const { children, component, render, location } = this.props
    const match = this.computeMatch(this.props)
    const props = { match, location }

    if (component) return match ? component : null;

    if (render) return match ? render(props) : null;

    if (typeof children === "function") return children(props);

    return null
  }
}
