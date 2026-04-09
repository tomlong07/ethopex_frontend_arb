<script setup lang="ts">
import Checkmark from '@/assets/icons/Checkmark.vue'
import Close from '@/assets/icons/Close.vue'
import promptRuleStore from '@/store/details/promptRuleStore'
const usePromtRule = promptRuleStore()
</script>

<template>
  <div class="flex items-center">
    <div class="w-150-px font-bold">Status</div>
    <div class="w-calc-150-px">
      <n-switch
        v-model:value="usePromtRule.dataConfig.status"
        checked-value="on"
        unchecked-value="off"
      >
        <template #checked-icon>
          <n-icon :component="Checkmark" color="#121212" />
        </template>
        <template #unchecked-icon> <n-icon :component="Close" /> </template
      ></n-switch>
    </div>
  </div>
</template>
