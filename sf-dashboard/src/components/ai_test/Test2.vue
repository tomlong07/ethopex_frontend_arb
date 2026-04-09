<script setup lang="ts">
import { ctr_prompt } from '@/services/ctr_prompt'

import 'vue-json-pretty/lib/styles.css'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import Upload from '../common/Upload.vue'
import { URL_UPLOAD } from '@/constants/urls'
import CopyOutline from '@/assets/icons/CopyOutline.vue'
import VueJsonPretty from 'vue-json-pretty'
import { promptSelectOptions } from '@/types/components/prompt'

const AssetTypeOption = [
  { label: 'TEXT', value: 'TEXT' },
  { label: 'IMAGE', value: 'IMAGE' },
  { label: 'VIDEO', value: 'VIDEO' },
]

const CampaignGoalOption = [
  { label: 'PURCHASE', value: 'PURCHASE' },
  { label: 'LEAD_GEN', value: 'LEAD_GEN' },
  { label: 'INFORMATIONAL', value: 'INFORMATIONAL' },
  { label: 'TRANSACTIONAL', value: 'TRANSACTIONAL' },
]

const PlatFormOption = [
  { label: 'GOOGLE', value: 'google' },
  { label: 'FACEBOOK', value: 'facebook' },
  { label: 'TIKTOK', value: 'tiktok' },
]

interface Asset {
  asset_type: string
  content?: string
  media_url?: string
}

interface TestData2 {
  model: string | null
  campaign_goal: string
  platform: string
  assets: Asset[]
}

const dataTest2 = ref<TestData2>({
  model: null,
  campaign_goal: 'INFORMATIONAL',
  platform: 'facebook',
  assets: [{ asset_type: 'TEXT', content: '' }],
})

onMounted(async () => {
  await getModels()
  if (geminiModels.value.length > 0) {
    dataTest2.value.model = geminiModels.value[0].value as string
  }
})

const handleAssetTypeChange = (index: number, newType: string) => {
  const asset = dataTest2.value.assets[index]
  
  if (newType === 'TEXT') {
    asset.media_url = ''
    asset.content = asset.content || ''
  } else {
    asset.content = ''
    asset.media_url = asset.media_url || ''
  }
  
  asset.asset_type = newType
}

const payloadTest2 = computed(() => {
  return {
    model: dataTest2.value.model,
    campaign_goal: dataTest2.value.campaign_goal,
    platform: dataTest2.value.platform,
    assets: dataTest2.value.assets
      .filter((asset) => {
        if (asset.asset_type === 'TEXT') {
          return asset.content && asset.content.trim() !== ''
        }
        return asset.media_url && asset.media_url.trim() !== ''
      })
      .map((asset) => {
        if (asset.asset_type === 'TEXT') {
          return {
            asset_type: asset.asset_type,
            content: asset.content
          }
        }

        // Thêm domain nếu media_url chưa có http/https
        let mediaUrl = asset.media_url || ''
        if (
          mediaUrl &&
          !mediaUrl.startsWith('http://') &&
          !mediaUrl.startsWith('https://')
        ) {
          mediaUrl = mediaUrl.startsWith('/')
            ? `${URL_UPLOAD}${mediaUrl}`
            : `${URL_UPLOAD}/${mediaUrl}`
        }

        return {
          asset_type: asset.asset_type,
          media_url: mediaUrl
        }
      }),
  }
})

const isSubmitting = ref(false)
const resultTest = ref<any>('')

const formattedJson = computed(() => {
  try {
    return JSON.parse(resultTest.value) // parse string
  } catch {
    return resultTest.value
  }
})

const copyJson = () => {
  if (!formattedJson.value) {
    window.message.warning(`Result not found!`)
    return
  }

  const textToCopy =
    typeof formattedJson.value === 'object'
      ? JSON.stringify(formattedJson.value, null, 2)
      : String(formattedJson.value)

  helper.copyText(textToCopy)
  window.message.success(`Copied!`)
}

const addAsset = () => {
  dataTest2.value.assets.push({
    asset_type: 'TEXT',
    content: '',
  })
}

const removeAsset = (index: number) => {
  if (dataTest2.value.assets.length > 1) {
    dataTest2.value.assets.splice(index, 1)
  }
}

const submitForm = async () => {
  if (!dataTest2.value.model) {
    window.message.warning('Please select a model')
    return
  }

  if (dataTest2.value.assets.length === 0) {
    window.message.warning('Please add at least one asset')
    return
  }

  isSubmitting.value = true
  
  const result = await ctr_prompt.TestVerify(payloadTest2.value)

  if (result?.status) {
    window.message.success('Success')
    resultTest.value = result?.data || ''
  }

  isSubmitting.value = false
}

