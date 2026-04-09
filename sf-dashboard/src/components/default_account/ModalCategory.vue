<script setup lang="ts">
import { useDefaultAccount } from '@/store/details/defaultAccount'
import { Type } from './enum'
const defaultAccountStore = useDefaultAccount()

const name = computed(() => {
  if (defaultAccountStore.typePayload === Type.FANPAGE) {
    return 'Change Fanpage'
  } else if (defaultAccountStore.typePayload === Type.PIXEL) {
    return 'Change Pixel'
  } else {
    return 'Change Location'
  }
})

const isDisabled = computed(() => {
  if (defaultAccountStore.typePayload === Type.FANPAGE) {
    return defaultAccountStore.fanpageOptions.length === 0
  } else if (defaultAccountStore.typePayload === Type.PIXEL) {
    return defaultAccountStore.pixelOptions.length === 0
  } else {
    return defaultAccountStore.locationOptions.length === 0
  }
})

const alreadySync = ref(false)

const syncPixel = async () => {
  const payload = defaultAccountStore.isFacebook
    ? defaultAccountStore.currentRow?.account_id
    : defaultAccountStore.currentRow?.name

  if (alreadySync.value || !payload) return

  alreadySync.value = true

  await defaultAccountStore.fetchPixelOptions(String(payload), true)
}

watch(
  () => defaultAccountStore.showFanpageModal,
  (newValue) => {
    if (newValue) {
      if (alreadySync.value) alreadySync.value = false
    }
  }
)
</script>
<template>
  <n-modal
    v-model:show="defaultAccountStore.showFanpageModal"
    :close-on-esc="false"
  >
    <n-card
      style="width: 600px; height: 500px"
      :title="name"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
      :mask-closable="true"
      :segmented="{
        content: true,
        footer: 'soft',
      }"
    >
      <n-select
        v-if="defaultAccountStore.typePayload === Type.FANPAGE"
        v-model:value="defaultAccountStore.selectedValue"
        :options="defaultAccountStore.fanpageOptions"
        placeholder="Select fanpage"
        value-field="post_id"
        label-field="name"
        @search="defaultAccountStore.handleSearchFanpage"
        filterable
        :loading="defaultAccountStore.isFetchFanpage"
      />

      <n-select
        v-if="defaultAccountStore.typePayload === Type.LOCATION"
        v-model:value="defaultAccountStore.selectedValue"
        :options="defaultAccountStore.locationOptions"
        placeholder="Select Location"
        filterable
        :loading="defaultAccountStore.isFetchLocation"
      />

      <div
        v-if="defaultAccountStore.typePayload === Type.PIXEL"
        class="flex gap-2"
      >
        <n-select
          v-model:value="defaultAccountStore.selectedValue"
          :options="defaultAccountStore.pixelOptions"
          placeholder="Select Pixel"
          filterable
          :loading="defaultAccountStore.isFetchPixel"
        />

        <n-button @click="syncPixel" :disabled="alreadySync">Sync</n-button>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <n-button
            color="#f43f5e"
            size="small"
            type="success"
            @click="defaultAccountStore.handleSubmitFanpage()"
            :loading="defaultAccountStore.isSubmitBtnLoading"
            :disabled="isDisabled"
            >Submit
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>
