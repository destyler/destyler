const HASH_RE = /#.*$/
const HASH_OR_QUERY_RE = /[?#].*$/
const INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/
export const inBrowser = typeof document !== 'undefined'

export function isActive(currentPath: string, matchPath: string, asRegex = false) {
  if (matchPath === undefined) {
    return false
  }
  currentPath = normalize(`/${currentPath}`)
  if (asRegex) {
    return new RegExp(matchPath).test(currentPath)
  }
  if (normalize(matchPath) !== currentPath) {
    return false
  }
  const hashMatch = matchPath.match(HASH_RE)
  if (hashMatch) {
    return (inBrowser ? location.hash : '') === hashMatch[0]
  }
  return true
}

function normalize(path: string) {
  return decodeURI(path)
    .replace(HASH_OR_QUERY_RE, '')
    .replace(INDEX_OR_EXT_RE, '$1')
}