const geminiModels = computed(() => {
  return selectData.value.models?.filter((model) =>
    (model.label as string)?.toLowerCase().includes('gemini')
  )
})

const loadingModel = ref(true)

const selectData = ref(new promptSelectOptions())

const getModels = async () => {
  loadingModel.value = true

  await selectData.value.getModelAI()

  loadingModel.value = false
}
</script>

<template>
  <div class="flex flex-col gap-4 relative p-1">
    <div class="flex flex-col items-center gap-2">
      <FloatingWrapper name="Model">
        <n-select
          :loading="selectData.loadingModel"
          v-model:value="dataTest2.model"
          :options="geminiModels"
          :render-label="selectData.renderLabel"
          filterable
          placeholder="Select Gemini model"
          class="w-full flex-1 min-w-0"
        />
      </FloatingWrapper>

      <FloatingWrapper name="Campaign Goal">
        <n-select
          v-model:value="dataTest2.campaign_goal"
          :options="CampaignGoalOption"
          filterable
          class="w-full flex-1 min-w-0"
        />
      </FloatingWrapper>

      <FloatingWrapper name="Platform">
        <n-select
          v-model:value="dataTest2.platform"
          :options="PlatFormOption"
          filterable
          class="w-full flex-1 min-w-0"
        />
      </FloatingWrapper>

      <!-- Assets Section -->
      <div class="w-full flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <span class="font-semibold">Assets</span>
        </div>

        <div
          v-for="(asset, index) in dataTest2.assets"
          :key="index"
          class="border rounded-lg p-3 flex flex-col gap-2 relative"
        >
          <RemoveButton
            v-if="dataTest2.assets.length > 1"
            @onClick="() => removeAsset(index)"
            class="z-10 shadow-md"
            text="Remove"
          />

          <FloatingWrapper name="Asset Type">
            <n-select
              :value="asset.asset_type"
              @update:value="(value) => handleAssetTypeChange(index, value)"
              :options="AssetTypeOption"
              filterable
              class="w-full flex-1 min-w-0"
            />
          </FloatingWrapper>

          <FloatingWrapper v-if="asset.asset_type === 'TEXT'" name="Content">
            <n-input
              v-model:value="asset.content"
              placeholder="Enter content"
              type="textarea"
            />
          </FloatingWrapper>

          <FloatingWrapper
            v-if="asset.asset_type === 'IMAGE' || asset.asset_type === 'VIDEO'"
            name="Media"
          >
            <div class="w-full flex flex-col gap-2">
              <div class="p-2">
                <Upload v-model="asset.media_url" accept="image/*,video/*" />
              </div>

              <FloatingWrapper name="Media URL">
                <n-input
                  v-model:value="asset.media_url"
                  placeholder="Or enter image/video URL directly"
                  type="text"
                />
              </FloatingWrapper>
            </div>
          </FloatingWrapper>
        </div>

        <div class="flex justify-start">
          <n-button size="small" @click="addAsset" class="flex gap-4">
            Add Asset
          </n-button>
        </div>
      </div>
    </div>
    <div class="flex flex-col gap-4">
      <div class="font-bold text-xs">Result</div>

      <div
        class="flex-1 min-w-0 border border-gray-200 px-3 pb-3 rounded max-h-[500px] overflow-y-scroll"
        style="scrollbar-width: thin"
        v-if="formattedJson"
      >
        <div class="sticky top-0 text-end py-2 ml-auto z-10">
          <button @click="copyJson">
            <n-icon :component="CopyOutline" size="18" />
          </button>
        </div>
        <vue-json-pretty
          :indent="8"
          class="whitespace-pre"
          showIcon
          :showLine="false"
          :show-double-quotes="true"
          :data="formattedJson"
        />
      </div>
      <div v-else class="flex-1 min-w-0 text-gray-400 italic text-xs">
        No result found
      </div>
    </div>

    <div class="flex flex-row-reverse sticky bottom-2">
      <n-button
        size="medium"
        color="#f43f5e"
        :loading="isSubmitting"
        @click="submitForm"
      >
        Submit
      </n-button>
    </div>
  </div>
</template>
<style scoped>
:deep(.vjs-value-string) {
  color: #4e9a06 !important;
}
:deep(.vjs-tree) {
  font-family: inherit;
}
</style>

<style scoped>
.gutter {
  text-align: right;
  opacity: 0.6;
  user-select: none;
}
:deep(.vjs-tree) {
  white-space: pre-wrap;
}
:deep(.vjs-tree-node) {
  flex-wrap: wrap;
}
</style>
