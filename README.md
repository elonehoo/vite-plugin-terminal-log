# vite-plugin-terminal-log

When it is convenient for development, the front-end routine log can be printed to the terminal output panel

## Install

```bash
# npm
npm i vite-plugin-terminal-log -D
# yarn
yarn add vite-plugin-terminal-log -D
# pnpm
pnpm add vite-plugin-terminal-log -D
```

## Usage

Add it to `vite.config.js`

```js
import { defineConfig } from 'vite'
import TerminalLog from 'vite-plugin-terminal-log'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    TerminalLog(),
  ],
})
```

## Credits

Thanks to:

- [vite-plugin-turbo-console](https://github.com/yuyinws/vite-plugin-turbo-console)
- [turbo-console-log](https://github.com/Chakroun-Anas/turbo-console-log)

## License

[MIT](./LICENSE) License © 2023 [Elone Hoo](https://github.com/elonehoo)
