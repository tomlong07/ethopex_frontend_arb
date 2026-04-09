<script setup lang="ts">
import Checkmark from '@/assets/icons/Checkmark.vue'
import Close from '@/assets/icons/Close.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { prelanderConfigs } from '@/types/components/landing'

const props = defineProps({
  prelander_configs: {
    type: {} as () => prelanderConfigs,
    required: true,
  },
})

const status = computed({
  get: () =>
    props.prelander_configs?.interstitial ?? {
      status: 'off',
      floor_price: 0,
    },
  set: (value) => {
    if (props.prelander_configs) {
      props.prelander_configs.interstitial = value
    }
  },
})

const currentStatus = computed({
  get: () => status.value.status === 'on',
  set: (value: boolean) => {
    status.value = {
      ...status.value,
      status: value ? 'on' : 'off',
    }
  },
})
const name = 'Floor Price'
</script>
<template>
  <div class="flex flex-col gap-4" v-if="props.prelander_configs.interstitial">
    <div class="flex items-center">
      <div class="w-40 flex-shrink-0">Interstitial</div>
      <div class="flex flex-row place-items-center gap-4 mb-2 flex-1 min-w-0">
        <div class="w-16 flex-shrink-0">
          <n-switch v-model:value="currentStatus">
            <template #checked-icon>
              <n-icon :component="Checkmark" color="#121212" />
            </template>
            <template #unchecked-icon>
              <n-icon :component="Close" />
            </template>
          </n-switch>
        </div>
        <div class="flex-1 min-w-0">
          <FloatingWrapper :name="name" medium rounded>
            <n-input-number
              v-model:value="props.prelander_configs.interstitial.floor_price"
              :min="0"
              placeholder="Enter Floor Price"
              class="flex-1"
            />
          </FloatingWrapper>
        </div>
      </div>
    </div>
  </div>
</template>
