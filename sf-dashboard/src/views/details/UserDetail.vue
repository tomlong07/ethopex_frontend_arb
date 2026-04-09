<script setup lang="ts">
import { User } from '@/class/user'
import { storeToRefs } from 'pinia'

import Skeleton from '@/components/skeleton/SkeletonDetail.vue'
import BackPage from '@/components/common/BackPage.vue'

import InformationCircleOutline from '@/assets/icons/InformationCircleOutline.vue'
import { ctr_permission_settings } from '@/services/ctr_permission_settings'
import { useFeSettings } from '@/composables/feSettings'
import { FeSettings } from '@/class/fe_settings'
import {
  BasedInvoiceOptions,
  PersonnelOptions,
  PubCommission,
  StatusOptions,
} from '@/options/user'
import DirectorSelect from '@/components/user/DirectorSelect.vue'
import LeaderSelect from '@/components/user/LeaderSelect.vue'
import RoleSelect from '@/components/user/RoleSelect.vue'
import LabelSelect from '@/components/user/LabelSelect.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import ModalSyncAccounts from '@/components/user/ModalSyncAccounts.vue'
import { useUserDetailStore } from '@/store/useUserDetailStore'

const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const id = Number(window.route.params.id || 0)

const isAddMode = computed<boolean>(() => {
  return id == 0
})

const isEditMode = computed<boolean>(() => {
  return !isAddMode.value
})

const isDuplicate = computed<boolean>(() => {
  return window.route?.query?.duplicate !== undefined
})

interface AsyncSettings {
  paymentSettings?: boolean
  updateRole?: boolean
}
const isAdm = window.arb.isAdmin()

const asyncSettings = ref<AsyncSettings>()
const modalSync = ref(false)

// store
const Store = useUserDetailStore()
const { user, isLoading, isSubmitBtnLoading, showErr } = storeToRefs(Store)

const rules: any = {
  email: [
    {
      required: true,
      trigger: ['blur', 'input'],
      message: 'Please input email',
    },
    { type: 'email', trigger: 'blur', message: 'Invalid email format' },
  ],
  password: [
    {
      required: true,
      trigger: ['blur', 'input'],
      message: 'Please input password',
    },
  ],
  confirm_password: [
    {
      required: true,
      trigger: ['blur', 'input'],
      message: 'Please input confirm password',
    },
  ],
  status: [{ required: true, message: 'Please select status' }],
}

const getAsyncSetting = async () => {
  const result = await ctr_permission_settings.PermissionAsync(
    window.route?.meta?.url as string
  )

  asyncSettings.value = result?.data || {}
  Store.setAsyncSettings(result?.data || {})
}

onMounted(async () => {
  getAsyncSetting()

  switch (true) {
    case isEditMode.value: {
      await Store.fetchUser(id)
      break
    }

    case isDuplicate.value: {
      const duplicateId = Number(window.route?.query?.duplicate)
      await Store.duplicateUser(duplicateId)
      break
    }

    default: {
      // Reset to default for add mode
      Store.resetUser()
      break
    }
  }
})

const submitForm = async () => {
  await Store.submitForm(feSettings.value?.page_list)
}

