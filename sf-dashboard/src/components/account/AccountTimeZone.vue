<script lang="ts" setup>
import { ctr_time_zone } from '@/services/ctr_time_zone'
import useAccountAd from '@/store/useAccountAd'
import { SelectOption } from 'naive-ui'

const accountAdStore = useAccountAd()
const timezoneOptions = ref<SelectOption[]>([])
const name = 'Time Zone'

onMounted(async () => {
  const result = await ctr_time_zone.List()
  timezoneOptions.value = result?.data || []
})
</script>
<template>
  <div class="flex items-center my-4">
    <div class="w-1/4 font-bold">{{ name }}</div>
    <div class="w-3/4">
      <n-select
        v-model:value="accountAdStore.accountAd.time_zone"
        disabled
        filterable
        value-field="utc"
        label-field="text"
        :options="timezoneOptions"
      />
    </div>
  </div>
</template>
