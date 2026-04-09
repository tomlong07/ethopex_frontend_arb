<script setup lang="ts">
import { campaignTypeClass } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const categoryOptions = ref<SelectOption[]>([])
const isLoading = ref<boolean>(false)

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
    } else {
      props.campaign.category_id_mgid = undefined
    }
  }
)

const name = 'Category'
</script>

<template>
  <div class="flex items-center" v-if="props.campaign.IsAPI()">
    <div class="w-1/6 font-bold">{{ name }}</div>
    <div class="w-5/6">
      <n-select
        v-model:value="campaign.category_id_mgid"
        value-field="id"
        label-field="name"
        :placeholder="name"
        :loading="isLoading"
        :options="categoryOptions"
      />
    </div>
  </div>
</template>
