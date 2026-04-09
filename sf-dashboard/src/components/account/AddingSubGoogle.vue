<script setup lang="ts">

import { SelectOption } from 'naive-ui'

import { ctr_time_zone } from '@/services/ctr_time_zone'
import { PayloadAddAccountGoogle } from '@/types/components/account'
import { ctr_account } from '@/services/ctr_account'
import Minus from '@/assets/icons/Minus.vue'
import Plus from '@/assets/icons/Plus.vue'

const props = defineProps({
  id: {
    type: Number,
    required: false,
    default: 0,
  },

  object: {
    type: String,
    required: false,
    default: '',
  },
})

const MAX = 30

const nameTitle = computed<string>(() => {
  return props.object
    ? helper.capitalizeFirstLetter(props.object)
    : 'Google Ads'
})
const isShowModel = ref<boolean>(false)

const accountGGV2 = ref<PayloadAddAccountGoogle>(new PayloadAddAccountGoogle())

const isSubmitBtnLoading = ref<boolean>(false)
const timezoneOptions = ref<SelectOption[]>([])

const clickAddAccount = () => {
  isShowModel.value = true
}

const submitFormSubAccount = async () => {
  isSubmitBtnLoading.value = true
  const result = await ctr_account.AddAccountAds(props.id, accountGGV2.value)
  isSubmitBtnLoading.value = false
  if (result?.status) {
    window.message.success('Submit successfully!')
    isShowModel.value = false
    setTimeout(function () {
      location.reload()
    }, 1000)
  }
  return
}

const resetForm = () => {
  accountGGV2.value = new PayloadAddAccountGoogle()
  return
}

onMounted(async () => {
  const result = await ctr_time_zone.List()
  if (result?.status) {
    timezoneOptions.value = result.data
  } else {
    window.message.error(
      `Fetch timezone failed: ${result?.errors[0].window.message}`
    )
  }
  // fetchDemandAccountOptions();
})

const removeThisItem = (index: number) => {
  accountGGV2.value.items?.splice(index, 1)
}

const addItem = () => {
  accountGGV2.value.addItems()
}
</script>
<template>
  <n-button
    color="#f43f5e"
    size="small"
    type="success"
    class="m-1"
    @click="clickAddAccount"
  >
    Add Accounts
  </n-button>
  <!-- model popup -->
  <n-modal
    v-model:show="isShowModel"
    :on-after-leave="() => resetForm()"
    preset="dialog"
    :show-icon="false"
    style="width: 70vw"
  >
    <n-card
      :title="`Add ${nameTitle} Accounts`"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <div class="mt-6">
        <n-card
          title="Account"
          class="mb-4 mt-4 card-rule-condition card-flex-gap-4"
        >
          <div
            class="rows-condition flex w-full gap-4"
            v-for="(account, index) in accountGGV2.items"
            :key="index"
          >
            <div class="flex w-full items-center gap-4">
              <div class="w-1/2">
                <div class="bold text-gray-500">Name</div>
                <div>
                  <n-input
                    v-model:value="account.show_name"
                    placeholder="Enter the name account"
                    class="w-96"
                  />
                </div>
              </div>
              <div class="w-1/2">
                <div class="bold text-gray-500">Account Id</div>
                <div>
                  <n-input
                    v-model:value="account.account_id"
                    placeholder="Enter the account id"
                    class="w-96"
                  />
                </div>
              </div>
            </div>

            <div>
              <div class="bold text-gray-500">&nbsp;</div>
              <n-button-group>
                <n-button
                  ghost
                  class="dynamic-button"
                  :disabled="accountGGV2.items?.length === 1"
                  @click="removeThisItem(index)"
                >
                  <template #icon>
                    <n-icon size="12" :component="Minus" />
                  </template>
                </n-button>
                <n-button
                  ghost
                  class="dynamic-button"
                  @click="addItem"
                  :disabled="accountGGV2.items?.length >= MAX"
                >
                  <template #icon>
                    <n-icon size="12" :component="Plus"></n-icon>
                  </template>
                </n-button>
              </n-button-group>
            </div>
          </div>
        </n-card>
      </div>

      <!-- group button -->
      <div class="flex flex-row-reverse sticky bottom-0 p-2">
        <n-button
          color="#f43f5e"
          size="medium"
          type="success"
          class="ml-2"
          :loading="isSubmitBtnLoading"
          @click="submitFormSubAccount"
        >
          Submit
        </n-button>
      </div>
    </n-card>
  </n-modal>
</template>
<style lang="scss">
.required:after {
  content: ' *';
  color: red;
}
</style>
