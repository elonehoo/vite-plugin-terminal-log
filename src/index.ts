import type { PluginOption } from 'vite'
import { gen } from './newConsole'
import { logManage_default } from './logManage'
import { __async } from './utils'

export default function TerminalLog(): PluginOption {
  return {
    name: 'vite-plugin-terminal-log',
    enforce: 'pre',
    configureServer(server: any) {
      server.ws.on('my:from-client', (data: any) => {
        logManage_default.printLog(data.client, ...data.msg)
      })
      server.middlewares.use((req: any, res: any, next: any) => {
        const start = Date.now()
        res.on('finish', () => {
          if (req.url === '/offer') {
            const duration = Date.now() - start
            console.log(`[${req.method}] ${req.url} - ${res.statusCode} (${duration}ms)`)
            console.log('Response:', res.statusMessage)
          }
        })
        next()
      })
    },
    handleHotUpdate(ctx: any): void {
      __async(this, null, function* () {
        const { file } = ctx
        const url = `http://localhost:3000/${file}`
        console.log(`Sending request to ${url}...`)
      })
    },
    transform(code: any, id: any) {
      if (id.endsWith('.ts') && id.includes('/main.ts')) {
        const appendCode = gen()
        return code + appendCode
      }
      return code
    },
  }
}
