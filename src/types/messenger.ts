import { type IUser, ReactionType } from '@/types'

export interface InComingMessage {
  id: string
  sid: number
  cid: string
  content: string
  replyTo?: string
  attachment?: {
    name: string
    size: number
    url: string
  }
  timestamp: number
  type: 'text' | 'emoji' | 'image' | 'attachment' | 'sticker' | 'unsend' | 'replied' | 'boardcast'
  reactions: {
    [key in ReactionType]: number
  }
}

export type MessageType = InComingMessage['type']

export interface Conversation {
  id: string
  participants: (IUser | number)[]
  notification: boolean
  seen: boolean
  messages: InComingMessage[]
  info?: {
    id: number
    name: string
    avatar: string
  }
  theme: HexType
  timestamp: number
}

export type HexType = `#${string}`
