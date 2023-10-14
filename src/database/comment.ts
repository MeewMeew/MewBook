import { deleteDoc, doc, setDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

import { db } from '@/shared/firebase'
import type { IComment } from '@/types'

interface CreateCommentOptions {
  uid: number
  pid: number
  aid: number
  content: string
  attachment?: string
}

export class Comment {
  public static async create(options: CreateCommentOptions) {
    const commentRef = doc(db, 'comments', uuidv4())
    const commentData: IComment = {
      id: Date.now(),
      cid: commentRef.id,
      uid: options.uid,
      pid: options.pid,
      aid: options.aid,
      content: options.content,
      created_at: Date.now()
    }
    await setDoc(commentRef, commentData)
    return commentData
  }

  public static async delete(cid: string) {
    await deleteDoc(doc(db, 'comments', cid))
    return true
  }
}
