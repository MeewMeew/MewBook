import { Socket } from "socket.io-client";

import { type IAttachmentItem,type IComment, type IFriendEvent, type INotification,type IReaction, SEvent } from "@/types";

type CallbackAttachmentUpload = (result: { error: unknown, attachments: IAttachmentItem }) => void
type CallbackAttachmentGet = (error: unknown) => void

export interface ServerToClientEvents {
  [SEvent.NOTIFICATION_CREATE]: (notification: INotification) => void
  [SEvent.NOTIFICATION_REMOVE]: (notification: INotification) => void
  [SEvent.NOTIFICATION_UPDATE]: (notification: INotification) => void
  [SEvent.NOTIFICATION_READ]: (notification: INotification) => void

  [SEvent.FRIEND_ONLINE]: (userID: number) => void
  [SEvent.FRIEND_OFFLINE]: (userID: number) => void
}

export interface ClientToServerEvents {
  [SEvent.SOCKET_CONNECT]: () => void
  [SEvent.SOCKET_DISCONNECT]: () => void

  [SEvent.USER_ONLINE]: (userID: number) => void
  [SEvent.USER_OFFLINE]: (userID: number) => void

  [SEvent.POST_COMMENT_ADD]: (comment: IComment) => void
  [SEvent.POST_COMMENT_REMOVE]: (comment: IComment) => void

  [SEvent.POST_REACTION_ADD]: (reaction: IReaction) => void
  [SEvent.POST_REACTION_UPDATE]: (reaction: IReaction) => void
  [SEvent.POST_REACTION_REMOVE]: (reaction: IReaction) => void

  [SEvent.FRIEND_REQUEST]: (event: IFriendEvent) => void
  [SEvent.FRIEND_ACCEPT]: (event: IFriendEvent) => void
  [SEvent.FRIEND_REMOVE]: (event: IFriendEvent) => void
  [SEvent.FRIEND_REJECT]: (event: IFriendEvent) => void
  [SEvent.FRIEND_CANCEL]: (event: IFriendEvent) => void
  [SEvent.FRIEND_RECEIVE]: (event: IFriendEvent) => void

  [SEvent.ATTACHMENT_UPLOAD]: (attachment: File, callback: CallbackAttachmentUpload) => void
  [SEvent.ATTACHMENT_REMOVE]: (attachment_id: string) => void
  [SEvent.ATTACHMENT_GET]: (attachment_id: string, callback: CallbackAttachmentGet) => void

}

export type SocketClient = Socket<ServerToClientEvents, ClientToServerEvents>