const validator = (x: number) => x > 0
</script>
<template>
  <div class="min-h-screen flex flex-col bg-base px-3">
    <div class="wrapper flex flex-col bg-base px-3 flex-1">
      <BackPage
        :url="feSettings?.page_list"
        :name="'User'"
        v-if="feSettings?.page_list"
        class="mt-6"
      />
      <div v-show="isLoading">
        <Skeleton />
      </div>
      <div v-show="!isLoading" class="flex justify-center flex-1">
        <div class="grid gap-4 grid-cols-1 p-5 mt-5 w-full max-w-4xl">
          <n-card
            :title="isAddMode ? 'Add User' : 'Edit User'"
            class="rounded-lg"
          >
            <n-form
              ref="formRef"
              label-placement="left"
              require-mark-placement="right-hanging"
              size="medium"
              label-width="auto"
              :model="user"
              :rules="rules"
              class="flex flex-col gap-4"
            >
              <n-card title="Info" class="card-flex-gap-4 rounded-lg"
                ><FloatingWrapper
                  name="Email"
                  required
                  :error="showErr['email']"
                >
                  <n-input v-model:value="user.email" :disabled="isEditMode" />
                </FloatingWrapper>
                <FloatingWrapper
                  name="Password"
                  :required="!isEditMode"
                  :error="showErr['password']"
                >
                  <n-input
                    v-model:value="user.password"
                    type="password"
                    show-password-on="mousedown"
                    :input-props="{ autocomplete: 'new-password' }"
                    :maxlength="32"
                  />
                </FloatingWrapper>
                <FloatingWrapper
                  :name="'Confirm Password'"
                  :required="!isEditMode"
                >
                  <n-input
                    v-model:value="user.confirm_password"
                    type="password"
                    show-password-on="mousedown"
                    :maxlength="32"
                  />
                </FloatingWrapper>

                <FloatingWrapper
                  name="Select Status"
                  required
                  :error="showErr['status']"
                >
                  <n-select
                    v-model:value="user.status"
                    :options="StatusOptions"
                    placeholder=""
                  />
                </FloatingWrapper>

                <FloatingWrapper name="First Name">
                  <n-input v-model:value="user.first_name" />
                </FloatingWrapper>
                <FloatingWrapper name="Last Name">
                  <n-input v-model:value="user.last_name" /> </FloatingWrapper
              ></n-card>

              <n-card title="Manager" class="card-flex-gap-4 rounded-lg">
                <DirectorSelect v-model="user.presenter" />
                <LeaderSelect v-model="user.leader" />
                <RoleSelect
                  v-model="user.role_id"
                  :show-update-role="asyncSettings?.updateRole"
                  :error="showErr['role_id']"
                />

                <UserAMSelect v-model="user.admin_manager" />

                <FloatingWrapper name="Personnel Type" class="my-4">
                  <template #extra>
                    <div class="flex items-center">
                      <n-popover trigger="hover" placement="right">
                        <template #trigger>
                          <n-icon size="16">
                            <InformationCircleOutline />
                          </n-icon>
                        </template>
                        <span
                          >Distinguish company personnel accounts and external
                          Publisher accounts</span
                        >
                      </n-popover>
                    </div>
                  </template>
                  <n-select
                    v-model:value="user.personnel_type"
                    :options="PersonnelOptions"
                  />
                </FloatingWrapper>
              </n-card>

              <n-card title="Finance" class="card-flex-gap-4 rounded-lg">
                <FloatingWrapper name="Revenue Share Rate">
                  <n-input-number
                    v-model:value="user.revenue_sharing_rate"
                    class="w-full"
                    :validator="validator"
                  />
                </FloatingWrapper>
                <FloatingWrapper name="Based Invoice">
                  <n-select
                    v-model:value="user.based_invoice"
                    clearable
                    placeholder=""
                    :options="BasedInvoiceOptions"
                  />
                </FloatingWrapper>
                <FloatingWrapper name="Rate Share">
                  <n-input-number
                    v-model:value="user.rate_share"
                    class="w-full"
                    min="0"
                  />
                </FloatingWrapper>
                <FloatingWrapper name="Pub Commission">
                  <template #extra>
                    <div class="flex items-center">
                      <n-popover trigger="hover" placement="right">
                        <template #trigger>
                          <n-icon size="16">
                            <InformationCircleOutline />
                          </n-icon>
                        </template>
                        <span>Share commission with the account manager</span>
                      </n-popover>
                    </div>
                  </template>
                  <n-select
                    v-model:value="user.publisher_commission"
                    :options="PubCommission"
                  />
                </FloatingWrapper>
                <div class="flex gap-2 items-center">
                  <div class="text-xs text-gray-500 font-semibold">
                    Build Invoice
                  </div>
                  <CustomSwitch
                    v-model="user.invoice"
                    type="onoff"
                    true-label="ON"
                    false-label="OFF"
                    size="small"
                  />
                </div>
              </n-card>
              <n-card title="Other" class="card-flex-gap-4 rounded-lg">
                <LabelSelect v-model="user.label" />
                <FloatingWrapper name="Domain">
                  <n-input v-model:value="user.domain" />
                </FloatingWrapper>
                <div class="flex gap-2 items-center" v-if="isAdm">
                  <div class="text-xs text-gray-500 font-semibold">
                    Fou Analytics
                  </div>
                  <CustomSwitch
                    v-model="user.fou_analytics"
                    type="onoff"
                    true-label="ON"
                    false-label="OFF"
                    size="small"
                  />
                </div>
              </n-card>
            </n-form>
          </n-card>

          <div class="flex flex-row-reverse gap-2 sticky bottom-2">
            <n-button
              color="#f43f5e"
              size="medium"
              type="success"
              @click="submitForm"
              :loading="isSubmitBtnLoading"
            >
              Submit
            </n-button>
            <n-button
              v-if="Store.asyncSettings.updateManager && isEditMode"
              size="medium"
              type="success"
              @click="modalSync = true"
            >
              Sync Accounts
            </n-button>
          </div>
        </div>
      </div>
    </div>
    <ModalSyncAccounts :user="user" v-model="modalSync" />
  </div>
</template>
