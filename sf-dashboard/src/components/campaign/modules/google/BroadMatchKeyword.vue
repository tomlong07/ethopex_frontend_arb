<script setup lang="ts">
import { campaignTypeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const broadmatchkeyword = [
  {
    value: 'BROAD',
    label: 'On: Use broad match keywords for your entire campaign',
  },
  {
    value: 'UNSPECIFIED',
    label: 'Off: Use keyword match types',
  },
]

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsGGSearch(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.broad_match_keyword = 'BROAD'
    } else {
      props.campaign.broad_match_keyword = undefined
    }
  }
)
</script>

<template>
  <n-card
    title="Broad Match Keyword"
    class="card-flex-gap-4 rounded-[5px] !border-gray2"
    v-if="props.campaign.IsGGSearch()"
    id="broad-match-keyword"
  >
    <div class="flex items-center">
      <div class="w-40 font-bold"></div>
      <div class="flex-1 min-w-0">
        <n-radio-group
          v-model:value="props.campaign.broad_match_keyword"
          name="radiogroup"
        >
          <n-space vertical>
            <n-radio
              v-for="item in broadmatchkeyword"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </n-space>
        </n-radio-group>
      </div>
    </div>
  </n-card>
</template>
