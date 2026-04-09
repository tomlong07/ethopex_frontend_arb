<script setup lang="ts">
import Close2 from '@/assets/icons/Close2.vue'
import useCampaign2Store from '@/store/useCampaign2Store'
import KeywordSetDetail from '@/views/details/KeywordSetDetail.vue'

const campaignStore2 = useCampaign2Store()

const offModal = () => {
  campaignStore2.changeModalKeywordset(false)
}
</script>

<template>
  <div>
    <n-modal
      v-model:show="campaignStore2.showModalKeywordset"
      style="width: 95vw"
    >
      <div>
        <n-card embedded>
          <div class="flex items-center gap-2 text-xl h-full select-none">
            <n-icon
              size="26"
              class="ml-auto cursor-pointer not-filter-icon"
              @click="offModal"
            >
              <Close2 />
            </n-icon>
          </div>
        </n-card>

        <div
          :bordered="false"
          role="dialog"
          aria-modal="true"
          class="overflow-y-scroll"
          style="height: calc(95vh - 8rem); scrollbar-width: thin"
        >
          <KeywordSetDetail
            :dataModal="campaignStore2.dataModal"
            :isInModal="true"
          />
        </div>
      </div>
    </n-modal>
  </div>
</template>
