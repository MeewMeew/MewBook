const dev = import.meta.env.DEV

export class Logger {
  public static log(title: string, ...args: any[]) {
    const date = new Date()
    const time = date.toLocaleTimeString()
    if (dev) return console.log(`[${time}] ${title ? title + ': ' : ''}`, ...args)
  }

  public static error(...args: any[]) {
    const date = new Date()
    const time = date.toLocaleTimeString()
    if (dev) return console.error(`[${time}] ERROR`, ...args)
  }

  public static warn(...args: any[]) {
    const date = new Date()
    const time = date.toLocaleTimeString()
    if (dev) return console.warn(`[${time}] WARN`, ...args)
  }

  public static info(...args: any[]) {
    const date = new Date()
    const time = date.toLocaleTimeString()
    if (dev) return console.info(`[${time}] INFO`, ...args)
  }
}
