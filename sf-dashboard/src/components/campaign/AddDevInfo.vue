<script setup lang="ts">
import CodeSlash from '@/assets/icons/CodeSlash.vue'
import CampaignType from '@/components/campaign/modules/google/CampaignType.vue'
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import { TS } from '@/enum/campaign'

const props = defineProps({
  traffic_source: {
    type: String,
    required: true,
  },
})

const campaign = ref(new campaignTypeClass({}))

const FreezeData = new FreezeClass({} as any)

const addDevData = () => {
  campaign.value.SetTraffic(props.traffic_source as any)

  if (props.traffic_source === TS.GOOGLE) {
    campaign.value.SetAPI()
    showModal.value = true
    return
  }
  emit('addDevData', campaign.value)
}

const emit = defineEmits<{
  (e: 'addDevData', campaign: campaignTypeClass): void
}>()

const isSubmitting = ref<boolean>(false)
const showModal = ref<boolean>(false)

const submit = () => {
  emit('addDevData', campaign.value)
  showModal.value = false
}
</script>

<template>
  <div class="ml-auto">
    <n-button size="tiny" title="Add dev data to test" @click="addDevData">
      <template #icon> <n-icon :component="CodeSlash" size="18" /> </template
    ></n-button>

    <n-modal v-model:show="showModal">
      <n-card
        style="width: 800px; height: 300px"
        size="huge"
        role="dialog"
        aria-modal="true"
        :bordered="false"
      >
        <CampaignType :campaign="campaign" :FreezeData="FreezeData" />
        <template #footer>
          <div class="flex justify-end">
            <n-button
              class="button-apply"
              color="#f43f5e"
              :loading="isSubmitting"
              @click="submit()"
            >
              Submit
            </n-button>
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>
