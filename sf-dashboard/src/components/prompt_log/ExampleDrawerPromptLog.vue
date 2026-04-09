<script setup lang="ts">
import promptLogs from '@/store/promptLogs'
import PromptLogDetail from './PromptLogDetail.vue'
import Close from '@/assets/icons/Close.vue'

const promptLogStore = promptLogs()

//Mỗi lần mở example từ modal sẽ get dữ liệu mới theo creative_content ở example đó
watch(
  () => promptLogStore.showDrawer,
  (newValue) => {
    if (newValue) {
      getThisPromptLog()
    }
  }
)
const promptLogDetail = ref<InstanceType<typeof PromptLogDetail>>()

const getThisPromptLog = async () => {
  if (!promptLogStore.drawerContent) return
  promptLogStore.isLoadingDrawer = true

  const result = await promptLogStore.getPromptLogByCreativeContent({
    keyword: promptLogStore.drawerContent,
  })
  if (!result.id) window.message.error('Cannot load prompt log example detail')

  //Gán vào để khởi tạo class mới có thể sử dụng method
  promptLogStore.setDataLogDrawer(result)

  promptLogDetail.value?.changeDataLog(promptLogStore.dataLogDrawer)

  promptLogStore.isLoadingDrawer = false
}

const changeLoading = (value: boolean) => {
  promptLogStore.isLoadingDrawer = value
}

const changeShowModal = (value: boolean) => {
  promptLogStore.showDrawer = value
}

const styles = computed(() => {
  return {
    width: window.innerWidth < 768 ? '100vw' : '1140px',
    maxWidth: '100vw',
  }
})
</script>

<template>
  <n-drawer
    v-model:show="promptLogStore.showDrawer"
    :style="styles"
    placement="right"
  >
    <n-drawer-content>
      <div class="flex gap-4 items-center pl-4 py-4">
        <n-button text @click="changeShowModal(false)"
          ><n-icon :component="Close" size="24"
        /></n-button>
        <div class="flex gap-4 items-center">
          Change Prompt Log Detail
          <span class="text-xxs text-gray-500 italic">{{
            promptLogStore.dataLog?.id
          }}</span>
        </div>
      </div>
      <PromptLogDetail
        ref="promptLogDetail"
        :isLoading="promptLogStore.isLoadingDrawer"
        @changeLoading="changeLoading"
        @changeShowModal="changeShowModal"
      />
    </n-drawer-content>
  </n-drawer>
</template>
