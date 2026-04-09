<script setup lang="ts">
import useAccountAd from '@/store/useAccountAd'
import MccFilter from '../cell/MccFilter.vue'
import MccTable from '../cell/MccTable.vue'

const accountAdStore = useAccountAd()
onMounted(() => {
  accountAdStore.getFilterMcc()
})
</script>

<template>
  <n-grid class="mt-6" x-gap="12" :cols="1">
    <n-gi>
      <n-card class="mb-4">
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">Mcc name</div>
          <div class="w-3/4">
            <n-select
              v-model:value="accountAdStore.tabAccountMcc.name"
              clearable
              filterable
              placeholder="Mcc name"
              :options="accountAdStore.mccOptions"
            />
          </div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">Number</div>
          <div class="w-3/4">
            <n-input-number
              v-model:value="accountAdStore.tabAccountMcc.count"
              placeholder="Number account"
              :show-button="false"
            />
          </div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">Time delay</div>
          <div class="w-3/4">
            <n-input-number
              v-model:value="accountAdStore.tabAccountMcc.time_delay"
              placeholder="Time delay"
              :show-button="false"
            />
          </div>
        </div>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card title="Account Mcc" class="mb-4">
        <div class="w-full min-h-[400px]">
          <MccFilter />
          <MccTable />
        </div>
      </n-card>
    </n-gi>
  </n-grid>
</template>
