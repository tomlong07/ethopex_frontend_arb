<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import useInfoContact from '@/store/useInfoContact'
import { ref, computed, onMounted } from 'vue'
import { ctr_info_contact } from '@/services/ctr_info_contact'
import { debounceV2 } from '@/utils'
import { ctr_user } from '@/services/ctr_user'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const infoContactStore = useInfoContact()

const rowData = computed(() => (props.params as any).data || {})
const systemEmail = ref<string | null>(rowData.value?.system_email ?? null)

const localOptions = ref<any[]>([])
const isSearching = ref(false)
const isLoading = ref(false)

const emailOptions = computed(() => {
  const options = isSearching.value ? localOptions.value : infoContactStore.publisherOptions
  const currentValue = systemEmail.value
  
  if (!currentValue || options.some(opt => opt.label === currentValue)) {
    return options
  }
  
  return [{ label: currentValue, value: currentValue }, ...options]
})

const handleSearch = debounceV2(async (q: string = '') => {
  if (!q.trim()) {
    isSearching.value = false
    localOptions.value = []
    return
  }
  
  isSearching.value = true
  isLoading.value = true
  
  try {
    const params = { q, ...(systemEmail.value && { f: systemEmail.value }) }
    localOptions.value = await infoContactStore.searchPublisher(params)
  } finally {
    isLoading.value = false
  }
}, 300)

const handleUpdate = async (value: string | null) => {
  const id = rowData.value?.id
  if (!id || value === props.params.data.system_email) return

  const result = await ctr_info_contact.UpdateSystemEmail({ id, system_email: value })

  if (result.status) {
    window.message.success('Update system email successfully.')
    props.params.data.system_email = value

    if (value) { 
      const response = await ctr_user.GetByEmail(value)
      if (response.status) {
        const res = await ctr_user.GetByID({ id: response.data.presenter })
        props.params.node.setData({
          ...props.params.data,
          system_manager: res.data.email,
        })
      }
    } else {
      props.params.node.setData({
        ...props.params.data,
        system_manager: null,
      })
    }
  } else {
    systemEmail.value = props.params.data.system_email
  }
}

// dùng cách này mới bắt được enter vì mặc định enter sẽ load lại table grid
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key !== 'Enter') return

  e.preventDefault()
  e.stopPropagation()

  const el = (e.currentTarget as HTMLElement)
    ?.querySelector('input')

  const value = el?.value?.trim()

  if (!value || value === systemEmail.value) return

  systemEmail.value = value
  handleUpdate(value)

  isSearching.value = false
  localOptions.value = []
}

onMounted(() => {
  if (!infoContactStore.isPublisherLoaded) {
    isLoading.value = true
    infoContactStore.fetchPublisherOptions().finally(() => {
      isLoading.value = false
    })
  }
})
</script>

<template>
  <div class="w-full h-full flex items-center">
    <n-select
      v-model:value="systemEmail"
      filterable
      remote
      tag
      :loading="isLoading"
      :options="emailOptions"
      placeholder=""
      @search="handleSearch"
      @update:value="handleUpdate"
      @keydown.enter.capture.stop="handleKeyDown"
    />
  </div>
</template>

<style lang="scss">
.ag-cell-wrapper {
  height: 100%;
}
</style>