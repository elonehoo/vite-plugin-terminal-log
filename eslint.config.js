// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'no-console': 'off',
    'prefer-regex-literals': 'off',
    'ts/no-use-before-define': 'off',
    'no-var': 'off',
  },
})
