<script setup lang="ts">
import useHeaderStore from '@/store/useHeaderStore'

const headerStore = useHeaderStore()

onMounted(() => {
  testBudgetHandle()
})

const testBudgetHandle = () => {
  if (window.arb?.user?.userId) {
    headerStore.fetchBudgetRemaining(window.arb?.user?.userId)
  }
}
</script>

<template>
  <n-tag
    round
    :bordered="false"
    class="font-semibold bg-indigo-100 text-xs max-w-24"
    :title="headerStore.amountUserTestBudget.budgetRemainingShow()"
  >
    <div class="overflow-hidden text-ellipsis max-w-20">
      Test: {{ headerStore.amountUserTestBudget.budgetRemainingShow() }}
    </div>
  </n-tag>
</template>
