<script setup lang="ts">
import Plus from '@/assets/icons/Plus.vue'
import PlusLg from '@/assets/icons/PlusLg.vue'
import { landingTypeClass, LB } from '@/types/components/landing'
import ManageBlocks from '@/components/landing_page/template/ShortCode/ManageBlocks.vue'
import EditBlocks from '@/components/landing_page/template/ShortCode/EditBlocks.vue'
import AllBlocksFloating from '@/components/landing_page/template/ShortCode/AllBlocksFloating.vue'
import NewspaperOutline from '@/assets/icons/NewspaperOutline.vue'
import KeepPinOutline from '@/assets/icons/KeepPinOutline.vue'
import useShortCodeBlock from '@/store/useShortCodeBlock'
import { CB } from '@/enum/landing'

const props = defineProps<{ landing: landingTypeClass }>()

const store = useShortCodeBlock()

// Initialize store with landing data
onMounted(() => {
  store.initLanding(props.landing)
})

// Watch for landing changes
watch(
  () => props.landing,
  (newLanding) => {
    store.initLanding(newLanding)
  },
  { deep: true }
)
const blockTypes = computed(() => {
  return [
    { key: CB.JOB_POSTING_CARD, label: LB.JOB_POSTING_CARD },
    { key: CB.PRICE_OFFER_CARD, label: LB.PRICE_OFFER_CARD },
    { key: CB.BUTTON_BLOCK, label: LB.BUTTON_BLOCK },
    { key: CB.APP_DOWNLOAD_CARD, label: LB.APP_DOWNLOAD_CARD },
    { key: CB.PROMO_CAROUSEL_CARD, label: LB.PROMO_CAROUSEL_CARD },
    { key: CB.QUESTION_ANSWER_BLOCK, label: LB.QUESTION_ANSWER_BLOCK },
  ] as any[]
})
const blockTypesAdBlock = [
  { key: CB.AD_BLOCK, label: LB.AD_BLOCK },
  { key: '', label: '' },
  { key: '', label: '' },
  { key: '', label: '' },
  { key: '', label: '' },
  { key: '', label: '' },
]
</script>

<template>
  <n-button type="primary" size="medium" @click="store.openModal">
    <div class="mr-2" v-if="store.shortCodeBlocks.length === 0">
      <n-icon size="15"><Plus /></n-icon>
    </div>
    ShortCode
  </n-button>
  <n-modal
    :show="store.modalVisible"
    @update:show="(v: boolean) => store.handleShowChange(v)"
    :mask-closable="true"
    :close-on-esc="false"
    preset="dialog"
    type="success"
    class="modal-shortcode-block"
    style="width: 1870px; height: 95vh; padding: 0"
  >
    <n-card class="h-16" embedded
      ><div
        class="flex items-center gap-2 text-xl h-full select-none font-semibold"
      >
        Manage Short Code
      </div></n-card
    >
    <n-card
      :bordered="false"
      role="dialog"
      aria-modal="true"
      class="overflow-y-scroll n-card-content"
      style="
        height: calc(95vh - 8rem);
        padding-left: 10px;
        padding-right: 10px;
        scrollbar-width: thin;
      "
    >
      <div class="min-h-[620px]">
        <div class="flex flex-col xl:flex-row gap-6">
          <div class="w-full xl:[width:35%] flex flex-col h-[620px]">
            <div class="space-y-4 mb-4">
              <div class="text-md cursor-pointer font-semibold">
                {{
                  store.displayedBlocks.length
                    ? `Total: ${store.displayedBlocks.length}`
                    : `&nbsp;`
                }}
              </div>
            </div>
            <div
              class="border rounded p-3 flex-grow overflow-y-auto custom-scrollbar"
            >
              <ManageBlocks />
            </div>
          </div>

          <div
            class="w-full xl:w-4/5 h-[620px] overflow-y-auto border-gray-100 custom-scrollbar"
          >
            <EditBlocks v-if="store.editingForm" :landing="props.landing" />
            <div v-else class="flex items-center justify-center h-full">
              <div class="text-center p-8 text-gray-500">
                <n-icon size="89" class="mb-1 opacity-30"
                  ><NewspaperOutline
                /></n-icon>
                <p class="opacity-45 text-lg dark-mode-text">
                  Select a block from the left to edit and preview.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="rounded-lg flex px-2 custom-scroll space-x-2 mt-4 mb-4">
        <n-button
          v-for="item in blockTypes"
          :key="item.key"
          type="info"
          dashed
          @click="store.addNewBlock(item.key)"
          class="w-52"
        >
          <template #icon>
            <n-icon><PlusLg /></n-icon>
          </template>
          {{ item.label }}
        </n-button>
      </div>
      <div
        class="rounded-lg flex px-2 custom-scroll space-x-2 mt-4 mb-4"
        v-if="props.landing.prelander_configs?.IsLayout100()"
      >
        <n-button
          v-for="item in blockTypesAdBlock"
          :key="item.key"
          type="info"
          dashed
          @click="store.addNewBlock(item.key)"
          :class="[{ invisible: !item.key }, 'w-52']"
        >
          <template #icon>
            <n-icon><PlusLg /></n-icon>
          </template>
          {{ item.label }}
        </n-button>
      </div>
    </n-card>

    <n-card class="h-16 p-2 justify-center not-border" embedded>
      <div class="flex h-full select-none">
        <div class="ml-auto flex flex-row gap-4 items-center">
          <n-button
            :disabled="store.draftBlocks.length === 0"
            type="info"
            @click="store.openAllBlocksFloating"
          >
            <n-icon class="mr-1"><KeepPinOutline /></n-icon>
            Quick Add & Save
          </n-button>
        </div>
      </div></n-card
    >
  </n-modal>
  <!-- All Blocks Floating Container -->
  <AllBlocksFloating />

  <!-- Modal confirm -->
  <n-modal
    v-model:show="store.showModalConfirm"
    :mask-closable="false"
    preset="dialog"
    title="Unsaved Changes"
    content="You have unsaved changes in your code blocks. If you exit, these changes will be lost."
    :show-icon="false"
  >
    <template #action>
      <div class="flex justify-end gap-2">
        <n-button @click="store.cancelClose" size="small">Continue</n-button>
        <n-button @click="store.confirmClose" size="small" type="error">
          Exit
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<style scoped>
.n-modal {
  max-height: 90vh;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.custom-scrollbar {
  scrollbar-width: thin !important;
}

.custom-scroll {
  overflow-x: auto !important;
  scrollbar-width: thin !important;
  scrollbar-color: #94a3b8 #e2e8f0 !important;
}
</style>
<style lang="scss">
.modal-shortcode-block {
  .n-dialog__title {
    display: none;
  }
  .overflow-y-scroll {
    padding: 0 0px !important;
  }
  .n-dialog__content {
    margin: 0;
  }
}
</style>
