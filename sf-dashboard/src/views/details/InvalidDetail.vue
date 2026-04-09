<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { invalidObj } from '@/types/components/invalid'

import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'

import BackPage from '@/components/common/BackPage.vue'

import ClearAll from '@/assets/icons/ClearAll.vue'
import ctr_demand_source from '@/services/ctr_demand_source'
import PlusLg from '@/assets/icons/PlusLg.vue'
import { ctr_invalid } from '@/services/ctr_invalid'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const id = Number(window.route.params.id || 0)

const isAddPage = computed<boolean>(() => id === 0)
const isEditPage = computed<boolean>(() => !isAddPage.value)

const invalid = ref<invalidObj[]>([
  {
    account_id: [],
    actual_revenue: 1,
    rate_invalid: 1,
    id: id,
    month: '',
    note: '',
    status: 'off',
  },
])

const addNew = () => {
  invalid.value.push({
    account_id: [],
    actual_revenue: 1,
    rate_invalid: 1,
    id: id,
    month: '',
    note: '',
    status: 'off',
  })
}

const name = `invalid`
const textShow = computed<string>(() => {
  return isAddPage.value ? 'Add' : 'Edit'
})
const accountOptions = ref<SelectOption[]>([])
const isLoading = ref<boolean>(false)
const isSubmitBtnLoading = ref<boolean>(false)

const submitForm = async () => {
  if (isAddPage.value) {
    if (confirm(`Are you sure to add new invalid traffic?`)) {
      isSubmitBtnLoading.value = true

      const total = invalid.value.length
      let success = 0
      let failed = 0

      for (let index = 0; index < invalid.value.length; index++) {
        const inv = invalid.value[index]
        const result = await ctr_invalid.Add(inv)
        if (result?.status) {
          success++
        } else {
          failed++

          break
        }
      }

      if (success === total) {
        window.message.success(`Add ${name} successfully`)
        if (feSettings.value?.page_list) {
          window.router.push({ path: feSettings.value.page_list })
        }
      }

      if (failed > 0) {
        window.message.success(`Success: ${success} / ${total}`)
        window.message.error(`Failed: ${failed} / ${total}`)
      }

      isSubmitBtnLoading.value = false
    }

    return
  }

  isSubmitBtnLoading.value = true
  try {
    const result = await ctr_invalid.Edit(invalid.value[0])
    if (result?.status) {
      window.message.success(`Update ${name} successfully`)
    }
  } catch (error) {
    console.error(error)
  }

  isSubmitBtnLoading.value = false
}
const validator = (x: number) => x > 0
const validatorPercent = (x: number) => x > 0 && x <= 100

onMounted(async () => {
  // prepare list demand account
  isLoading.value = true

  const result = await ctr_demand_source.GetAccount({ object: 'adsense' })
  if (result?.status) {
    accountOptions.value = result.data.accounts
  }

  if (isEditPage.value) {
    const oldData = await ctr_invalid.Get(id)

    if (oldData?.status) {
      invalid.value = [oldData.data || {}]
    }
  }
  isLoading.value = false
})

const parse = (input: any) => {
  if (typeof input !== 'string') {
    input = input.toString()
  }
  const nums = input.replace(/,/g, '').trim()
  const numberValue = Number(nums)
  if (/^\d+(\.(\d+)?)?$/.test(nums) && numberValue >= 1) {
    return numberValue
  }
  return nums === '' ? null : Number.NaN
}

const format = (value: number | null) => {
  if (value === null) return ''
  return value.toLocaleString('en-US')
}
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1 items-center">
    <div
      class="flex justify-center mt-6 items-center w-full lg:w-1/2 3xl:w-1/3"
    >
      <div class="w-full">
        <BackPage
          :url="feSettings?.page_list"
          :name="name"
          v-if="feSettings?.page_list"
        />
        <div v-show="isLoading">
          <Skeleton />
        </div>
        <div
          v-show="!isLoading"
          class="flex flex-wrap gap-4 mt-6 mini-size-date"
        >
          <n-card
            :title="`${textShow} ${name}`"
            class="card-flex-gap-4 rounded-xl"
          >
            <n-card
              v-for="(item, index) in invalid"
              :key="index"
              class="card-flex-gap-4 rounded-xl"
            >
              <template #header>{{
                invalid.length > 1 ? `Invalid ${index + 1}` : ''
              }}</template>
              <template #header-extra v-if="invalid.length > 1">
                <n-button text
                  ><n-icon
                    :component="ClearAll"
                    size="10"
                    @click="invalid.splice(index, 1)" /></n-button
              ></template>
              <FloatingWrapper name="Account">
                <n-select
                  v-model:value="item.account_id"
                  filterable
                  value-field="id"
                  label-field="name"
                  placeholder="Select account"
                  :loading="isLoading"
                  :options="accountOptions"
                  :disabled="isEditPage"
              /></FloatingWrapper>
              <!-- amount -->
              <div class="flex gap-4">
                <FloatingWrapper name="Actual Revenue">
                  <n-input-number
                    v-model:value="item.actual_revenue"
                    :validator="validator"
                    :parse="parse"
                    :format="format"
                  >
                    <template #prefix> $ </template>
                  </n-input-number></FloatingWrapper
                >

                <!-- <FloatingWrapper name="Rate Invalid">
                  <n-input-number
                    v-model:value="item.rate_invalid"
                    :validator="validatorPercent"
                  >
                    <template #suffix> % </template>
                  </n-input-number></FloatingWrapper
                >   -->

                <FloatingWrapper name="Invalid Revenue">
                  <n-input-number
                    v-model:value="item.invalid_revenue"
                    :validator="validator"
                    :parse="parse"
                    :format="format"
                  >
                    <template #prefix> $ </template>
                  </n-input-number></FloatingWrapper
                >
              </div>
              <FloatingWrapper name="Note">
                <n-input
                  v-model:value="item.note"
                  type="textarea"
                  placeholder="Enter the note ..."
              /></FloatingWrapper>

              <FloatingWrapper name="Month" rounded>
                <VueDatePicker
                  v-model="item.month"
                  month-picker
                  format="yyyy/MM"
                  :clearable="false"
                  model-type="yyyy-MM"
                  :disabled="isEditPage"
              /></FloatingWrapper>
            </n-card>

            <n-button
              round
              class="w-14 ml-auto"
              size="small"
              @click="addNew"
              v-if="isAddPage"
              ><n-icon :component="PlusLg" size="18"
            /></n-button>
          </n-card>
        </div>
        <div class="flex flex-row-reverse sticky bottom-2 pt-4">
          <n-button
            class="right-6"
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
</template>
<style lang="scss">
.dp__action_buttons {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-end;
  margin-inline-start: auto;
}

.mini-size-date {
  .n-card-header__main {
    font-size: 15px;
  }
  .dp__input,
  .dp__instance_calendar {
    font-size: 12px;
  }
}
</style>
