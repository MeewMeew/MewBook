import MarkdownIt from 'markdown-it'
import emoji from 'markdown-it-emoji'

import { markdownitTagToClass } from '@/helpers/mde'
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  xhtmlOut: true
})

md.use(markdownitTagToClass, {
  a: ['decoration-1', 'text-mb-blue']
})

md.use(emoji)

export function formatContentBreakLine(content: string) {
  return content.replace(/\\n/g, '<br>')
}

export function formatContentContainURL(content: string) {
  const regex = /(https?:\/\/[^\s]+)/g
  return content.replace(regex, '<a href="$1" target="_blank" class="text-mb-blue">$1</a>')
}

export function formatContent(content: string) {
  return md.render(content)
}
