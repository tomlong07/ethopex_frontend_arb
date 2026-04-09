import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'
import { Plugin } from 'vite'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import fs from 'fs'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import checker from 'vite-plugin-checker'
import autoRegisterAgGridModules from './src/autoRegisterModules'

function rawHtmlPlugin(): Plugin {
  return {
    name: 'raw-html-plugin',
    transform(code, id) {
      if (id.endsWith('.html-template')) {
        return `export default ${JSON.stringify(code)}`
      }
    },
  }
}

export default ({ mode }) => {
  const modeDefault = ['development']
  const envFilePath = path.resolve(process.cwd(), `.env.${mode}`)

  if (!modeDefault.includes(mode)) {
    if (!fs.existsSync(envFilePath)) {
      console.error(
        `Env file for mode "${mode}" does not exist: ${envFilePath}`
      )
      return
    }

    // Load app-level env vars to node-level env vars.
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }
  }
  const configs = defineConfig({
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return

            if (id.includes('vuedraggable') || id.includes('vuedraggable'))
              return 'vuedraggable'
            if (id.includes('vuex')) return 'vuex'
            if (id.includes('vue-router')) return 'vue-router'

            if (id.includes('/vue')) return 'vue'
            if (id.includes('naive-ui')) return 'naive'
            if (id.includes('tabulator')) return 'tabulator'
            if (id.includes('highcharts')) return 'charts'
            if (id.includes('codemirror')) return 'codemirror'
            if (id.includes('axios')) return 'axios'
            if (id.includes('date-fns')) return 'date-fns'
            if (id.includes('file-saver')) return 'file-saver'
            if (id.includes('dompurify')) return 'dompurify'
            if (id.includes('jquery')) return 'jquery'
            if (id.includes('ag-grid')) return 'ag-grid'

            return 'vendor' // còn lại cực nhỏ
          },
        },
      },
      sourcemap: false,
    },
    resolve: {
      // Register the .html extension to use raw-loader
      extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.html'],
      alias: {
        '@': path.resolve(__dirname, './src'), //Thêm cái này để import css đc với @
      },
    },
    // Add raw-loader as a Vite transform
    plugins: [
      vue({
        template: {
          compilerOptions: {
            // treat all tags with a dash as custom elements
            isCustomElement: (tag) => tag.includes('arb'),
          },
        },
      }),
      rawHtmlPlugin(),
      autoRegisterAgGridModules(),
      tsconfigPaths({
        loose: true,
      }),
      AutoImport({
        imports: [
          'vue', // Tự động import tất cả các API của Vue
        ],
        dts: 'src/auto-imports.d.ts', // Tùy chọn: tạo file .d.ts để hỗ trợ IntelliSense
      }),
      Components({
        resolvers: [NaiveUiResolver()],
        version: 3,
        // directoryAsNamespace: true,
        dts: 'src/components.d.ts', // để IDE gợi ý <n-button>
      }),

      {
        name: 'custom-log',
        configureServer(server) {
          if (process.env.VITE_BASE_URL) {
            server.httpServer?.once('listening', () => {
              const green = '\x1b[32m'
              const cyan = '\x1b[36m'
              const bold = '\x1b[1m'
              const reset = '\x1b[0m'

              console.log(
                `\n${bold}${green}🚀 App ready at:${reset} ${cyan}http://localhost:4000${process.env.VITE_BASE_URL}${reset}\n`
              )
            })
          }
        },
      },
    ],

    server: {
      // Dùng để test mobile local
      // host: '0.0.0.0', // Lắng nghe tất cả địa chỉ
      // allowedHosts: true, // Mở cổng cho tất cả các host
      port: 4000,
      cors: true,
    },
    define: {
      'import.meta.env.BUILDTIME': JSON.stringify(
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }) +
          ' GMT+7'
      ),
    },
  })

  if (['development'].includes(mode)) {
    configs.plugins?.push(
      checker({
        // tắt overlay/badge trong trình duyệt
        overlay: false,
        typescript: true,
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint "./src/**/*.{ts,vue}"',
        },
      })
    )
  }

  return configs
}
