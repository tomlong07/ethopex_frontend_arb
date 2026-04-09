<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import useRoleStore from '@/store/useRoleStore'
import { useTemplateV2 } from '@/store/templateV2Store'
import { ctr_roles } from '@/services/ctr_roles'

const roleStore = useRoleStore()
const templateV2Store = useTemplateV2(helper.truePath())()

const demandAccountOptions = ref<SelectOption[]>([])
const isLoading = ref<boolean>(false)

//Lấy thông tin ở store để sử dụng
watch(
  () => roleStore.showModal,
  async (newValue, oldValue) => {
    if (newValue) {
      isLoading.value = true
      const result = await ctr_roles.PreCreate()
      demandAccountOptions.value = result?.data?.account_demand || []
      isLoading.value = false
    }
  }
)

const onChangeDemandAccount = async () => {
  roleStore.isSubmitting = true

  const errId: number[] = []
  for (const item of templateV2Store.itemSelectedV2) {
    item.account_demand = roleStore.accountDemandTo
    const result = await ctr_roles.Update(item.id, item)
    if (!result?.status) {
      errId.push(item.id)
    }
  }

  if (errId.length === 0) {
    window.message.success(
      'All roles for the account demand were changed successfully!'
    )
    roleStore.showModal = false

    templateV2Store.itemSelectedV2 = []

    templateV2Store.reInitTable()
  } else {
    window.message.error(
      `List role was error when change account demand: ${errId}`
    )
  }

  roleStore.isSubmitting = false
}
</script>

<template>
  <n-modal v-model:show="roleStore.showModal">
    <n-card
      style="width: 1000px"
      title="Select account you want to set"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <div class="flex">
        <!-- account of demand -->
        <div class="flex my-4 w-full">
          <div class="w-1/5 font-bold">Account Demand</div>
          <div class="w-4/5 flex flex-col">
            <n-select
              v-model:value="roleStore.accountDemandTo"
              label-field="value"
              value-field="key"
              placeholder="Select demand source"
              filterable
              multiple
              :options="demandAccountOptions"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <n-button
            class="button-apply"
            color="#f43f5e"
            :loading="isLoading"
            @click="onChangeDemandAccount()"
          >
            Submit
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>
