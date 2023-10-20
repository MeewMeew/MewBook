import { useStorage } from '@vueuse/core'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { v4 as uuidv4, validate as uuidValidate } from 'uuid'

import { Logger } from '@/helpers/logger'
import { mewSocket } from '@/helpers/socket'
import { db } from '@/shared/firebase'
import { type IAttachment, type IAttachmentItem, SEvent } from '@/types'

export class Attachment {
  public static async create(attachments: IAttachmentItem) {
    const attachmentRef = doc(db, 'attachments', uuidv4())
    const attachmentData: IAttachment = {
      id: Date.now(),
      realid: attachmentRef.id,
      attachments: attachments,
      created_at: Date.now()
    }
    await setDoc(attachmentRef, attachmentData)
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

  public static async image(id: string, blur = false) {
    return new Promise<string>((resolve, reject) => {
      mewSocket.emit(SEvent.ATTACHMENT_GET, id, async (error) => {
        if (error) return reject(error)
        Logger.info(`[${SEvent.ATTACHMENT_GET}] ${id}`)
        return resolve(`${import.meta.env.VITE_API_URL}/a/${id}${blur ? '/blur' : ''}`)
      })
    })
  }

  public static async cacheImage(id: string, blur = false) {
    const cache = useStorage(`attachment-${id}-${blur}`, '')
    if (cache.value) return cache.value
    const image = await Attachment.image(id, blur)
    const base64 = await Attachment.base64(image)
    cache.value = base64
    return base64
    
  }

  public static blob<T>(dataURL: string): T {
    const byteString = atob(dataURL.split(',')[1])
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)
    return new Blob([ab], { type: mimeString }) as T
  }

  public static base64(url: string) {
    return new Promise<string>((resolve, reject) => {
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onloadend = () => {
            const base64data = reader.result
            resolve(base64data as string)
          }
        })
        .catch(reject)
    })
  }

  public static get defaultCover() {
    return `${
      import.meta.env.VITE_API_URL
    }/a/AgACAgUAAxkDAAO3ZRum6I6LUhYNvI0Pkij1_-mw8pUAAr67MRvgzMlU5_6ZmN8PV08BAAMCAAN3AAMwBA`
  }

  public static get defaultAvatar() {
    return `${
      import.meta.env.VITE_API_URL
    }/a/AgACAgUAAxkDAAOvZRrhkWFjIZVVKGmOEhMzAAG742KCAAKauDEb4x7YVP9gQRZHpGNUAQADAgADeQADMAQ`
  }
}
