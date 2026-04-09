<script setup lang="ts">
import { computed, h } from 'vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  showName: {
    type: String,
    required: true,
  },

  //Phục vụ modal clone
  showInput: {
    type: Boolean,
    default: true,
  },
})

const nameLength = computed(() => props.showName?.length || 0)

const name = 'Name'
</script>

<template>
  <FloatingWrapper :name="name" rounded required class="name-affect-comp">
    <n-input
      v-model:value="props.campaign.origin_name"
      :placeholder="name"
      class="w-96"
      v-show="props.showInput"
    />
    <div class="mt-1 flex justify-between items-start gap-4">
      <div class="min-w-0 flex-1">
        <span class="font-xs italic text-gray-400 select-none">
          Name display:
        </span>
        <span class="font-xs italic text-gray-400 break-all">
          {{ props.showName }}
        </span>
      </div>
      <n-popover trigger="hover" :disabled="nameLength <= 250">
        <template #trigger>
          <div
            class="font-xs italic whitespace-nowrap"
            :class="nameLength > 250 ? 'text-red-500' : 'text-gray-400'"
          >
            {{ nameLength }}/250
          </div>
        </template>
        Display name must not exceed 250 characters.
      </n-popover>
    </div>
  </FloatingWrapper>
  <!-- <div class="flex name-affect-comp gap-2">
    <div class="w-40 font-bold">{{ name }}</div>
    <div class="flex-1 min-w-0 flex flex-col">
      <n-input
        v-model:value="props.campaign.origin_name"
        :placeholder="name"
        class="w-96"
        maxlength="250"
        show-count
        v-show="props.showInput"
      />

      <div>
        <span class="font-xs italic text-gray-400 select-none">
          Name display:
        </span>
        <span class="font-xs italic text-gray-400"> {{ showName }}</span>
      </div>
    </div>
  </div> -->
</template>
