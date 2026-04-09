<script setup lang="ts">
import BackPage from '@/components/common/BackPage.vue'

import TrafficSoureBlock from '@/components/blocksection/TrafficSoureBlock.vue'
import SectionBlock from '@/components/blocksection/SectionBlock.vue'
import useBlockSection from '@/store/details/useBlockSection'
import { onBeforeMount } from 'vue'
import { ctr_block_section } from '@/services/ctr_block_section'
import { useFeSettings } from '@/composables/feSettings'
import { FeSettings } from '@/class/fe_settings'

const feSettings = ref(new FeSettings())

useFeSettings(feSettings, window.route?.meta?.url as string)
const dataConfig = useBlockSection()

onBeforeMount(() => {
  dataConfig.cleartData()
})
const onSubmitAdd = async () => {
  dataConfig.isSubmitBtnLoading = true

  const res = await ctr_block_section.Submit({
    traffic_source: dataConfig.trafficSelected,
    section: dataConfig.sectionData.section.split('\n'),
  })

  if (res?.status) window?.message.success('Submit successfully!')

  dataConfig.isSubmitBtnLoading = false
}

const name = 'Block Section'
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <BackPage
      :url="feSettings.page_list"
      :name="name"
      v-if="feSettings.page_list"
      class="my-6"
    />
    <div class="flex justify-center items-start">
      <div class="w-full max-w-[923px]">
        <n-card
          :title="'Add ' + name"
          size="huge"
          role="dialog"
          aria-modal="true"
          :segmented="{
            content: true,
            footer: 'soft',
          }"
        >
          <div class="mx-auto bg-white sm:w-full">
            <TrafficSoureBlock />
            <SectionBlock />
          </div>
          <template #footer>
            <div class="flex justify-end">
              <n-button
                class="button-apply"
                color="#f43f5e"
                :loading="dataConfig.isSubmitBtnLoading"
                @click="onSubmitAdd()"
              >
                Submit
              </n-button>
            </div>
          </template>
        </n-card>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.totalSection {
  padding-top: 1rem;
}
.sectionTextArea {
  max-height: 400px;
}
.role-group-by {
  border-top-width: 1px;
  border-right-width: 1px;
  border-left-width: 1px;
  .n-button {
    height: 38px;
  }
}
</style>
