
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

import { db } from '@/shared/firebase'
import { FriendEventType, type IFriend, type IFriendEvent } from '@/types'

export class Friend {
  public static async create(uid: number) {
    const friendData: IFriend = {
      id: Date.now(),
      fid: uuidv4(),
      uid: uid,
      friends: [],
      received: [],
      requested: [],
      created_at: Date.now()
    }

    await setDoc(doc(db, 'friends', friendData.fid), friendData)
    return friendData
  }

  public static async get(fid: string) {
    return (await getDoc(doc(db, 'friends', fid))).data() as IFriend
  }

  public static async getByUID(uid: number) {
    const friendRef = collection(db, 'friends')
    const friendQuery = query(friendRef, where('uid', '==', uid))
    const friendSnap = await getDocs(friendQuery)
    const firstFriendDoc = friendSnap.docs[0]
    if (!firstFriendDoc?.exists()) return null
    const friend = firstFriendDoc.data() as IFriend
    return friend
  }

  public static async add(uid: number, fid: number): Promise<IFriendEvent | null> {
    const cuser = await this.getByUID(uid)
    const user = await this.getByUID(fid)

    if (!cuser || !user) return null

    cuser.requested = [...new Set([...cuser.requested, user.uid.toString()])]
    user.received = [...new Set([...user.received, cuser.uid.toString()])]

    await setDoc(doc(db, 'friends', cuser.fid), cuser)
    await setDoc(doc(db, 'friends', user.fid), user)
    return {
      id: Date.now(),
      uid: cuser.uid,
      aid: cuser.uid,
      fid: user.uid,
      type: FriendEventType.FRIEND_REQUEST,
      created_at: Date.now()
    }
  }

  public static async remove(uid: number, fid: number): Promise<IFriendEvent | null> {
    const cuser = await this.getByUID(uid)
    const user = await this.getByUID(fid)

    if (!cuser || !user) return null

    cuser.friends = cuser.friends.filter((friend) => friend !== user.uid.toString())
    user.friends = user.friends.filter((friend) => friend !== cuser.uid.toString())

    await setDoc(doc(db, 'friends', cuser.fid), cuser)
    await setDoc(doc(db, 'friends', user.fid), user)
    return {
      id: Date.now(),
      uid: cuser.uid,
      aid: cuser.uid,
      fid: user.uid,
      type: FriendEventType.FRIEND_REMOVE,
      created_at: Date.now()
    }
  }

  public static async accept(uid: number, fid: number): Promise<IFriendEvent | null> {
    const cuser = await this.getByUID(uid)
    const user = await this.getByUID(fid)

    if (!cuser || !user) return null

    cuser.friends = [...new Set([...cuser.friends, user.uid.toString()])]
    user.friends = [...new Set([...user.friends, cuser.uid.toString()])]

    cuser.received = cuser.received.filter((friend) => friend !== user.uid.toString())
    user.requested = user.requested.filter((friend) => friend !== cuser.uid.toString())

    await setDoc(doc(db, 'friends', cuser.fid), cuser)
    await setDoc(doc(db, 'friends', user.fid), user)
    return {
      id: Date.now(),
      uid: cuser.uid,
      aid: cuser.uid,
      fid: user.uid,
      type: FriendEventType.FRIEND_ACCEPT,
      created_at: Date.now()
    }
  }

  public static async reject(uid: number, fid: number): Promise<IFriendEvent | null> {
    const cuser = await this.getByUID(uid)
    const user = await this.getByUID(fid)

    if (!cuser || !user) return null

    cuser.received = cuser.received.filter((friend) => friend !== user.uid.toString())
    user.requested = user.requested.filter((friend) => friend !== cuser.uid.toString())

    await setDoc(doc(db, 'friends', cuser.fid), cuser)
    await setDoc(doc(db, 'friends', user.fid), user)
    return {
      id: Date.now(),
      uid: cuser.uid,
      aid: cuser.uid,
      fid: user.uid,
      type: FriendEventType.FRIEND_REJECT,
      created_at: Date.now()
    }
  }

  public static async cancel(uid: number, fid: number): Promise<IFriendEvent | null> {
    const cuser = await this.getByUID(uid)
    const user = await this.getByUID(fid)

    if (!cuser || !user) return null

    cuser.requested = cuser.requested.filter((friend) => friend !== user.uid.toString())
    user.received = user.received.filter((friend) => friend !== cuser.uid.toString())

    await setDoc(doc(db, 'friends', cuser.fid), cuser)
    await setDoc(doc(db, 'friends', user.fid), user)
    return {
      id: Date.now(),
      uid: cuser.uid,
      aid: cuser.uid,
      fid: user.uid,
      type: FriendEventType.FRIEND_CANCEL,
      created_at: Date.now()
    }
  }

  public static async isFriend(uid: number, fid: number) {
    const cuser = await this.getByUID(uid)
    const user = await this.getByUID(fid)

    if (!cuser || !user) return false

    return cuser.friends.includes(user.uid.toString()) && user.friends.includes(cuser.uid.toString())
  }
}