import { bold, green, yellow } from 'kolorist'

const LogManage = class {
  clients: any[]
  logs: any

  constructor() {
    this.clients = []
    this.logs = new Map()
  }

  getCurrDate() {
    const d = new Date()
    const str = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`
    return str.replace(new RegExp('(?<=\\/|-|\\.|:|\\b|T)\\d{1}(?=\\/|-|\\.|:|\\b|T)', 'g'), '0$&')
  }

  randomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padEnd(6, '0')}`
  }

  searchClient(client: any) {
    const { clients } = this
    return clients.find((item) => {
      return item.id === client
    })
  }

  printLog(client: any, ...msg: any[]) {
    const { clients, logs, getCurrDate, randomColor } = this
    const findClient = this.searchClient(client)
    if (findClient) {
      if (!logs.get(client))
        logs.set(client, [])
      const clientLogs = logs.get(client)
      const date = getCurrDate()
      clientLogs == null ? void 0 : clientLogs.push({ time: date, msg })
      console.log(`  ${green('➜')}  ${bold(yellow('Log Of Client'))}: ${JSON.stringify(msg)}`)
    }
    else {
      const color = randomColor()
      clients.push({ id: client, color })
      const date = getCurrDate()
      logs.set(client, [{ time: date, msg }])
      console.log(`  ${green('➜')}  ${bold(yellow('Log Of Client'))}: ${JSON.stringify(msg)}`)
    }
  }
}

export const logManage_default = new LogManage()
