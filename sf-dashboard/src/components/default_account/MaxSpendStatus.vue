<script lang="ts" setup>
import { useDefaultAccount } from '@/store/details/defaultAccount'
import CustomSwitch from '../common/CustomSwitch.vue'
const defaultAccountStore = useDefaultAccount()
const name = `Max Spend Status`
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="w-28 font-bold text-xs text-gray-500">{{ name }}</div>
    <div class="flex-1 min-w-0">
      <CustomSwitch
        v-model="defaultAccountStore.defaultAccountData.max_spend_status"
        type="onoff"
        true-label="On"
        false-label="Off"
        size="small"
      />
    </div>
  </div>
</template>
