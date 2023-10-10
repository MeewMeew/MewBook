import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { v4 as uuidv4 } from 'uuid'

import { Logger } from "@/helpers/logger";
import { db } from "@/shared/firebase"
import type { Gender, IUser } from "@/types"

type PartialWithRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

interface GetUserOptions {
  id?: number
  uid?: string
  authid?: string
}

interface SetAvatarOptions {
  uid: number,
  attachment: string
}

interface CreateUserOptions {
  authid: string
  displayName: string
  email: string
  gender: Gender
  photoURL?: string
}

export class User {
  public static async get(options: PartialWithRequired<GetUserOptions, 'id'> | PartialWithRequired<GetUserOptions, 'uid'> | PartialWithRequired<GetUserOptions, 'authid'>) {
    try {
      if (!options.id && !options.uid && !options.authid) {
        return null
      }
      if (options.id || options.authid) {
        const userRef = collection(db, 'users')
        const condition = options.id ? where('id', '==', options.id) : where('authid', '==', options.authid)
        const userQuery = query(userRef, condition)
        const userSnap = await getDocs(userQuery)
        const firstUserDoc = userSnap.docs[0]
        if (!firstUserDoc?.exists()) {
          return null
        }
        return firstUserDoc.data() as IUser
      }
      if (options.uid) {
        const userRef = doc(db, 'users', options.uid)
        const user = await getDoc(userRef)
        if (!user.exists()) {
          return null
        }
        return user.data() as IUser
      }
    } catch (error) {
      Logger.error('Get user error', error)
      return null
    }
  }

  public static async getAll() {
    try {
      const userRef = collection(db, 'users')
      const userQuery = query(userRef)
      const userSnap = await getDocs(userQuery)
      const users = userSnap.docs.map(e => e.data()) as IUser[]
      return users
    } catch (error) {
      Logger.error('Get all user error', error)
      return []
    }
  }

  public static async create(options: CreateUserOptions) {
    const userData: IUser = {
      id: Date.now(),
      uid: uuidv4(),
      authid: options.authid,
      displayName: options.displayName,
      email: options.email,
      verified: false,
      photoURL: options.photoURL || '73e54044-c69f-405c-b0a5-7e42e8b52d03',
      coverURL: 'f483d5b2-b8a9-4c89-9e45-4448a7617293',
      gender: options.gender,
      isOnline: false,
      created_at: Date.now()
    }

    try {
      await setDoc(doc(db, 'users', userData.uid), userData)
      return userData
    } catch (error) {
      Logger.error('Create user error', error)
      return null
    }
  }

  public static async update(user: PartialWithRequired<IUser, 'authid'>): Promise<IUser> {
    const _user = (await this.get({ authid: user.authid }))!
    const update = { ..._user, ...user } as IUser
    await updateDoc(doc(db, 'users', _user.uid), update)
    return update
  }

  public static async setAvatar(options: SetAvatarOptions) {
    const user = await this.get({ id: options.uid })
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid), { photoURL: options.attachment })
  }

  public static async setCover(options: SetAvatarOptions) {
    const user = await this.get({ id: options.uid })
    if (!user) return
    await updateDoc(doc(db, 'users', user.uid), { coverURL: options.attachment })
  }
}