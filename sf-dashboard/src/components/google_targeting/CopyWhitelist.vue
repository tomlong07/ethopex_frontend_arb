<script setup lang="ts">
import CopyOutline from '@/assets/icons/CopyOutline.vue'
import { ctr_google_targeting } from '@/services/ctr_google_targeting'

const copyAll = async () => {
  let result = await ctr_google_targeting.GoogleTargetingCopy()

  if (result?.status && result?.data?.items) {
    helper.copyText(result.data.items.join('\n'))

    window.message.success(`Copy all whitelist success.`)
  }
}
</script>

<template>
  <div class="flex items-center">
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-icon
          size="20"
          class="cursor-pointer hover:text-blue-500"
          @click="copyAll"
        >
          <CopyOutline />
        </n-icon>
      </template>
      Copy all whitelist
    </n-tooltip>
  </div>
</template>
