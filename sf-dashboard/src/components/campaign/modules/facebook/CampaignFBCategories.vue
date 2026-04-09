<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { PLACEMENT_TYPE } from '@/enum/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { categoryOptions } from '@/options/campaign'

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

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.categories = []
    } else {
      props.campaign.categories = undefined
    }
  }
)

watch(
  () => props.campaign.categories,
  async (newValue, oldValue) => {
    if (newValue?.length && props.campaign.ad_groups) {
      props.campaign.SetDefaultAgeGroupFB()
      props.campaign.RemoveAllLocations()
    }
  }
)

const handleChangeCategory = () => {
  if (props.campaign.ad_groups && props.campaign.ad_groups.length > 0) {
    props.campaign.ad_groups.forEach((adgroup) => {
      adgroup.audience_type = PLACEMENT_TYPE.MANUAL
    })
  }
}

const name = 'Categories'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="props.campaign.IsAPI()">
    <n-select
      v-model:value="props.campaign.categories"
      multiple
      :placeholder="name"
      :options="categoryOptions"
      @update:value="handleChangeCategory"
    />
  </FloatingWrapper>
</template>
