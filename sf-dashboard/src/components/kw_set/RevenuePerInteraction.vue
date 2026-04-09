<template>
  <FloatingWrapper name="Keyword Ranking">
    <template #extra>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon size="12"> <QuestionCircleRegular /> </n-icon>
        </template>
        <span>Sort keywords by RPC or RPM</span>
      </n-popover>
    </template>
    <div class="flex">
      <n-select
        v-model:value="kwsetStore.dataConfig.rpi"
        :options="rpiOptions"
      />
    </div>
  </FloatingWrapper>
</template>
<script setup lang="ts">
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { useKeywordSetStore } from '@/store/details/kwsetStore'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { rpiOptions } from '@/options/kw_set'
const kwsetStore = useKeywordSetStore()
</script>
