<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

import Settings20Regular from '@/assets/icons/Settings20Regular.vue'
import useTestBudgetStore from '@/store/useTestBudgetStore'
import PlusLg from '@/assets/icons/PlusLg.vue'

const testBudgetStore = useTestBudgetStore()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const addBonus = () => {
  testBudgetStore.userId = props.params.data.user_id
  testBudgetStore.user = props.params.data.user
  testBudgetStore.amount = 1
  testBudgetStore.showModal = true
}
</script>
<template>
  <div class="flex w-full h-full items-center">
    <router-link
      :to="`test-budget/update?user_id=${props.params.data.user_id}`"
    >
      <n-icon
        size="35"
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        title="Edit"
        :component="Settings20Regular"
      />
    </router-link>

    <n-icon
      size="35"
      class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
      title="Add Bonus"
      :component="PlusLg"
      @click="addBonus"
    ></n-icon>
  </div>
</template>
