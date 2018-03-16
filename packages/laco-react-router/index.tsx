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

export const push = (path: string) => {
  if (path !== RouterStore.get().pathname) {
    RouterStore.dispatch(history.push(path), 'PUSH')
  }
}
export const replace = (path: string) =>
  RouterStore.dispatch(history.replace(path), 'REPLACE')
export const go = (n: number) => RouterStore.dispatch(history.go(n), 'GO')
export const goBack = () => RouterStore.dispatch(history.goBack(), 'GO_BACK')
export const goForward = () =>
  RouterStore.dispatch(history.goForward(), 'GO_FORWARD')

import * as React from 'react'
import { Component, Children } from 'react'
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

  if (path == null) return {
    isExact: true,
    params: {},
    path: pathname,
    url: pathname
  }

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
    const { component, render, location } = this.props
    const children: any = this.props.children
    const match = this.computeMatch(this.props as any)
    const props = { match, location }

    if (component) return match ? component : null

    if (render) return match ? render(props) : null

    if (typeof children === 'function') return children(props)

    return null
  }
}

export class Switch extends Component<any, any> {
  render() {
    const { children, location } = this.props
    let match, child

    Children.forEach(children, element => {
      if (!match) {
        const { path: pathProp, exact, strict, sensitive, from } = (element as any).props
        const path = pathProp || from
  
        child = element
        match = matchPath(location, {
          path,
          exact,
          strict,
          sensitive,
        })
      }
    })

    return match ? React.cloneElement(child, { location, computedMatch: match }) : null
  }
}

import { createLocation } from 'history'

const isModifiedEvent = event =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

export class Link extends Component<any, any> {
  handleClick = event => {
    if (this.props.onClick) this.props.onClick(event);

    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore everything but left clicks
      !this.props.target && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault();

      const { replace, to } = this.props;

      if (replace) {
        replace(to);
      } else {
        push(to);
      }
    }
  };

  render() {
    const location = createLocation(this.props.to, null, null, history.location)
    const href = history.createHref(location);
    return <a {...this.props} href={href} onClick={this.handleClick}>{this.props.children}</a>
  }
}
