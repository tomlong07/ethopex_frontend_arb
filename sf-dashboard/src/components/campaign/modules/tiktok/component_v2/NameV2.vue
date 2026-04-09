<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { CampaignContext } from '@/types/components/campaign-v2'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },

  //Phục vụ modal clone
  showInput: {
    type: Boolean,
    default: true,
  },
})

const name = 'Name'
</script>

<template>
  <FloatingWrapper :name="name" rounded required class="name-affect-comp">
    <n-input
      v-model:value="data.campaign.origin_name"
      :placeholder="name"
      class="w-96"
      maxlength="250"
      show-count
      v-show="props.showInput"
    />
    <div class="mt-1">
      <span class="font-xs italic text-gray-400 select-none">
        Name display:
      </span>
      <span class="font-xs italic text-gray-400"> {{ data.showName }}</span>
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
