<script setup lang="ts">
import { FormItemInst } from 'naive-ui'

import { passwordType } from '@/types/components/user'

import Skeleton from '@/components/skeleton/SkeletonDetailCenter.vue'
import { ctr_user } from '@/services/ctr_user'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import useAutoErrors from '@/composables/useAutoErrors'

const isSubmitBtnLoading = ref(false)
const isLoading = ref<boolean>(false)

const rPasswordFormItemRef = ref<FormItemInst | null>(null)
const passwordConfig = ref<passwordType>({
  old_password: '',
  new_password: '',
  confirm_password: '',
})

const { rawErrors, errors } = useAutoErrors(passwordConfig)
function handlePasswordInput() {
  if (passwordConfig.value.confirm_password) {
    rPasswordFormItemRef.value?.validate({ trigger: 'password-input' })
  }
}

const submitForm = async () => {
  isSubmitBtnLoading.value = true
  const result = await ctr_user.ChangePassword(passwordConfig.value)
  rawErrors.value = result?.errors || []
  if (result?.status) {
    window.message.success('Submit successfully!')
    helper.UserLogOut()
  }
  // do something
  isSubmitBtnLoading.value = false
}
</script>
<template>
  <div
    class="wrapper flex flex-col bg-base px-3 flex-auto justify-self-auto pt-8 text-left"
  >
    <div v-show="isLoading">
      <Skeleton />
    </div>
    <div v-show="!isLoading" class="flex justify-center">
      <n-card
        title="Change Password"
        class="2xl:w-1/3 xl:w-1/3 lg:w-2/3 md:w-2/3 sm:w-2/3 custom-form-profile change-pass-card"
      >
        <div class="flex flex-col gap-4">
          <FloatingWrapper
            name="Old Password"
            :required="true"
            :error="errors.old_password"
          >
            <n-input
              v-model:value="passwordConfig.old_password"
              type="password"
              show-password-on="mousedown"
              placeholder="Password"
              :maxlength="32"
            />
          </FloatingWrapper>

          <FloatingWrapper
            name="New Password"
            :required="true"
            :error="errors.new_password"
          >
            <n-input
              v-model:value="passwordConfig.new_password"
              :maxlength="32"
              type="password"
              show-password-on="mousedown"
              placeholder="New Password"
              @input="handlePasswordInput"
              @keydown.enter.prevent
            />
          </FloatingWrapper>

          <FloatingWrapper
            name="Confirm Password"
            :required="true"
            :error="errors.confirm_password"
          >
            <n-input
              v-model:value="passwordConfig.confirm_password"
              type="password"
              placeholder="Confirm Password"
              show-password-on="mousedown"
              :maxlength="32"
              :disabled="!passwordConfig.new_password"
              @keydown.enter.prevent
            />
          </FloatingWrapper>
        </div>
      </n-card>
    </div>
    <div class="flex flex-row-reverse sticky bottom-0 p-2">
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
</template>
