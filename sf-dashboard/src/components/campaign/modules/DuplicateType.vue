<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { cloneModeOptions } from '@/types/components/campaign-v2-select'
import { SelectOption } from 'naive-ui'
import DuplicateOutline from '@/assets/icons/DuplicateOutline.vue'
import { DUPLICATE_TYPE } from '@/enum/campaign'
import Journals from '@/assets/icons/Journals.vue'
import Android from '@/assets/icons/Android.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const cloneOptions = computed((): SelectOption[] => {
  if (props.campaign.IsTrafficGoogle()) {
    return cloneModeOptions
  }

  if (props.campaign.IsTrafficFacebook()) {
    return cloneModeOptions.filter((option) => {
      return option.value === DUPLICATE_TYPE.DUPLICATE
    })
  }

  return cloneModeOptions.filter((option) => {
    return option.value !== DUPLICATE_TYPE.BOT
  })
})

//Fetch lại data, đảm bảo các trường ko đc change ở trường hợp clone được đúng
const onClickCloneOption = async (value: any) => {
  emit('refetchData', value)
}

const emit = defineEmits<{
  (e: 'refetchData', value: string): void
}>()

const isComp = window.arb.isCompany()
</script>

<template>
  <div
    class="flex items-center"
    v-if="FreezeData.isDuplicatePageV2() && isComp"
  >
    <div class="w-20 font-bold">Mode</div>
    <div class="flex-1 min-w-0 flex items-center">
      <div class="flex gap-2">
        <template v-for="(option, index) in cloneOptions" :key="index">
          <n-popover trigger="hover" placement="top">
            <template #trigger>
              <div
                :class="[
                  'flex flex-row items-center cursor-pointer px-4 py-2 gap-2 border-2 rounded-lg hover:border-green-300',
                  {
                    'border-green-500':
                      props.campaign.duplicate_type === option.value,
                  },
                ]"
                @click="onClickCloneOption(option.value)"
              >
                <n-icon
                  v-if="
                    option.value === DUPLICATE_TYPE.DUPLICATE ||
                    option.value === DUPLICATE_TYPE.DUPLICATE_KEEP_LINK
                  "
                  :component="DuplicateOutline"
                  size="20"
                />

                <n-icon
                  v-if="option.value === DUPLICATE_TYPE.BOT"
                  :component="Android"
                  size="20"
                />

                <n-icon
                  v-else-if="option.value === 'clone'"
                  :component="Journals"
                  size="20"
                />

                {{ option.label }}
              </div>
            </template>

            <span class="text-sm">
              {{ option.note }}
            </span>
          </n-popover>
        </template>
      </div>
    </div>
  </div>
</template>
