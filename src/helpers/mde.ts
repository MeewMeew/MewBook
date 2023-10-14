let mapping = {} as Record<string, string[]>

const splitWithSpace = (s: string) => (s ? s.split(' ') : [])

const toArray = (a: any) => (Array.isArray(a) ? a : [a])

function parseTokens(tokens: any[]) {
  tokens.forEach((token) => {
    if (/(_open$|image)/.test(token!.type as any) && mapping[token.tag]) {
      const orig = splitWithSpace(token.attrGet('class'))
      const addition = toArray(mapping[token.tag])
      token.attrSet('class', [...orig, ...addition].join(' '))
    }
    if (token.children) {
      parseTokens(token.children)
    }
  })
}

function parseState(state: any) {
  parseTokens(state.tokens)
}

export function markdownitTagToClass(md: any, _mapping: any) {
  mapping = _mapping || {}
  md.core.ruler.push('markdownit-tag-to-class', parseState)
}
