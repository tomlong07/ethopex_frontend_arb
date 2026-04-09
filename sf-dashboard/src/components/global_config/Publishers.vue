<script setup lang="ts">
import { ONOFF } from '@/enum/campaign'
import { useGlobalConfig } from '@/store/details/globalConfig'
import { debounceV2 } from '@/utils'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const globalConfigStore = useGlobalConfig()

onMounted(() => {
  globalConfigStore.fetchUsers('', true)
})

const handleSearch = debounceV2(async (q: string = '') => {
  globalConfigStore.fetchUsers(q)
}, 300)

const isShow = computed(() => {
  return globalConfigStore.globalConfigData.push_to_pub === ONOFF.ON
})

watch(
  () => globalConfigStore.globalConfigData.push_to_pub,
  (val) => {
    if (val !== ONOFF.ON) {
      globalConfigStore.globalConfigData.publishers = []
    }
  }
)

const name = `Publishers`
</script>

<template>
  <FloatingWrapper
    :name="name"
    :required="true"
    :error="globalConfigStore.showErr['publisher']"
    v-if="isShow"
  >
      <n-select
        v-model:value="globalConfigStore.globalConfigData.publishers"
        :placeholder="''"
        multiple
        clearable
        filterable
        remote
        :options="globalConfigStore.userOptions"
        @search="(q:string)=>handleSearch( q)"
      />
  </FloatingWrapper>
</template>
