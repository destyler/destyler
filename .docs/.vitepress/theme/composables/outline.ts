interface Header {
  /**
   * The level of the header
   *
   * `1` to `6` for `<h1>` to `<h6>`
   */
  level: number
  /**
   * The title of the header
   */
  title: string
  /**
   * The slug of the header
   *
   * Typically the `id` attr of the header anchor
   */
  slug: string
  /**
   * Link of the header
   *
   * Typically using `#${slug}` as the anchor hash
   */
  link: string
  /**
   * The children of the header
   */
  children: Header[]
}

export type MenuItem = Omit<Header, 'slug' | 'children'> & {
  element: HTMLHeadElement
  children?: MenuItem[]
}

const resolvedHeaders: { element: HTMLHeadElement, link: string }[] = []

export function getHeaders() {
  const headers = Array.from(
    document.querySelectorAll('.Doc :where(h1,h2,h3,h4,h5,h6)'),
  )
    .filter(el => el.id && el.hasChildNodes())
    .map((el) => {
      const level = Number(el.tagName[1])
      return {
        element: el as HTMLHeadElement,
        title: serializeHeader(el),
        link: `#${el.id}`,
        level,
      }
    })

  return resolveHeaders(headers)
}

function serializeHeader(h: Element): string {
  let ret = ''
  for (const node of h.childNodes) {
    if (node.nodeType === 1) {
      if (
        (node as Element).classList.contains('VPBadge')
        || (node as Element).classList.contains('header-anchor')
        || (node as Element).classList.contains('ignore-header')
      ) {
        continue
      }

      ret += node.textContent
    }
    else if (node.nodeType === 3) {
      ret += node.textContent
    }
  }
  return ret.trim()
}

export function resolveHeaders(
  headers: MenuItem[],
): MenuItem[] {
  const [high, low]: [number, number] = [2, 6]

  headers = headers.filter(h => h.level >= high && h.level <= low)
  resolvedHeaders.length = 0

  for (const { element, link } of headers)
    resolvedHeaders.push({ element, link })

  const ret: MenuItem[] = []

  for (let i = 0; i < headers.length; i++) {
    const cur = headers[i]

    if (i === 0) {
      ret.push(cur)
    }
    else {
      let j = i - 1

      while (j >= 0) {
        const prev = headers[j]

        if (prev.level < cur.level) {
          (prev.children || (prev.children = [])).push(cur)
          break
        }

        j--
      }

      if (j < 0)
        ret.push(cur)
    }
  }

  return ret
}
