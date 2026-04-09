<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { ctr_user } from '@/services/ctr_user'
import EyeOutline from '@/assets/icons/EyeOutline.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const localValue = defineModel<number | undefined>()
const isLoading = ref(false)
const options = ref<SelectOption[]>([])

const fetchOptions = async () => {
  isLoading.value = true
  try {
    const result = await ctr_user.GetAllAgency()
    options.value = result?.data?.agencies || []
  } finally {
    isLoading.value = false
  }
}

const openUser = (userId: number) => {
  if (!userId) return
  window.open(`/user/${userId}`, '_blank')
}

onMounted(() => {
  fetchOptions()
})
</script>

<template>
  <div class="flex items-center">
    <FloatingWrapper name="Director">
      <n-select
        v-model:value="localValue"
        value-field="id"
        label-field="email"
        placeholder=""
        filterable
        clearable
        :loading="isLoading"
        :options="options"
      />
    </FloatingWrapper>
    <n-button
      color="#f43f5e"
      type="default"
      v-if="localValue"
      @click="openUser(localValue)"
    >
      <n-icon size="20"><EyeOutline /></n-icon>
    </n-button>
  </div>
</template>
