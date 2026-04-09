<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass } from '@/types/components/campaign-v2'
import CartOutline from '@/assets/icons/CartOutline.vue'
import MailOutline from '@/assets/icons/MailOutline.vue'
import Speakerphone from '@/assets/icons/Speakerphone.vue'
import EyeOutline from '@/assets/icons/EyeOutline.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const marketingOptions: SelectOption[] = [
  { label: 'LEAD GENERATION', value: 'LEADS_GENERATION' },
  { label: 'ONLINE PURCHASES', value: 'ONLINE_PURCHASES' },
  // { label: 'WEBSITE ENGAGEMENT', value: 'DRIVE_WEBSITE_TRAFFIC' },
  // { label: 'BRAND AWARENESS', value: 'BRAND_AWARENESS' },
]

const onClickMarketing = (value: string) => {
  props.campaign.type = value
}

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.type = marketingOptions[0].value as string
    } else {
      props.campaign.type = undefined
    }
  }
)
</script>

<template>
  <FloatingWrapper name="Maketing Object" rounded v-if="props.campaign.IsAPI()">
    <div class="flex flex-col border rounded-md p-2 w-fit">
      <div class="font-xs text-gray-400 ml-2 mb-1">
        Select a primary goal for your campaign
      </div>
      <div class="flex">
        <template
          v-for="(option, index) in marketingOptions"
          :key="option.value + String(index)"
        >
          <div
            :class="[
              'border-exclude custom-border-camp-taboola flex flex-col items-center text-center cursor-pointer mx-2 p-2 border-2 rounded-lg hover:border-green-300',
              {
                'border-green-500': props.campaign.type === option.value,
              },
            ]"
            @click="onClickMarketing(`${option.value}`)"
          >
            <n-icon v-if="option.value === 'LEADS_GENERATION'" size="25">
              <MailOutline />
            </n-icon>
            <n-icon v-if="option.value === 'ONLINE_PURCHASES'" size="25">
              <CartOutline />
            </n-icon>
            <n-icon v-if="option.value === 'DRIVE_WEBSITE_TRAFFIC'" size="25">
              <EyeOutline />
            </n-icon>
            <n-icon v-if="option.value === 'BRAND_AWARENESS'" size="25">
              <Speakerphone />
            </n-icon>
            <div class="mt-2">
              {{ option.label }}
            </div>
          </div>
        </template>
      </div>
    </div>
  </FloatingWrapper>
</template>
