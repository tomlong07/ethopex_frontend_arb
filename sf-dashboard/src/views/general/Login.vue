<script setup lang="ts">
import { FormInst, FormRules } from 'naive-ui'

import { ModelType } from '@/types/state/user'
import useGeneralStore from '@/store/useGeneralStore'
import { ctr_user } from '@/services/ctr_user'
import Google from '@/assets/icons/Google.vue'
import GameControllerOutline from '@/assets/icons/GameControllerOutline.vue'
import { LOCAL_BACK_URL, LOCAL_STORAGE_TOKEN } from '@/constants/storage'
import { CDN_IMAGE_MINIO_S3 } from '@/constants/urls'

const generalStore = useGeneralStore()

const loadingRef = ref(false)
const showSpin = ref(false)
const formRef = ref<FormInst | null>(null)
const modelRef = ref<ModelType>({
  email: null,
  password: null,
})

const props = defineProps({
  isModal: {
    type: Boolean,
    default: false,
    required: false,
  },
})

const code: string = helper.getParams('code') || ''

const backURL = decodeURIComponent(localStorage.getItem(LOCAL_BACK_URL) || '/')

const isPageLogin = computed(() => {
  return !props.isModal
})

onBeforeMount(async () => {
  if (code) {
    await loginByCode()
  }
})

const handleStorageChange = (event: any) => {
  if (event.key === LOCAL_STORAGE_TOKEN) {
    generalStore.changeModalLogin(false)
  }
}

onMounted(async () => {
  if (props.isModal) {
    window.addEventListener('storage', handleStorageChange)
  }
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
})

const loginByCode = async () => {
  showSpin.value = true
  const res = await ctr_user.GoogleCallbackHandler({
    code: code,
  })
  if (res?.status) {
    loginProcess(res.data)
    return
  }
  showSpin.value = false
}

const rules: FormRules = {
  email: [
    {
      required: true,
      message: 'Email is required',
      trigger: ['input', 'blur'],
    },
    {
      type: 'email',
      message: 'Email must be a valid email address',
      trigger: ['input', 'blur'],
    },
  ],
  password: [
    {
      required: true,
      message: 'Password is required',
      trigger: ['input', 'blur'],
    },
  ],
}

const loginProcess = (dataRes: any) => {
  localStorage.setItem(LOCAL_STORAGE_TOKEN, JSON.stringify(dataRes))

  if (isPageLogin.value) {
    window.location.href = backURL
  } else {
    generalStore.changeModalLogin(false)
  }
}

const handleClickLogin = async (e: Event) => {
  e.preventDefault()
  loadingRef.value = true
  formRef.value?.validate(async (errors) => {
    if (errors) {
      loadingRef.value = false
      window.message.error('Please complete all information')
      return
    }

    const res = await ctr_user.LoginPost({
      email: modelRef.value.email,
      password: modelRef.value.password,
      remember: true,
    })
    if (res?.status) {
      loginProcess(res.data)
      return
    }

    loadingRef.value = false
  })
}

const api = import.meta.env.VITE_END_POINT || ''

const apiLink = api ? api + '/user/gg_login' : ''

const isShowNormalLogin = computed(() => {
  return helper.isLocal() || helper.isDevelopment()
})
</script>
<template>
  <n-spin :show="showSpin">
    <div class="flex min-h-screen login-screen custom-login-dark-mode">
      <div
        class="flex w-full login-left"
        v-if="isPageLogin"
        :style="{
          backgroundImage: `url(${CDN_IMAGE_MINIO_S3}/arb/images/login-background.jpg)`,
        }"
      />
      <div
        class="flex flex-col px-8 bg-gray-200 justify-center login-right"
        :class="{
          'fixed top-72 h-1/2 shadow-2xl border-solid border-stone-800	 border rounded modal-login-custom':
            props.isModal,
        }"
      >
        <!-- logo and name of site -->
        <div class="flex w-full align-middle items-center justify-center">
          <div class="flex">
            <n-icon size="40">
              <GameControllerOutline />
            </n-icon>
          </div>
          <div class="flex font-bold text-3xl">PUBPOWER</div>
        </div>
        <!-- Login form -->

        <!-- Local login bằng email pass -->
        <n-form
          ref="formRef"
          :model="modelRef"
          size="large"
          :rules="rules"
          v-if="isShowNormalLogin"
        >
          <!-- <n-form ref="formRef" :model="modelRef" size="large" :rules="rules"> -->
          <div class="flex font-semibold text-2xl pb-4 pt-4">Log in</div>
          <n-form-item path="email" label="Email" class="mb-2">
            <n-input
              v-model:value="modelRef.email"
              type="text"
              placeholder="Email"
              @keyup.enter="handleClickLogin"
            />
          </n-form-item>
          <n-form-item path="password" label="Password" class="mb-2">
            <n-input
              v-model:value="modelRef.password"
              type="password"
              placeholder="Password"
              @keyup.enter="handleClickLogin"
            />
          </n-form-item>
          <n-button
            :loading="loadingRef"
            icon-placement="left"
            color="#f43f5e"
            class="w-full px-4 py-4 text-white text-base"
            @click="handleClickLogin"
          >
            Log In
          </n-button>
        </n-form>

        <!-- Bản chạy login bằng google -->
        <n-space justify="center" v-else>
          <a
            :href="apiLink"
            id="customBtn"
            class="customGPlusSignIn flex justify-center mt-5"
            :target="isPageLogin ? '_self' : '_blank'"
          >
            <div class="flex gap-2 items-center p-2 w-fit">
              <n-icon :component="Google" />
              <span class="buttonText">Sign In with Google</span>
            </div>
          </a>
        </n-space>
      </div>
    </div>
  </n-spin>
</template>
<style lang="scss">
.login-screen {
  .login-right {
    width: 40rem;
    margin-top: -100px;
  }

  .login-left {
    background-repeat: no-repeat;
    background-position: center center;
    background-size: cover;
  }

  .n-form-item-label__text {
    font-size: 16px;
    font-weight: 500;
  }

  .modal-login-custom {
    z-index: 1004;
    width: 25rem;
    left: calc((100% - 25rem) / 2);
  }
}

#customBtn {
  display: inline-flex;
  background: white;
  color: #444;
  width: 190px;
  border-radius: 5px;
  border: thin solid #888;
  box-shadow: 1px 1px 1px grey;
  white-space: nowrap;
}

span.buttonText {
  color: #1572e8;
  display: inline-block;
  vertical-align: middle;
  // padding-right: 42px;
  font-size: 14px;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
}
</style>
