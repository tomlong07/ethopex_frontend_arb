import { Plugin } from 'vite'

// Modules luôn cần (required)
const BASE_MODULES = ['ClientSideRowModelModule']

// Định nghĩa modules cho từng component
export const AG_GRID_MODULES_CONFIG: Record<string, string[]> = {
  'TableComp.vue': [
    'RowStyleModule',
    'PaginationModule',
    'RowSelectionModule',
    'CellStyleModule',
    'ColumnApiModule',
    'ColumnAutoSizeModule',
    'RowAutoHeightModule',
    'RenderApiModule',
    'PinnedRowModule',
    'TooltipModule',
    'QuickFilterModule',
    'TextFilterModule',
    'TextEditorModule',
  ],

  'AddingFacebook.vue': ['ColumnAutoSizeModule'],

  'AccountTable.vue': [
    'RowSelectionModule',
    'ColumnAutoSizeModule',
    'RowAutoHeightModule',
    'TextEditorModule',
  ],
  'MccTable.vue': [
    'RowSelectionModule',
    'RowAutoHeightModule',
    'ColumnAutoSizeModule',
  ],

  'DataTable.vue': [
    'RowSelectionModule',
    'RowAutoHeightModule',
    'ColumnAutoSizeModule',
  ],

  'ModalAiLog.vue': [
    'RowSelectionModule',
    'ColumnAutoSizeModule',
    'RowAutoHeightModule',
  ],

  'ModalCampaign.vue': ['RowSelectionModule'],
  'ModalFacebookPost.vue': [
    'RowSelectionModule',
    'PaginationModule',
    'ColumnAutoSizeModule',
    'RowAutoHeightModule',
  ],

  'ModalFbLog.vue': [
    'QuickFilterModule',
    'RowAutoHeightModule',
    'ColumnAutoSizeModule',
  ],

  'ModalLocation.vue': ['RowSelectionModule', 'ColumnAutoSizeModule'],

  'CreativeTable.vue': ['ColumnAutoSizeModule', 'RowAutoHeightModule'],

  'PixelTable.vue': ['RowAutoHeightModule', 'ColumnAutoSizeModule'],

  'TriggerTable.vue': ['RowAutoHeightModule', 'ColumnAutoSizeModule'],

  'AdsGroupTable.vue': [
    'RowSelectionModule',
    'RowAutoHeightModule',
    'ColumnAutoSizeModule',
  ],

  'AdTableModal.vue': ['RowAutoHeightModule', 'ColumnAutoSizeModule'],

  'TableBind.vue': [
    'RowSelectionModule',
    'PaginationModule',
    'RowAutoHeightModule',
    'ColumnAutoSizeModule',
  ],

  'CampaignDomainConfig.vue': ['RowAutoHeightModule', 'ColumnAutoSizeModule'],

  'ModalSatisfy.vue': [
    'RowSelectionModule',
    'RowAutoHeightModule',
    'TextFilterModule',
    'ColumnAutoSizeModule',
  ],

  'Copy.vue': ['RowAutoHeightModule', 'ColumnAutoSizeModule'],

  'NotifyTable.vue': [
    'RowSelectionModule',
    'RowAutoHeightModule',
    'ColumnAutoSizeModule',
  ],

  'PaymentsModal.vue': ['RowAutoHeightModule', 'ColumnAutoSizeModule'],

  'ReportTable.vue': [
    'RowSelectionModule',
    'RowAutoHeightModule',
    'ColumnAutoSizeModule',
  ],

  'ABTestDomain.vue': ['PaginationModule', 'ColumnAutoSizeModule'],

  'components/template-v2/modal/ModalPayments.vue': [
    'RowSelectionModule',
    'QuickFilterModule',
    'PinnedRowModule',
    'ColumnApiModule',
    'ColumnAutoSizeModule',
  ],

  'DomainConfigDetail.vue': ['RowSelectionModule', 'ColumnAutoSizeModule'],

  'ChangeLandingPage.vue': [
    'RowAutoHeightModule',
    'RowSelectionModule',
    'ColumnAutoSizeModule',
  ],
}

function autoRegisterAgGridModules(): Plugin {
  return {
    name: 'auto-register-ag-grid-modules',
    enforce: 'pre',

    transform(code, id) {
      if (!id.endsWith('.vue')) return null

      // Check nếu có AG Grid
      const hasAgGridImport =
        code.includes("from 'ag-grid-vue3'") ||
        code.includes('from "ag-grid-vue3"') ||
        code.includes("from 'ag-grid-vue'") ||
        code.includes('from "ag-grid-vue"')

      const hasAgGridTag =
        code.includes('<ag-grid-vue') || code.includes('<AgGridVue')

      if (!hasAgGridImport && !hasAgGridTag) return null

      // Lấy tên file component
      const fileName = id.split(/[\\/]/).pop() || ''

      // Lấy modules từ config
      let componentModules = AG_GRID_MODULES_CONFIG[fileName] || []

      // Kiểm tra comment override

      const moduleCommentMatch = code.match(
        /<!--\s*ag-grid-modules:\s*([^-]+)-->/
      )
      if (moduleCommentMatch) {
        const customModules = moduleCommentMatch[1]
          .split(',')
          .map((m) => m.trim())
          .filter(Boolean)
        componentModules = customModules
      }

      const allModules = BASE_MODULES.concat(componentModules)
      const requiredModules = Array.from(new Set(allModules))

      // Tạo code inject
      const injectedCode = `import { ModuleRegistry, ${requiredModules.join(
        ', '
      )} } from 'ag-grid-community';
ModuleRegistry.registerModules([${requiredModules.join(', ')}]);
`

      // Tìm vị trí insert
      const agGridImportMatch = code.match(
        /(import\s+{[^}]*}\s+from\s+['"]ag-grid-vue3?['"])/m
      )

      if (agGridImportMatch) {
        const insertPosition =
          agGridImportMatch.index! + agGridImportMatch[0].length
        return {
          code:
            code.slice(0, insertPosition) +
            '\n' +
            injectedCode +
            code.slice(insertPosition),
          map: null,
        }
      }

      // Fallback: insert sau <script setup>
      const scriptSetupMatch = code.match(/<script[^>]*setup[^>]*>/)
      if (scriptSetupMatch) {
        const insertPosition =
          scriptSetupMatch.index! + scriptSetupMatch[0].length
        return {
          code:
            code.slice(0, insertPosition) +
            '\n' +
            injectedCode +
            code.slice(insertPosition),
          map: null,
        }
      }

      return null
    },
  }
}

export { autoRegisterAgGridModules, BASE_MODULES }
export default autoRegisterAgGridModules
