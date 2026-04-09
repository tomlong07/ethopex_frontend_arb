<script setup lang="ts">
import useTestBudgetStore from '@/store/useTestBudgetStore'

import { ctr_test_budget } from '@/services/ctr_test_budget'
import { useTemplateV2 } from '@/store/templateV2Store'

const templateV2Store = useTemplateV2(helper.truePath())()

const testBudgetStore = useTestBudgetStore()

const isSubmitting = ref(false)

const submitForm = async () => {
  const result = await ctr_test_budget.Bonus(testBudgetStore.payloadBonus)

  if (result?.status) {
    testBudgetStore.showModal = false
    window.message.success(`Submit success!`)

    templateV2Store.gridApiV2?.forEachNode((node) => {
      const isSelected = templateV2Store.itemSelectedV2.some(
        (item) => testBudgetStore.userId === node.data.userId
      )

      if (isSelected) {
        node.setData({
          ...node.data,
          bonus_amount: result?.data || 0,
        })
      }
    })
  }
}
</script>

<template>
  <n-modal v-model:show="testBudgetStore.showModal">
    <n-card
      style="width: 500px; height: 300px"
      title="Add Bonus"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <div style="height: 100px" class="flex gap-4 flex-col">
        <div class="flex items-center gap-4">
          <div class="w-1/6 font-bold text-right">User</div>
          <div class="w-5/6">
            <n-input :value="testBudgetStore.user" disabled></n-input>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="w-1/6 font-bold text-right">Amount</div>
          <div class="w-5/6">
            <n-input-number
              :min="1"
              :max="50000"
              v-model:value="testBudgetStore.amount"
            ></n-input-number>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <n-popconfirm @positive-click="submitForm">
            <template #trigger>
              <n-button
                class="button-apply"
                color="#f43f5e"
                :loading="isSubmitting"
              >
                Submit
              </n-button>
            </template>
            {{ `Are you sure to add $${testBudgetStore.amount} bonus?` }}
          </n-popconfirm>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>
