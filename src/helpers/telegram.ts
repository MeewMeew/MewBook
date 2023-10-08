import type { Ref } from "vue";

import { Attachment } from "@/database/attachment";
import type { IAttachment, IAttachmentItem, IAttachmentStore } from "@/types";

import { mewSocket } from "./socket";

interface UploadImageOptions {
  attachment: File;
}

export class TelegramService {
  public static uploadImage(options: UploadImageOptions) {
    return new Promise<IAttachment>((resolve, reject) => {
      mewSocket.emit('upload-attachment', options.attachment, options.attachment.type.replace('/', '.'), (err: any, attachments: IAttachmentItem) => {
        if (err) return reject(err)
        Attachment.create(attachments).then(resolve).catch(reject)
      })
    })
  }

  public static getImage(key: string, store: Ref<IAttachmentStore[]>) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<string>(async(resolve, reject) => {
      if (store.value.some(e => e.id === key)) return resolve(store.value.find(e => e.id === key)!.attachment)
      mewSocket.emit('get-attachment', key, async(error: unknown, base: string) => {
        if (error) return reject(error)
        store.value.push({ id: key, attachment: base })
        return resolve(base)
      })
    })
  }

  public static toBlob(dataURL: string): Blob {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mimeString });
  }

  public static async toBlobURL(base64URL: string) {
    const res = await fetch(base64URL);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }
}