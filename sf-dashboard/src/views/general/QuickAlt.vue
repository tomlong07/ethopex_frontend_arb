<script setup lang="ts">
import { LOCAL_STORAGE_TOKEN } from '@/constants/storage'
import { ctr_user } from '@/services/ctr_user'

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)
const tkn = urlParams.get('token')
const eml = urlParams.get('email')
const athl = urlParams.get('athena')
const t = urlParams.get('t')
const isLoading = ref(false)
const isError = ref(false)
const getJwtUId = async () => {
  isLoading.value = true
  if (!tkn || !eml || !athl) {
    isLoading.value = false
    isError.value = true
    return
  }
  let payload = {
    token: tkn,
    email: eml,
    athena: athl,
    t: t,
  }

  const result = await ctr_user.QuickLoginAlt(payload)
  if (result.status === true) {
    window.message.success(`Login user: login success!`)
    localStorage.setItem(
      LOCAL_STORAGE_TOKEN,
      JSON.stringify(result.data)
    )

    window.location.href = '/'
  }
  isLoading.value = false
}
onMounted(async () => {
  getJwtUId()
})
</script>
<template>
  <div v-if="isError">Error</div>
</template>
<style scoped lang="scss"></style>
