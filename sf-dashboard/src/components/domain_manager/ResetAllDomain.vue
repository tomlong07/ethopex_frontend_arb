<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { useTemplateV2 } from '@/store/templateV2Store'
import { ctr_domain } from '@/services/ctr_domain'
const templateV2Store = useTemplateV2(helper.truePath())()

const isLoading = ref<boolean>(false)
const loadingOptions = ref<boolean>(false)

interface DataConfig {
  version: string | null
}

const dataConfig = ref<DataConfig>({
  version: null,
})
const versionOptions = ref<SelectOption[]>([])

const onResetAllDomain = async () => {
  if (!templateV2Store.asyncConfigs.resetAllDomain) return
  isLoading.value = true

  const result = await ctr_domain.PurgeCache(
    templateV2Store.asyncConfigs.resetAllDomain,
    {
      type: 'all',
      themeVersion: dataConfig.value.version || undefined,
    }
  )

  if (result?.status) {
    window.message.success('Rebuild All Domain Success!')
    templateV2Store.reInitTable()
  }
  isLoading.value = false
}

const getOptions = async () => {
  if (!templateV2Store.asyncConfigs.themeVersion) return
  loadingOptions.value = true
  const result = await ctr_domain.GetPathMinio(
    templateV2Store.asyncConfigs.themeVersion
  )

  versionOptions.value = (result?.data || [])
    .sort((a: string, b: string) => Number(b) - Number(a))
    .map((timestamp: string) => ({
      label: timestamp,
      value: timestamp,
    }))

  loadingOptions.value = false
}

onMounted(() => {
  getOptions()
})

const RenderLabel = (option: SelectOption) => {
  return h('div', { class: 'flex items-center gap-4' }, [
    h('div', { innerHTML: option.label }),
    h('div', {
      class: 'text-gray-500',
      innerHTML: helper.convertTimestampToGMT7(option.label),
    }),
  ])
}
</script>

<template>
  <div class="flex items-center gap-2">
    <n-select
      class="w-40"
      size="small"
      v-model:value="dataConfig.version"
      :options="versionOptions"
      :loading="loadingOptions"
      :render-label="RenderLabel"
      placeholder="Theme Version"
      :consistent-menu-width="false"
    />
    <n-button
      color="#f43f5e"
      size="small"
      :loading="isLoading"
      @click="onResetAllDomain"
    >
      Reset All Domain
    </n-button>
  </div>
</template>
