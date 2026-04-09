<script setup lang="ts">
import { hoursOptionsEnd, hoursOptionsStart } from '@/options/campaign'
import {
  campaignTypeClass,
  defaultSchedule,
} from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const scheduleItemLabel = (value: string) => {
  if (!value) {
    return ''
  }
  return helper.capitalizeFirstLetter(value.toLocaleLowerCase())
}

onMounted(() => {
  if (props.campaign.IsAPI()) {
    if (!props.campaign.schedule) {
      props.campaign.schedule = { type: 'all', value: defaultSchedule }
    }
  }
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.schedule = { type: 'all', value: defaultSchedule }
    } else {
      props.campaign.schedule = undefined
    }
  }
)
</script>

<template>
  <n-card
    title="Schedule calendar"
    v-if="props.campaign?.schedule && props.campaign.IsAPI()"
    class="relative card-flex-gap-4 rounded-[5px] !border-gray2"
  >
    <div class="flex flex-col">
      <div v-if="props.campaign.schedule.type" class="flex my-4 gap-2">
        <div class="w-40 font-bold">Days and Hours</div>
        <div class="flex-1 min-w-0">
          <div class="flex mb-4">
            <n-radio-group v-model:value="props.campaign.schedule.type">
              <div class="flex flex-col">
                <n-radio value="all">
                  <div>24/7</div>
                </n-radio>
                <n-radio value="specific">
                  <div>Set Specific days or Hours</div>
                </n-radio>
              </div>
            </n-radio-group>
          </div>
          <div
            v-show="props.campaign.schedule.type === 'specific'"
            class="flex flex-col"
          >
            <div class="flex justify-between mb-2 font-semibold text-gray-400">
              <div>DAY</div>
              <div class="flex">
                <div class="mr-14">STARTING TIME</div>
                <div class="mr-3">ENDING TIME</div>
              </div>
            </div>
            <div
              v-for="(item, index) in props.campaign.schedule.value"
              :key="index"
              class="flex justify-between mb-2"
            >
              <div>
                <n-checkbox
                  v-model:checked="item.type"
                  checked-value="INCLUDE"
                  unchecked-value="EXCLUDE"
                  size="small"
                >
                  <div class="font-semibold">
                    {{ scheduleItemLabel(item.day) }}
                  </div>
                </n-checkbox>
              </div>
              <div class="flex items-center">
                <div class="mr-4">
                  <n-select
                    v-model:value="item.from_hour"
                    size="small"
                    class="w-28"
                    :disabled="item.type === 'EXCLUDE'"
                    :options="hoursOptionsStart"
                  />
                </div>
                <div class="mr-4">-</div>
                <div>
                  <n-select
                    v-model:value="item.until_hour"
                    size="small"
                    class="w-28"
                    :disabled="item.type === 'EXCLUDE'"
                    :options="hoursOptionsEnd"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>
