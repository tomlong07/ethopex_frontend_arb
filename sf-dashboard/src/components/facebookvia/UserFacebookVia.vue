<template>
  <FloatingWrapper
    :name="name"
    :required="true"
    :error="facebookConfig.showErr['user']"
  >
    <n-select
      v-model:value="facebookConfig.dataConfig.user_id"
      :loading="facebookConfig.selectData.loadingUser"
      :options="facebookConfig.selectData.users"
      :placeholder="''"
      remote
      filterable
      @search="handleSearchUser"
    />
  </FloatingWrapper>
</template>
<script setup lang="ts">
import { useFacebookViaStore } from '@/store/details/useFacebookViaStore'
import { debounceV2 } from '@/utils'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const facebookConfig = useFacebookViaStore()
const name = 'User'

const handleSearchUser = debounceV2(async (q: string) => {
  await facebookConfig.selectData.getUsers(facebookConfig.dataConfig.user_id, q)
}, 300)
</script>
