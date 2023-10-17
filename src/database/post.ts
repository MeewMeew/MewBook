/* eslint-disable no-async-promise-executor */
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where
} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

import { Attachment, User } from '@/database'
import { Logger } from '@/helpers/logger'
import { db } from '@/shared/firebase'
import { Gender, type IPost, Privacy } from '@/types'

type PartialWithRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>

interface GetPostOptions {
  id: number
  pid: string
}

interface GetAllPostOptions {
  limit: number
  uid?: number
  order: 'asc' | 'desc'
  sort: 'id' | 'created_at'
  attachment?: boolean
  privacyMode?: Privacy[]
}

interface CreatePostOptions {
  uid: number
  content: string
  attachment?: File
  privacy?: Privacy
  gender?: Gender
  isNormalPost?: boolean
  isProfilePhoto?: boolean
  isCoverPhoto?: boolean
}

export class Post {
  public static async get(
    options: PartialWithRequired<GetPostOptions, 'pid'> | PartialWithRequired<GetPostOptions, 'id'>
  ) {
    try {
      if (!options.pid && !options.id) {
        return null
      }
      if (options.pid) {
        const postSnap = await getDoc(doc(db, 'posts', options.pid))
        if (!postSnap.exists()) return null
        const post = postSnap.data() as IPost
        if (Attachment.isID(post.attachment as string)) {
          const a = await Attachment.get(post.attachment as string)
          post.attachment = a.attachments
        }
        return post
      } else if (options.id) {
        const postRef = collection(db, 'posts')
        const postQuery = query(postRef, where('id', '==', options.id))
        const postSnap = await getDocs(postQuery)
        const firstPostDoc = postSnap.docs[0]
        if (!firstPostDoc?.exists()) return null
        const post = firstPostDoc.data() as IPost
        if (Attachment.isID(post.attachment as string)) {
          const a = await Attachment.get(post.attachment as string)
          post.attachment = a.attachments
        }
        return post
      }
    } catch (error) {
      Logger.error('Get post error', error)
      return null
    }
  }

  public static async getAll(options: GetAllPostOptions) {
    try {
      const postRef = collection(db, 'posts')
      const _limit = limit(options.limit)
      const _orderBy = orderBy(options.sort, options.order)
      const _attachment = options.attachment ? orderBy('attachment') : null
      const _uid = options.uid ? where('uid', '==', options.uid) : null
      const _privacyMode = where('privacy', 'in', [
        ...new Set([...(options.privacyMode || []), Privacy.PUBLIC])
      ])
      const conditions = [_uid, _privacyMode, _orderBy, _attachment, _limit] as any[]
      const queryWith = query(postRef, ...conditions.filter((e) => e !== null))

      const postSnap = await getDocs(queryWith)
      const posts = postSnap.docs.map((e) => e.data()) as IPost[]
      for (const post of posts) {
        if (Attachment.isID(post.attachment as string)) {
          const a = await Attachment.get(post.attachment as string)
          post.attachment = a.attachments
        }
      }
      return posts
    } catch (error) {
      Logger.error('Get all post error', error)
      return []
    }
  }

  public static create(options: CreatePostOptions) {
    return new Promise<IPost>(async (resolve, reject) => {
      const postRef = doc(db, 'posts', uuidv4())
      const post: IPost = {
        id: Date.now(),
        pid: postRef.id,
        uid: options.uid,
        content: options.content,
        attachment: '',
        privacy: options.privacy || Privacy.PUBLIC,
        created_at: Date.now(),
        isCoverPhoto: options.isCoverPhoto || false,
        isNormalPost: options.isNormalPost || false,
        isProfilePhoto: options.isProfilePhoto || false
      }

      try {
        if (options.attachment) {
          const gender =
            options.gender === Gender.MALE
              ? 'anh ấy'
              : options.gender === Gender.FEMALE
                ? 'cô ấy'
                : 'họ'
          const attachment = await Attachment.upload(options.attachment)
          post.attachment = attachment.realid

          if (options.isProfilePhoto) {
            await User.setAvatar({
              uid: options.uid,
              attachment: attachment.realid
            })

            post.content = 'đã cập nhật ảnh đại diện của ' + gender
          }

          if (options.isCoverPhoto) {
            await User.setCover({
              uid: options.uid,
              attachment: attachment.realid
            })

            post.content = 'đã cập nhật ảnh bìa của ' + gender
          }
        }

        await setDoc(postRef, post)
        return resolve(post)
      } catch (error) {
        Logger.error('Create post error', error)
        return reject(error)
      }
    })
  }

  public static async delete(pid: string) {
    await deleteDoc(doc(db, 'posts', pid))
  }
}
