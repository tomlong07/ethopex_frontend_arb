<script setup lang="ts">
import { adGroups } from '@/types/components/campaign-v2'
import TrashOutline from '@/assets/icons/TrashOutline.vue'
import Plus from '@/assets/icons/Plus.vue'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
})
const deleteFrequencyCap = (index: number) => {
  props.adgroup.frequency_caps?.splice(index, 1)
  props.adgroup.frequency_caps = undefined
}
const addFrequencyCap = () => {
  if (!props.adgroup.frequency_caps) {
    props.adgroup.frequency_caps = []
  }

  props.adgroup.frequency_caps.push({
    impressions: 1,
    days: 1,
    time_unit: 'DAY',
  })
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="text-xs font-bold text-gray-400">Frequency Cap</div>

    <div class="flex flex-col gap-2">
      <n-button
        type="primary"
        class="self-start"
        :disabled="props.adgroup.frequency_caps?.length === 1"
        @click="addFrequencyCap"
      >
        <template #icon>
          <n-icon size="small" :component="Plus" />
        </template>
        New time slot
      </n-button>

      <div
        v-for="(item, index) in props.adgroup.frequency_caps"
        :key="index"
        class="flex items-center gap-2"
      >
        <n-input-number
          v-model:value="item.impressions"
          :min="1"
          class="w-24"
          placeholder="1"
        />
        <span class="text-gray-600">impressions per</span>
        <n-select
          v-model:value="item.time_unit"
          class="w-32"
          placeholder="day"
        />
        <n-button
          text
          class="text-gray-400 hover:text-red-500"
          @click="deleteFrequencyCap(index)"
        >
          <template #icon>
            <n-icon :component="TrashOutline" />
          </template>
        </n-button>
      </div>
    </div>
  </div>
</template>
