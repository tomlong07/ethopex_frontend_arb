<script setup lang="ts">
import { profileType } from '@/types/components/user'
import Skeleton from '@/components/skeleton/SkeletonDetailCenter.vue'

import { ctr_user } from '@/services/ctr_user'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import useAutoErrors from '@/composables/useAutoErrors'

const isSubmitBtnLoading = ref(false)
const isLoading = ref<boolean>(false)
const profileConfig = ref<profileType>({
  email: '',
  first_name: '',
  last_name: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  country: '',
  phone_number: '',
})

const { rawErrors, errors } = useAutoErrors(profileConfig)

onMounted(async () => {
  getProfileDetail()
})
const getProfileDetail = async () => {
  isLoading.value = true
  const res = await ctr_user.Profile()
  if (res.status) {
    profileConfig.value = res.data
  }
  isLoading.value = false
}

const submitForm = async () => {
  isSubmitBtnLoading.value = true
  const result = await ctr_user.UpdateProfile(profileConfig.value)

  rawErrors.value = result?.errors || []

  if (result?.status) {
    window.message.success('Update profile successfully!')
  }
  isSubmitBtnLoading.value = false
}

const copyKey = () => {
  if (!profileConfig.value.key_api) return
  helper.copyText(profileConfig.value.key_api)
  window.message.success('Copied')
}
</script>
<template>
  <div
    class="wrapper flex flex-col bg-base px-3 flex-auto justify-self-auto pt-8 text-left"
  >
    <Skeleton v-if="isLoading" />
    <div v-else class="flex justify-center gap-6">
      <n-card
        title="Profile"
        class="2xl:w-1/3 xl:w-1/3 lg:w-2/3 md:w-2/3 sm:w-2/3 custom-form-profile"
      >
        <div class="flex flex-col gap-4">
          <FloatingWrapper name="Email">
            <n-input
              v-model:value="profileConfig.email"
              :disabled="true"
              @keydown.enter.prevent
            />
          </FloatingWrapper>

          <FloatingWrapper
            name="First Name"
            :required="true"
            :error="errors.first_name"
          >
            <n-input v-model:value="profileConfig.first_name" />
          </FloatingWrapper>

          <FloatingWrapper
            name="Last Name"
            :required="true"
            :error="errors?.last_name"
          >
            <n-input v-model:value="profileConfig.last_name" />
          </FloatingWrapper>

          <FloatingWrapper
            name="Address"
            :required="true"
            :error="errors?.address"
          >
            <n-input v-model:value="profileConfig.address" />
          </FloatingWrapper>

          <FloatingWrapper name="City" :required="true" :error="errors?.city">
            <n-input v-model:value="profileConfig.city" />
          </FloatingWrapper>

          <FloatingWrapper name="State" :required="true" :error="errors?.state">
            <n-input v-model:value="profileConfig.state" />
          </FloatingWrapper>

          <FloatingWrapper
            name="Zip Code"
            :required="true"
            :error="errors?.zip_code"
          >
            <n-input v-model:value="profileConfig.zip_code" />
          </FloatingWrapper>

          <FloatingWrapper
            name="Country"
            :required="true"
            :error="errors?.country"
          >
            <n-input v-model:value="profileConfig.country" />
          </FloatingWrapper>

          <FloatingWrapper
            name="Phone Number"
            :required="true"
            :error="errors?.phone_number"
          >
            <n-input v-model:value="profileConfig.phone_number" />
          </FloatingWrapper>

          <FloatingWrapper name="API Key" v-if="profileConfig.key_api">
            <div class="flex items-center gap-2">
              <n-input
                v-model:value="profileConfig.key_api"
                readonly
                type="password"
                :input-props="{ autocomplete: 'new-password' }"
                show-password-on="click"
              />
              <n-button size="small" @click="copyKey"> Copy </n-button>
            </div>
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
