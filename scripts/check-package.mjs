import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, renameSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import process from 'node:process'

const root = process.cwd()
const temporary = mkdtempSync(join(tmpdir(), '.package-check-'))
const consumer = join(temporary, 'consumer')
const packageName = 'vite-plugin-terminal-log'

function run(command, args, cwd = root) {
  return execFileSync(command, args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] })
}

try {
  const packed = JSON.parse(run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary]))
  run('tar', ['-xzf', join(temporary, packed[0].filename), '-C', temporary])
  const scope = join(consumer, 'node_modules')
  mkdirSync(scope, { recursive: true })
  renameSync(join(temporary, 'package'), join(scope, packageName))
  // Link the installed runtime dependency and Vite host with their validated dependency closures.
  for (const name of ['kolorist', 'vite'])
    symlinkSync(resolve(root, 'node_modules', name), join(scope, name), 'dir')
  mkdirSync(join(scope, '@types'), { recursive: true })
  symlinkSync(resolve(root, 'node_modules/@types/node'), join(scope, '@types/node'), 'dir')
  // An external package scope cannot inherit the repository's node_modules.
  writeFileSync(join(consumer, 'package.json'), JSON.stringify({ name: 'package-consumer', private: true, type: 'module' }))

  const assertion = 'const plugin = terminal()\nvoid plugin\n'
  writeFileSync(join(consumer, 'esm.mts'), `import terminal from '${packageName}'\n${assertion}`)
  writeFileSync(join(consumer, 'common.cts'), `import terminal = require('${packageName}')\n${assertion}`)
  writeFileSync(join(consumer, 'bundler.ts'), `import terminal from '${packageName}'\n${assertion}`)
  const compiler = resolve(root, 'node_modules/typescript/bin/tsc')
  const options = [compiler, '--noEmit', '--strict', '--skipLibCheck', 'false', '--target', 'ES2022']
  for (const file of ['esm.mts', 'common.cts'])
    run(process.execPath, [...options, '--module', 'NodeNext', '--moduleResolution', 'NodeNext', join(consumer, file)])
  // Vite's host declarations require a modern resolver; Node10 cannot resolve its package imports.
  run(process.execPath, [...options, '--module', 'ESNext', '--moduleResolution', 'Bundler', join(consumer, 'bundler.ts')])

  writeFileSync(join(consumer, 'esm.mjs'), `import terminal from '${packageName}'; import assert from 'node:assert/strict'; assert.equal(terminal().name, 'vite-plugin-terminal-log');`)
  writeFileSync(join(consumer, 'common.cjs'), `const terminal = require('${packageName}'); const assert = require('node:assert/strict'); assert.ok(require.resolve('${packageName}').includes('.package-check-')); assert.equal(terminal().name, 'vite-plugin-terminal-log');`)
  run(process.execPath, [join(consumer, 'esm.mjs')])
  run(process.execPath, [join(consumer, 'common.cjs')])
}
finally {
  rmSync(temporary, { recursive: true, force: true })
}
