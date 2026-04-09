<script setup lang="ts">
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
})

// const aiMaxEnabled = ref(false)
// const textCustomization = ref(false)
// const finalUrlExpansion = ref(false)

// const initializeFromCampaign = () => {
//   if (props.campaign.optimize_with_AI_max) {
//     aiMaxEnabled.value = true
//     return
//   }
// if (
//   props.campaign.text_customization === OPTIMIZE_AI_MAX.TEXTASSETAUTOMATION
// ) {
//   aiMaxEnabled.value = true
//   textCustomization.value = true
//   finalUrlExpansion.value = false
// } else if (
//   props.campaign.final_url_expansion ===
//   OPTIMIZE_AI_MAX.FINALURLEXPANSIONTEXTASSETAUTOMATION
// ) {
//   aiMaxEnabled.value = true
//   textCustomization.value = false
//   finalUrlExpansion.value = true
// }
// }

onMounted(() => {
  if (props.FreezeData.isAddPage()) {
    props.campaign.SetOptimizeAIMax()
  }
})

watch(
  () => props.campaign.optimize_with_AI_max,
  (newValue) => {
    if (newValue !== 'on') {
      props.campaign.text_customization = undefined
      props.campaign.final_url_expansion = undefined
    }
  }
)

// watch(
//   () => textCustomization.value,
//   (newValue) => {
//     if (newValue) {
//       props.campaign.text_customization = OPTIMIZE_AI_MAX.TEXTASSETAUTOMATION
//       props.campaign.final_url_expansion = undefined
//       finalUrlExpansion.value = false
//     } else {
//       props.campaign.text_customization = undefined
//     }
//   }
// )

// watch(
//   () => finalUrlExpansion.value,
//   (newValue) => {
//     if (newValue) {
//       props.campaign.final_url_expansion =
//         OPTIMIZE_AI_MAX.FINALURLEXPANSIONTEXTASSETAUTOMATION
//       props.campaign.text_customization = undefined
//       textCustomization.value = false
//     } else {
//       props.campaign.final_url_expansion = undefined
//     }
//   }
// )
</script>

<template>
  <n-card
    title="Optimize Campaign"
    class="card-flex-gap-4 rounded-[5px] !border-gray2"
    v-if="props.campaign.IsGGSearch()"
  >
    <!-- Header with Toggle -->
    <div class="flex items-center gap-3 mb-4">
      <n-switch
        v-model:value="props.campaign.optimize_with_AI_max"
        checked-value="on"
        unchecked-value="off"
      />
      <span class="font-medium text-gray-900">
        Optimize your campaign with AI Max
      </span>
      <n-tag size="small" type="info" :bordered="false">BETA</n-tag>
    </div>

    <!-- Asset Optimization Section -->
    <!-- <n-collapse
      v-if="aiMaxEnabled"
      :default-expanded-names="['asset-optimization']"
    >
      <n-collapse-item title="Asset optimization" name="asset-optimization">
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <n-checkbox
              v-model:checked="textCustomization"
              :disabled="props.FreezeData.isEditPage()"
              class="mt-1"
            />
            <div class="flex-1">
              <div class="font-medium text-gray-900 mb-1">
                Text customization
              </div>
              <div class="text-sm text-gray-600">
                Use text from your website, landing pages, ads, and provided
                assets to create customized ad copy.
                <a
                  href="https://support.google.com/google-ads/answer/text-customization"
                  target="_blank"
                  class="text-blue-600 hover:underline"
                >
                  Learn more about text customization
                </a>
              </div>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <n-checkbox
              v-model:checked="finalUrlExpansion"
              :disabled="props.FreezeData.isEditPage()"
              class="mt-1"
            />
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-medium text-gray-900">
                  Final URL expansion
                </span>
                <n-tag size="small" type="info" :bordered="false">BETA</n-tag>
              </div>
              <div class="text-sm text-gray-600 mb-2">
                Send traffic to the most relevant URLs on your website when it's
                likely to result in better performance.
              </div>
              <div class="text-sm text-gray-500 mb-2">
                Requires text customization to be turned on to ensure ad copy
                matches landing page
              </div>
              <div class="text-sm text-gray-500 mb-2">Add URL exclusions</div>
            </div>
          </div>
        </div>

        <n-alert type="info" class="mt-4">
          Turn on AI Max in your campaign to use asset optimization
        </n-alert>
      </n-collapse-item>
    </n-collapse> -->
  </n-card>
</template>
