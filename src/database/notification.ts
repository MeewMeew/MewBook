import {
  collection,
  doc,
  type DocumentData,
  getDocs,
  limit,
  orderBy,
  Query,
  query,
  updateDoc,
  where
} from 'firebase/firestore'
import _ from 'lodash'

import { Logger } from '@/helpers/logger'
import { db } from '@/shared/firebase'
import type { INotification } from '@/types'

interface GetAllNotificationOptions {
  limit: number
  aid?: number
  order: 'asc' | 'desc'
  sort: 'id' | 'created_at'
}

export class Notification {
  public static async read(nid: string) {
    await updateDoc(doc(db, 'notifications', nid), { read: true })
  }
  public static async readAll(id: number) {
    const notiRef = collection(db, 'notifications')
    const notiQuery = query(notiRef, where('aid', '==', id))
    const notiSnap = await getDocs(notiQuery)
    _.each(notiSnap.docs, async (d) => {
      if (d.data().read) return
      await updateDoc(doc(db, 'notifications', d.id), { read: true })
    })
  }
  public static async getAll(options: GetAllNotificationOptions) {
    try {
      const notiRef = collection(db, 'notifications')
      let queryWith: Query<DocumentData, DocumentData>
      if (options.aid) {
        queryWith = query(
          notiRef,
          where('aid', '==', options.aid),
          limit(options.limit),
          orderBy(options.sort, options.order)
        )
      } else {
        queryWith = query(notiRef, limit(options.limit), orderBy(options.sort, options.order))
      }

      const notiSnap = await getDocs(queryWith)
      const notis = notiSnap.docs.map((e) => e.data()) as INotification[]
      return notis
    } catch (error) {
      Logger.error('Get all notification error', error)
      return []
    }
  }
}
