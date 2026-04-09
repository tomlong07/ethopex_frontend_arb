<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass } from '@/types/components/campaign-v2'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'

//Component này hoạt động còn lỗi sai, như getbyId, duplicate, ... chưa handle hết trường hợp
//Lúc nào sử dụng cần sửa lại cho hoạt động đúng

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})
const isLoading = ref(false)
const inventoriesRef = ref<number[]>([])
const typeInventories = ref<string>('include')
const inventoriesOptions = ref<SelectOption[]>([])

const getInventoriesByTrafficSearch = async (payload: {}) => {
  isLoading.value = true
  const inventoriesResult = await ctr_traffic_source.GetInventories(payload)
  if (inventoriesResult?.status) {
    if (inventoriesResult?.data?.Inventories) {
      inventoriesResult.data.Inventories.forEach((item: any) => {
        let objFind = inventoriesOptions.value.find((it) => it.id === item.id)
        if (!objFind) {
          inventoriesOptions.value.push({
            id: item.id,
            inventory: item.inventory,
          })
        }
      })
    } else {
      inventoriesOptions.value = inventoriesOptions.value || []
    }
  }
  isLoading.value = false
}

const handleSearchInventories = (s: string) => {
  if (s.length < 2) {
    return
  }
  getInventoriesByTrafficSearch({
    search: s,
    traffic_source: props.campaign.traffic_source,
  })
}

const onChangeInventories = (value: number[]) => {
  inventoriesRef.value = value
  const inventories = [] as typeof props.campaign.inventories
  if (inventories) {
    inventoriesOptions.value.forEach((item: any) => {
      if (value.includes(item.id)) {
        inventories.push({
          id: item.id,
          inventory: item.inventory,
          type: typeInventories.value,
        })
      }
    })
    props.campaign.inventories = inventories
  }
}

const onChangeTypeInventories = (value: string) => {
  typeInventories.value = value
  if (props.campaign.inventories && props.campaign.inventories.length > 0) {
    const inventories = [] as typeof props.campaign.inventories
    props.campaign.inventories.forEach((item: any) => {
      inventories.push({
        id: item.id,
        inventory: item.inventory,
        type: typeInventories.value,
      })
    })
    props.campaign.inventories = inventories
  }
}

onMounted(async () => {
  if (props.campaign.inventories) {
    props.campaign.inventories.forEach((item: any) => {
      inventoriesRef.value.push(item.id)
      inventoriesOptions.value.push({
        id: item.id,
        inventory: item.inventory,
      })

      if (!typeInventories.value) {
        typeInventories.value = item.type
      }
    })
  }

  await getInventoriesByTrafficSearch({
    search: '',
    traffic_source: props.campaign.traffic_source,
  })
})

watch(
  () => typeInventories.value,
  (v) => {
    onChangeTypeInventories(v)
  }
)

const name = 'Inventories'
</script>

<template>
  <div class="flex gap-2 items-center">
    <FloatingWrapper :name="name" rounded>
      <n-select
        v-model:value="inventoriesRef"
        filterable
        multiple
        value-field="id"
        label-field="inventory"
        :loading="isLoading"
        :options="inventoriesOptions"
        :placeholder="name"
        @search="handleSearchInventories"
        @update:value="onChangeInventories"
      />
    </FloatingWrapper>
    <div>
      <CustomSwitch
        v-model="typeInventories"
        type="inex"
        true-label="Include"
        false-label="Exclude"
        size="small"
      />
    </div>
  </div>
</template>
