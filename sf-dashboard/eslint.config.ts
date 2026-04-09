/* eslint-disable no-unused-vars */
// @ts-nocheck
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import importPlugin from 'eslint-plugin-import'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  // JS/TS chung
  {
    files: ['**/*.{js,cjs,mjs,ts,mts,cts}'],
    languageOptions: {
      parser: tseslint.parser as any,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin as any,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-unused-vars': ['warn', { args: 'none' }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'none',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // Vue SFC
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser, // 👈 dùng parser cho <script lang="ts">
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        extraFileExtensions: ['.vue'],
      },
      globals: {
        ...globals.browser,
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
        ref: 'readonly',
        computed: 'readonly',
        reactive: 'readonly',
        watch: 'readonly',
        watchEffect: 'readonly',
        onMounted: 'readonly',
        onUnmounted: 'readonly',
        onBeforeMount: 'readonly',
        onUpdated: 'readonly',
        onBeforeUpdate: 'readonly',
        onBeforeUnmount: 'readonly',
        onActivated: 'readonly',
        onDeactivated: 'readonly',
        nextTick: 'readonly',
        toRefs: 'readonly',
        toRef: 'readonly',
        shallowRef: 'readonly',
        getCurrentInstance: 'readonly',
      },
    },
    plugins: {
      vue: pluginVue,
      '@typescript-eslint': tseslint.plugin as any,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      'vue/attribute-hyphenation': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'none',
          ignoreRestSiblings: true,
        },
      ],
    },
  },

  // Import resolution
  {
    files: ['**/*.{js,ts,vue}'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-unresolved': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },

  // Ignore
  {
    ignores: [
      'node_modules',
      'dist',
      'coverage',
      'tailwind.config.cjs',
      'vite.config.ts',
      'vite.config.ts.timestamp-*.mjs',
      'vite-env.d.ts',
      'check-unused-vue.mjs',
      'eslint.config.ts',
      'postcss.config.cjs',
      'public/frontend_loader.js',
      'public/ckeditor/**',
      '**/old/**',
      'src/auto-imports.d.ts',
      'src/**/*.js',
      'analyze-eslint.js',
      'check-lang-consistency.js',
      'components.d.ts',
      'src/autoRegisterModules.ts'
    ],
  },
])
