// global-plugin.ts
import { App } from 'vue'
import { ARB } from '@/core/window'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    arb: ARB
  }
}

//Dùng để sử dụng đc arb trong template component
export default {
  install(app: App) {
    app.config.globalProperties.arb = window.arb
  },
}
