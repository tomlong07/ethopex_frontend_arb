<script setup lang="ts">
import Close from '@/assets/icons/Close.vue'
import { ref, computed } from 'vue'
import type { SelectOption } from 'naive-ui'
import modalCrawlCamp from '@/store/modalCrawlCamp'
import Upload from '../common/Upload.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { ctr_prompt } from '@/services/ctr_prompt'
import { ctr_permission_settings } from '@/services/ctr_permission_settings'
import { PermissionSettings } from '@/class/permissions'
import Skeleton from '../skeleton/Skeleton.vue'
import { ctr_crawl_campaign } from '@/services/ctr_crawl_campaign'
import { renderPromptLabel } from '@/utils/labels'

const storeModalCrawl = modalCrawlCamp()

// Data

// Responsive width
const styles = computed(() => ({
  width: window.innerWidth < 768 ? '100vw' : '560px',
  maxWidth: '100vw',
}))

const removeItem = (index: number) =>
  storeModalCrawl.dataImageDrawer?.splice(index, 1)
const close = () => (storeModalCrawl.showDrawer = false)

const optionsPrompt = ref<SelectOption[]>([])
const isLoadingPrompt = ref(false)

const getOptionsPromptTest = async () => {
  isLoadingPrompt.value = true
  const res = await ctr_prompt.GetAllPromtAi(
    permissionSettings.value.promptTest
  )

  optionsPrompt.value = res?.data || []
  isLoadingPrompt.value = false
}
const permissionSettings = ref(new PermissionSettings({}))

const getPermissions = async () => {
  const result = await ctr_permission_settings.PermissionAsync(
    '/modal-crawl-prompt'
  )

  permissionSettings.value = new PermissionSettings(result?.data || {})
}

onMounted(async () => {
  await getPermissions()
  getOptionsPromptTest()
})

watch(
  () => storeModalCrawl.showDrawer,
  (newValue) => {
    if (newValue) {
      getOptionsPromptTest()
    }
  }
)

const saveData = async () => {
  const listKeys: string[] = []

  storeModalCrawl.payloadDataImagePrompts?.forEach((element) => {
    listKeys.push(element.KeyUnique())
  })

  if (new Set(listKeys).size !== listKeys.length) {
    window.message.error('A duplicate was found. Please check your inputs.')
    return
  }

  const result = await ctr_crawl_campaign.SaveImagePrompt(
    storeModalCrawl.payloadDataImagePrompts
  )
  if (result?.status) {
    window.message.success('Save image prompts successfully')
    await storeModalCrawl.getDataImagePrompts()
    storeModalCrawl.removeInvalidImagePrompts()
    storeModalCrawl.showDrawer = false
  }
  storeModalCrawl.isLoading = false
}

const demo = `https://api-chatgpt.adful.io/api/gemerate_images?headline= Read More About&text={{text}}&call_to_action=Learn More&call_to_action_style=fill&url_images=https://arb-ul.pubpowerplatform.io/data/image/thumb_1762521737426329069_f1d85a2d46724e3f6605463d4a61149b.png&style=01&background_color=ff0000&overlay=200&background_cta=007BFF&color_cta=FFFFFF`

const copyText = () => {
  helper.copyText(demo)

  window.message.success('Success')
}

const title = computed(() => {
  if (storeModalCrawl.isPrompt) {
    return 'Add Image + Prompt'
  }
  if (storeModalCrawl.isApi) {
    return 'Add Image + API'
  }
  return ''
})
</script>

<template>
  <n-drawer
    v-model:show="storeModalCrawl.showDrawer"
    :style="styles"
    placement="right"
    class="label-prompt-custom"
  >
    <n-drawer-content>
      <!-- ✅ HEADER FIXED -->
      <div
        class="flex items-center gap-3 p-4 border-b sticky top-0 bg-white z-10"
      >
        <n-button text @click="close">
          <n-icon :component="Close" size="22" />
        </n-button>
        <div class="font-semibold text-lg">{{ title }}</div>
      </div>

      <!-- ✅ BODY SCROLL-ONLY -->
      <div
        class="p-4 flex flex-col gap-4 overflow-auto max-h-[calc(100vh-150px)] scroll-thin-custom"
      >
        <Skeleton v-if="storeModalCrawl.isLoading" />

        <div v-else>
          <div
            v-if="storeModalCrawl.dataImageDrawer.length"
            class="flex gap-2 flex-col"
          >
            <div
              v-for="(item, index) in storeModalCrawl.dataImageDrawer"
              :key="index"
              class="relative border rounded-lg p-3 flex flex-col gap-3 bg-gray-50"
            >
              <!-- Remove Icon -->
              <button
                class="absolute top-2 right-2 text-red-500 hover:text-red-600"
                @click="removeItem(index)"
              >
                ✕
              </button>

              <!-- Upload -->
              <Upload v-model="item.image" is-urls accept="image/*" :max="1" />

              <!-- Prompt -->

              <FloatingWrapper name="Prompt" v-if="storeModalCrawl.isPrompt">
                <n-select
                  value-field="id"
                  label-field="name"
                  v-model:value="item.prompt"
                  placeholder=""
                  clearable
                  filterable
                  :options="optionsPrompt"
                  :loading="isLoadingPrompt"
                  :render-label="renderPromptLabel"
                />
              </FloatingWrapper>

              <FloatingWrapper name="API" v-if="storeModalCrawl.isApi">
                <n-input
                  v-model:value="item.api"
                  type="textarea"
                  maxlength="5000"
                  :autosize="{
                    minRows: 7,
                    maxRows: 7,
                  }"
                />
              </FloatingWrapper>
            </div>

            <FloatingWrapper name="Demo" v-if="storeModalCrawl.isApi">
              <n-input
                @click="copyText"
                type="textarea"
                :value="demo"
                readonly
                :autosize="{
                  minRows: 7,
                  maxRows: 7,
                }"
                maxlength="5000"
              ></n-input>
            </FloatingWrapper>
          </div>

          <template v-else>
            <div class="text-center text-gray-500">
              No image prompts available
            </div>
          </template>
        </div>
      </div>

      <!-- ✅ FOOTER FIXED -->
      <div
        class="p-4 border-t flex justify-between sticky bottom-0 bg-white z-10"
      >
        <n-button
          @click="storeModalCrawl.addNewImagePrompt()"
          tertiary
          size="small"
          :disabled="storeModalCrawl.isLoading"
          >Add More</n-button
        >
        <n-button
          type="primary"
          @click="saveData"
          size="small"
          :disabled="storeModalCrawl.isLoading"
          >Save</n-button
        >
      </div>
    </n-drawer-content>
  </n-drawer>
</template>
<style lang="scss">
.label-prompt-custom {
  .n-base-select-option__content {
    width: 100% !important;
  }

  .n-drawer-body-content-wrapper {
    overflow: hidden !important;
  }
}
</style>
