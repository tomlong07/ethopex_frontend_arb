// src/types/naive-ui.d.ts
import { VNodeChild } from 'vue'

declare module 'naive-ui' {
  // Mở rộng nếu Naive UI export slot names trực tiếp
  interface TabPaneSlots {
    tab?: () => VNodeChild
  }
  // một số version/export dùng NTabPaneSlots
  interface NTabPaneSlots {
    tab?: () => VNodeChild
  }
}

// Một số bản build của naive-ui định nghĩa TabPane trong path này (ESM)
declare module 'naive-ui/es/tabs/src/TabPane' {
  export interface TabPaneSlots {
    tab?: () => VNodeChild
  }
}

// Một số build khác (CJS / lib)
declare module 'naive-ui/lib/tabs/src/TabPane' {
  export interface TabPaneSlots {
    tab?: () => VNodeChild
  }
}
