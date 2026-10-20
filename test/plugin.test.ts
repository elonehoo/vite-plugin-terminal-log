import { describe, expect, it, vi } from 'vitest'
import TerminalLog from '../src'

describe('terminal log plugin', () => {
  it('injects the client bridge into the TypeScript entry point only', () => {
    const plugin: any = TerminalLog()
    expect(plugin.name).toBe('vite-plugin-terminal-log')
    expect(plugin.enforce).toBe('pre')
    const source = 'const example = 1\n'
    const transformed = plugin.transform(source, '/src/main.ts')
    expect(transformed.startsWith(source)).toBe(true)
    expect(transformed.length).toBeGreaterThan(source.length)
    expect(transformed).toContain('my:from-client')
    expect(plugin.transform(source, '/src/other.ts')).toBe(source)
    expect(plugin.transform(source, '/src/main.js')).toBe(source)
  })

  it('registers the websocket handler and non-blocking middleware', () => {
    const plugin: any = TerminalLog()
    const on = vi.fn()
    const use = vi.fn()
    plugin.configureServer({ ws: { on }, middlewares: { use } })
    expect(on).toHaveBeenCalledWith('my:from-client', expect.any(Function))
    expect(use).toHaveBeenCalledOnce()
    const finish = vi.fn()
    const next = vi.fn()
    use.mock.calls[0][0]({ url: '/' }, { on: finish }, next)
    expect(finish).toHaveBeenCalledWith('finish', expect.any(Function))
    expect(next).toHaveBeenCalledOnce()
  })
})
