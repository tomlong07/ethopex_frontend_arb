<script lang="ts" setup>
import { ref, watch } from 'vue'
import { prelanderConfigs } from '@/types/components/landing'
import { debounceV2 } from '@/utils'

const props = defineProps({
  prelander_configs: {
    type: {} as () => prelanderConfigs,
    required: true,
  },
})

const adPositionInput = ref(
  Array.isArray(props.prelander_configs.ad_config?.ad_position)
    ? props.prelander_configs.ad_config!.ad_position!.join(',')
    : ''
)

const handleAdInput = debounceV2((val: string) => {
  if (typeof val !== 'string') return

  const cleaned = val
    .replace(/[^0-9,]/g, '') // Chỉ giữ số và dấu phẩy
    .replace(/,{2,}/g, ',') // Gộp các dấu phẩy liên tiếp thành một
    .replace(/^,|,$/g, '') // Xoá dấu phẩy đầu/cuối
    .replace(/,+/g, ',') // Gộp dấu phẩy rời rạc (phòng khi có dấu lạ)

  const validNumbers = cleaned
    .split(',')
    .map((item) => item.trim())
    .filter((item) => {
      if (!item) return false
      if (!/^\d+$/.test(item)) return false // Không phải số nguyên
      if (item === '0') return false // Loại '0'
      if (/^0\d+/.test(item)) return false // Loại '01', '002', ...
      return true
    })

  const final = validNumbers.join(',')

  // Nếu kết quả khác thì cập nhật lại input
  if (final !== val) {
    adPositionInput.value = final
  }

  // Cập nhật vào props nếu có
  if (
    props.prelander_configs?.ad_config &&
    typeof props.prelander_configs.ad_config === 'object'
  ) {
    props.prelander_configs.ad_config.ad_position = final
  }
}, 500)

watch(
  adPositionInput,
  (newVal) => {
    handleAdInput(newVal)
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex items-center gap-2" v-if="props.prelander_configs.ad_config">
    <n-switch
      v-model:value="props.prelander_configs.ad_config.status"
      size="small"
    >
      <template #checked><span class="text-xs">ON</span></template>
      <template #unchecked><span class="text-xs">OFF</span></template>
    </n-switch>
  </div>

  <n-form-item
    v-if="props.prelander_configs.ad_config"
    path="ad_config.ad_position"
  >
    <template #label>
      <div class="flex items-center gap-2">Ad Position</div>
    </template>

    <n-input v-model:value="adPositionInput" placeholder="1,2,3,..." />
  </n-form-item>
</template>
