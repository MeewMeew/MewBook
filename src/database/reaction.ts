import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'

import { mewSocket } from '@/helpers/socket'
import { db } from '@/shared/firebase'
import { type IReaction, type IUser, type ReactionType, SEvent } from '@/types'

interface UpdateReactionOptions {
  pid: number
  aid: number
  type: ReactionType
  reactions: IReaction[]
  user: IUser
  default?: boolean
}

export class Reaction {
  public static async update(options: UpdateReactionOptions) {
    const reactionData: IReaction = {
      id: Date.now(),
      rid: uuidv4(),
      uid: options.user.id,
      pid: options.pid,
      aid: options.aid,
      type: options.type,
      created_at: Date.now()
    }

    const reaction = await this.getByUID(options.pid, options.user.id)

    if (reaction) {
      reactionData.id = reaction.id
      reactionData.rid = reaction.rid
      reactionData.created_at = reaction.created_at

      if (options.default) {
        await deleteDoc(doc(db, 'reactions', reaction.rid))
        options.reactions = _.filter(
          options.reactions,
          (reaction) => reaction.rid !== reactionData.rid
        )
        mewSocket.emit(SEvent.POST_REACTION_REMOVE, reactionData)
      } else {
        await setDoc(doc(db, 'reactions', reaction.rid), reactionData)
        options.reactions = _.map(options.reactions, (reaction) =>
          reaction.rid === reactionData.rid ? reactionData : reaction
        )
        mewSocket.emit(SEvent.POST_REACTION_UPDATE, reactionData)
      }
    } else {
      await setDoc(doc(db, 'reactions', reactionData.rid), reactionData)
      options.reactions = [...options.reactions, reactionData]
      mewSocket.emit(SEvent.POST_REACTION_ADD, reactionData)
    }

    return {
      reactions: options.reactions,
      top: this.top(options.reactions),
      reaction: reactionData
    }
  }

  public static async getByPost(pid: number) {
    const reactionsRef = collection(db, 'reactions')
    const reactionsQuery = query(reactionsRef, where('pid', '==', pid))
    const reactionsSnap = await getDocs(reactionsQuery)
    const reactions: IReaction[] = []
    reactionsSnap.docs.forEach((reaction) => reactions.push(reaction.data() as IReaction))
    return reactions
  }

  public static async getByUID(pid: number, uid: number) {
    const reactionsRef = collection(db, 'reactions')
    const reactionsQuery = query(reactionsRef, where('pid', '==', pid), where('uid', '==', uid))
    const reactionsSnap = await getDocs(reactionsQuery)
    const reactions: IReaction[] = []
    reactionsSnap.docs.forEach((reaction) => reactions.push(reaction.data() as IReaction))
    return reactions[0]
  }

  public static top(reactions: IReaction[], top: number = 3) {
    return _.map(
      _.take(
        _.orderBy(
          _.map(_.countBy(reactions, 'type'), (count, type) => ({ type, count })),
          'count',
          'desc'
        ),
        top
      ),
      (value) => value.type
    ) as ReactionType[]
  }
}
