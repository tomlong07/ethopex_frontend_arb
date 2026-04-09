<script setup lang="ts">
import { ONOFF } from '@/enum/campaign'
import { CampaignContext } from '@/types/components/campaign-v2'
import CustomSwitch from '@/components/common/CustomSwitch.vue'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const isShow = computed(() => {
  return (
    props.data.campaign.IsDemandAdsense() || props.data.campaign.IsDemandBing1()
  )
})

watch(
  () => isShow.value,
  (newVal) => {
    if (newVal) {
      if (!props.data.campaign.prelanding) {
        props.data.campaign.prelanding = ONOFF.OFF
      }
    } else {
      props.data.campaign.prelanding = null
    }
  }
)

const trigger = async () => {
  await nextTick()

  if (props.data.campaign.IsPrelandingOn()) {
    props.data.campaign.landing_page_by_creative = ONOFF.OFF
  } else {
    props.data.campaign.landing_pages = { id: null }
  }
}

const name = 'Prelanding'
</script>

<template>
  <div class="flex items-center gap-2" v-if="isShow">
    <div class="text-xs font-bold w-40">{{ name }}</div>
    <div class="flex-1 min-w-0 w-[calc(100%-10rem)]">
      <CustomSwitch
        v-model="props.data.campaign.prelanding"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
        :disabled="
          props.data.FreezeData.isEditPage() &&
          (props.data.campaign.traffic_source_id ? true : false)
        "
        @change="trigger()"
      />
    </div>
  </div>
</template>
