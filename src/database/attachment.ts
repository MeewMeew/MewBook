import { doc, getDoc, setDoc } from 'firebase/firestore'
import { v4 as uuidv4, validate as uuidValidate } from 'uuid'

import { Logger } from '@/helpers/logger'
import { mewSocket } from '@/helpers/socket'
import { db } from '@/shared/firebase'
import { type IAttachment, type IAttachmentItem, SEvent } from '@/types'

export class Attachment {
  public static async create(attachments: IAttachmentItem) {
    const attachmentData: IAttachment = {
      id: Date.now(),
      realid: uuidv4(),
      attachments: attachments,
      created_at: Date.now()
    }
    await setDoc(doc(db, 'attachments', attachmentData.realid), attachmentData)
    return attachmentData
  }

  public static async get(realid: string) {
    const data = (await getDoc(doc(db, 'attachments', realid))).data() as IAttachment
    return data
  }

  public static isID(id: string) {
    return uuidValidate(id)
  }

  public static async upload(attachment: File) {
    return new Promise<IAttachment>((resolve, reject) => {
      mewSocket.emit(SEvent.ATTACHMENT_UPLOAD, attachment, async ({ error, attachments }) => {
        if (error) return reject(error)
        Logger.info(`[${SEvent.ATTACHMENT_UPLOAD}] ${attachments.large}`)
        Attachment.create(attachments).then(resolve).catch(reject)
      })
    })
  }

  public static async image(id: string) {
    return new Promise<string>((resolve, reject) => {
      mewSocket.emit(SEvent.ATTACHMENT_GET, id, async (error) => {
        if (error) return reject(error)
        Logger.info(`[${SEvent.ATTACHMENT_GET}] ${id}`)
        return resolve(`${import.meta.env.VITE_API_URL}/a/${id}`)
      })
    })
  }

  public static blob<T>(dataURL: string): T {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mimeString }) as T;
  }
}