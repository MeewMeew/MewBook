/* eslint-disable no-async-promise-executor */
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'
import { v4 as uuidv4, validate } from 'uuid'

import { Attachment, User } from '@/database'
import { Logger } from '@/helpers/logger'
import { db } from '@/shared/firebase'
import type { Conversation, InComingMessage, MessageType } from '@/types/messenger'

interface BuildMessageOptions {
  sid: InComingMessage['sid']
  cid: InComingMessage['cid']
  content?: InComingMessage['content']
  attachment?: InComingMessage['attachment']
  replyTo?: InComingMessage['replyTo']
  type: MessageType
  reactions?: InComingMessage['reactions']
}

export class Messenger {
  public static async get(id: string | number): Promise<Conversation[]> {
    try {
      if (typeof id === 'number') {
        const conversationsRef = collection(db, 'conversations')
        const conditions = where('participants', 'array-contains', id)
        const conversationsQuery = query(
          conversationsRef,
          conditions,
          orderBy('timestamp', 'desc'),
          limit(20)
        )
        const conversationsSnap = await getDocs(conversationsQuery)
        const conversations = conversationsSnap.docs.map((doc) => doc.data())
        return conversations as Conversation[]
      } else if (typeof id === 'string' && validate(id)) {
        const conversationRef = doc(db, 'conversations', id)
        const conversationSnap = await getDoc(conversationRef)
        const conversation = conversationSnap.data()
        if (!conversation) throw new Error('Cannot get conversation')
        return [conversation as Conversation]
      } else throw new Error('Invalid type')
    } catch (error) {
      Logger.error('Messenger', error)
      return []
    }
  }

  public static async getMessages(cid: string, _limit: number) {
    const messageRef = collection(db, 'conversations', cid, 'messages')
    const messageQuery = query(messageRef, orderBy('timestamp', 'desc'), limit(_limit))
    const messageSnap = await getDocs(messageQuery)
    const messages = messageSnap.docs.map((doc) => doc.data())
    return messages as InComingMessage[]
  }

  public static async create(participants: number[]) {
    try {
      const conversationRef = doc(db, 'conversations', uuidv4())
      const conversation: Omit<Conversation, 'messages'> = {
        id: conversationRef.id,
        participants,
        notification: true,
        seen: false,
        theme: '#0084FF',
        timestamp: Date.now()
      }
      await setDoc(conversationRef, conversation)

      return { ...conversation, messages: [] } as Conversation
    } catch (error) {
      Logger.error('Messenger', error)
      return null
    }
  }

  public static async fill(conversation: Conversation, uid: number) {
    const participants = []
    for (const _id of conversation.participants) {
      const user = await User.get({ id: _id as number })
      if (user) {
        if (Attachment.isID(user.photoURL)) {
          const attachment = await Attachment.get(user.photoURL)
          user.photoURL = await Attachment.cacheImage(attachment.attachments.medium)

          if (user.id !== uid) {
            conversation!.info = {
              name: user.displayName,
              avatar: user.photoURL,
              id: user.id
            }
          }
        }
        participants.push(user)
      }
    }
    conversation.participants = participants
    return conversation
  }

  public static async update(id: string, conversation: Partial<Conversation>) {
    try {
      const conversationRef = doc(db, 'conversations', id)
      await setDoc(conversationRef, conversation, { merge: true })
      return true
    } catch (error) {
      Logger.error('Messenger', error)
      return false
    }
  }

  public static async insertMessage(cid: string, message: any) {
    const messageRef = collection(db, 'conversations', cid, 'messages')
    await addDoc(messageRef, message)
  }

  public static async updateMessage(cid: string, mid: string, data: any) {
    const messageRef = doc(db, 'conversations', cid, 'messages', mid)
    await updateDoc(messageRef, data)
  }

  public static build(options: BuildMessageOptions) {
    const messageRef = doc(db, 'conversations', options.cid, 'messages', uuidv4())
    const incomingMessage: InComingMessage = {
      id: messageRef.id,
      sid: options.sid,
      cid: options.cid,
      content: options.content || '',
      replyTo: options.replyTo || '',
      timestamp: Date.now(),
      type: options.type,
      reactions: options.reactions || {
        like: 0,
        love: 0,
        care: 0,
        haha: 0,
        wow: 0,
        sad: 0,
        angry: 0
      }
    }
    if (options.attachment) incomingMessage.attachment = options.attachment
    return incomingMessage
  }
}
