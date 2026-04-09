<script setup lang="ts">
import { DropdownOption, SelectOption } from 'naive-ui'
import { ctr_user } from '@/services/ctr_user'
import { renderIcon } from '@/utils/utils'
import ListStars from '@/assets/icons/ListStars.vue'
import EyeOutline from '@/assets/icons/EyeOutline.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const localValue = defineModel<number[] | undefined>()
const props = defineProps<{
  showUpdateRole?: boolean
  error?: string
}>()

const isLoading = ref(false)
const options = ref<SelectOption[]>([])

const fetchOptions = async () => {
  isLoading.value = true
  try {
    const result = await ctr_user.GetAllRole()
    options.value = result?.data?.roles || []
  } finally {
    isLoading.value = false
  }
}

const menuOptions = computed<DropdownOption[]>(() => {
  let items: DropdownOption[] = []

  localValue.value?.forEach((element) => {
    items.push({
      label: options.value.find((x) => x.id === element)?.name,
      key: element,
      icon: renderIcon(EyeOutline),
    })
  })
  return items
})

const handleMenu = (key: string) => {
  if (!key) return
  window.open(`/permission_config/edit/${key}`, '_blank')
}

onMounted(() => {
  fetchOptions()
})
</script>

<template>
  <div v-show="props.showUpdateRole" class="flex items-center gap-2">
    <FloatingWrapper name="Select Role" :error="error">
      <n-select
        v-model:value="localValue"
        value-field="id"
        label-field="name"
        placeholder=""
        filterable
        multiple
        :loading="isLoading"
        :options="options"
      />
    </FloatingWrapper>
    <n-dropdown trigger="hover" :options="menuOptions" :on-select="handleMenu">
      <n-button
        color="#f43f5e"
        type="default"
        :class="{
          'pointer-events-none': !localValue?.length,
        }"
        :disabled="!localValue?.length"
      >
        <n-icon size="20"><ListStars /></n-icon>
      </n-button>
    </n-dropdown>
  </div>
</template>
