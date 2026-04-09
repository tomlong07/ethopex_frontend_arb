<script setup lang="ts">
import Power from '@/assets/icons/Power.vue'
import MagicIcon from '@/assets/icons/MagicIcon.vue'
import Detail from '@/assets/icons/Detail.vue'
import GooglePerformanceRule from '@/store/useGooglePerformanceRule'
import ModalSatify from './GGPerformanceModalSatify.vue'
const useGooglePerformanceRule = GooglePerformanceRule()

const id = Number(window.route.params.id || 0)
const status = useGooglePerformanceRule.QuestionConfig?.status
</script>

<template>
  <div class="flex justify-end -mt-[50px] mb-4">
    <div class="flex gap-3">
      <n-popconfirm
        positive-text="Start!"
        @positive-click="useGooglePerformanceRule.startRule(id, false)"
      >
        <template #trigger>
          <n-button size="medium" type="info">
            <template #icon>
              <n-icon>
                <Power />
              </n-icon>
            </template>
            Start Rule
          </n-button>
        </template>
        Confirm To Start Rule
      </n-popconfirm>

      <n-popconfirm
        positive-text="Apply!"
        @positive-click="useGooglePerformanceRule.applyRule(id)"
      >
        <template #trigger>
          <n-button size="medium" type="warning">
            <template #icon>
              <n-icon>
                <MagicIcon />
              </n-icon> </template
            >Apply Rule</n-button
          >
        </template>
        Confirm to Apply Rule
      </n-popconfirm>

      <n-button
        size="medium"
        type="success"
        @click="useGooglePerformanceRule.satisfyRule(id, status)"
      >
        <template #icon>
          <n-icon>
            <Detail />
          </n-icon>
        </template>
        Satify</n-button
      >
      <ModalSatify />
    </div>
  </div>
</template>
