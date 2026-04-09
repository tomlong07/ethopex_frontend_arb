<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { ctr_user } from '@/services/ctr_user'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const localValue = defineModel<number[] | undefined>()
const isLoading = ref(false)
const options = ref<SelectOption[]>([])

const fetchOptions = async () => {
  isLoading.value = true
  try {
    const result = await ctr_user.GetAllAdminManager()

    options.value = result?.data?.admin_managers || []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchOptions()
})
</script>

<template>
  <div class="flex gap-2">
    <FloatingWrapper name="User AM">
      <n-select
        v-model:value="localValue"
        value-field="id"
        label-field="email"
        placeholder=""
        filterable
        multiple
        clearable
        :loading="isLoading"
        :options="options"
      />
    </FloatingWrapper>
  </div>
</template>
