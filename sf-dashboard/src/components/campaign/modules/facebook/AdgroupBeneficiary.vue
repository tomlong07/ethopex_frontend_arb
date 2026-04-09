<script setup lang="ts">
import { adGroups, FreezeClass } from '@/types/components/campaign-v2'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { BENEFICIARY } from '@/constants/formats'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const defaultName = BENEFICIARY

const setDefault = () => {
  props.adgroup.beneficiary = defaultName
}
const name = 'Beneficiary'
</script>

<template>
  <div class="flex items-center gap-2">
    <FloatingWrapper :name="name" rounded>
      <div class="flex-1 min-w-0 flex items-center gap-2">
        <n-input
          v-model:value="props.adgroup.beneficiary"
          :placeholder="name"
          maxlength="500"
        ></n-input>

        <n-button @click="setDefault">Default</n-button>
      </div>
    </FloatingWrapper>
    <n-popover trigger="hover">
      <template #trigger>
        <n-icon :component="QuestionCircleRegular" />
      </template>
      Beneficiary and payer information is required for ad sets with audiences
      in the European Union
    </n-popover>
  </div>
</template>
