<script setup lang="ts">
import { FormRules } from 'naive-ui'

import { billingType } from '@/types/components/user'
import Skeleton from '@/components/skeleton/SkeletonDetailCenter.vue'
import { ctr_user } from '@/services/ctr_user'
import { MethodOptions } from '@/options/billing'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const isSubmitBtnLoading = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const billingConfig = ref<billingType>({
  method: '',
  paypal_email: '',
  payoneer_email: '',
  pingpong_email: '',
  cryptocurrency: '',
  wallet_id: '',
  beneficiary_name: '',
  bank_name: '',
  bank_address: '',
  bank_account_number: '',
  bank_routing_number: '',
  bank_iban_number: '',
  swift_code: '',
  ifsc_code: '',
})
const rules: FormRules = {
  beneficiary_name: [
    {
      required: true,
      trigger: ['input', 'blur'],
      message: 'Beneficiary Name required',
    },
  ],
  bank_name: [
    {
      required: true,
      trigger: ['input', 'blur'],
      message: 'Bank Name required',
    },
  ],
  bank_address: [
    {
      required: true,
      trigger: ['input', 'blur'],
      message: 'Bank Address required',
    },
  ],
  bank_account_number: [
    {
      required: true,
      trigger: ['input', 'blur'],
      message: 'Bank Account Number required',
    },
  ],
  bank_routing_number: [
    {
      required: true,
      trigger: ['input', 'blur'],
      message: 'Bank Routing Number required',
    },
  ],
  bank_iban_number: [
    {
      required: true,
      trigger: ['input', 'blur'],
      message: 'Bank Iban required',
    },
  ],
  swift_code: [
    {
      required: true,
      trigger: ['input', 'blur'],
      message: 'Swift Code required',
    },
  ],
  ifsc_code: [
    {
      required: true,
      trigger: ['input', 'blur'],
      message: 'Ifsc Code required',
    },
  ],
  paypal_email: [
    {
      required: true,
      trigger: ['input', 'blur'],
      message: 'Paypal Email required',
    },
    {
      type: 'email',
      trigger: ['input', 'blur'],
      message: 'Paypal Email invalid',
    },
  ],
  payoneer_email: [
    {
      required: true,
      trigger: ['input', 'blur'],
      message: 'Payoneer Email required',
    },
    {
      type: 'email',
      trigger: ['input', 'blur'],
      message: 'Payoneer Email invalid',
    },
  ],
  pingpong_email: [
    {
      required: true,
      trigger: ['input', 'blur'],
      message: 'PingPong Email required',
    },
    {
      type: 'email',
      trigger: ['input', 'blur'],
      message: 'PingPong Email invalid',
    },
  ],
}

const formItems: { path: keyof billingType; label: string }[] = [
  { path: 'beneficiary_name', label: 'Beneficiary Name' },
  { path: 'bank_name', label: 'Bank Name' },
  { path: 'bank_address', label: 'Bank Address' },
  { path: 'bank_account_number', label: 'Bank Account Number' },
  { path: 'bank_routing_number', label: 'Bank Routing Number' },
  { path: 'bank_iban_number', label: 'Bank Iban Number' },
  { path: 'swift_code', label: 'Swift Code' },
  { path: 'ifsc_code', label: 'IFSC Code' },
]

const infomationError = ref<any>({})
const showErr = computed(() => {
  const _errors = infomationError.value?.errors || []

  return _errors.reduce((acc: any, err: any) => {
    acc[err.id] = err.message
    return acc
  }, {} as Record<string, string>)  
})

onMounted(async () => {
  isLoading.value = true
  //do something
  const result = await ctr_user.Billing()
  if (result?.status) {
    billingConfig.value = result.data
  }
  isLoading.value = false
})

const submitForm = async () => {
  isSubmitBtnLoading.value = true

  const result = await ctr_user.UpdateBilling(billingConfig.value)
  if (result?.status) {
    window.message.success(`Submit success!`)
  } else {
    infomationError.value = result
  }
  isSubmitBtnLoading.value = false
}
</script>
<template>
  <div
    class="wrapper flex flex-col bg-base px-3 flex-auto justify-self-auto pt-8"
  >
    <div v-show="isLoading">
      <Skeleton />
    </div>
    <div class="flex justify-center items-start">
      <div class="w-full max-w-[923px]">
        <div v-show="!isLoading" class="flex flex-col items-center justify-center">
          <n-card
            title="Billing"
          >
            <n-form
              label-placement="left"
              :model="billingConfig"
              :rules="rules"
              :label-width="195"
            >
              <n-form-item path="methods" >
                <FloatingWrapper
                  name="Methods"
                  required
                  :error="showErr['first_name']"
                >
                  <n-select
                    v-model:value="billingConfig.method"
                    filterable
                    :options="MethodOptions"
                  />
                </FloatingWrapper>
              </n-form-item>
              <n-collapse-transition :show="billingConfig.method == 'bank'">
                <n-card
                  class="flex mb-4 ml-auto w-full"
                >
                  Minimum Payment Threshold:
                  <span class="font-bold">1,500 USD</span>
                  <n-divider />
                  Please choose other payment methods if your revenue has not
                  reached $1500 for the best support.
                </n-card>

                <div>
                  <n-form-item
                    v-for="item in formItems"
                    :key="item.path"
                  >
                    <FloatingWrapper
                      :name="item.label"
                      :error="showErr[item.path]"
                    >
                      <n-input v-model:value="billingConfig[item.path]" />
                    </FloatingWrapper>
                  </n-form-item>
                </div>
              </n-collapse-transition>
              <n-collapse-transition :show="billingConfig.method == 'paypal'">
                <n-form-item path="paypal_email">
                  <FloatingWrapper
                    name="Paypal Email"
                    required
                    :error="showErr['paypal_email']"
                  >
                    <n-input v-model:value="billingConfig.paypal_email" />
                  </FloatingWrapper>
                </n-form-item>
              </n-collapse-transition>
              <n-collapse-transition :show="billingConfig.method == 'payoneer'">
                <n-form-item path="payoneer_email">
                  <FloatingWrapper
                    name="Payoneer Email"
                    required
                    :error="showErr['payoneer_email']"
                  >
                    <n-input v-model:value="billingConfig.payoneer_email" />
                  </FloatingWrapper>
                </n-form-item>
              </n-collapse-transition>
              <n-collapse-transition :show="billingConfig.method == 'pingpong'">
                <n-form-item path="pingpong_email">
                  <FloatingWrapper
                    name="PingPong Email"
                    required
                    :error="showErr['pingpong_email']"
                  >
                    <n-input v-model:value="billingConfig.pingpong_email" />
                  </FloatingWrapper>
                </n-form-item>
              </n-collapse-transition>
            </n-form>
          </n-card>
          <div class="w-full flex flex-row-reverse sticky bottom-0 py-2">
            <n-button
              color="#f43f5e"
              size="medium"
              type="success"
              :loading="isSubmitBtnLoading"
              @click="submitForm"
            >
              Submit
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
