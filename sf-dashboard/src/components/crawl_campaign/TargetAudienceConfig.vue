<script setup lang="ts">
import { DS } from '@/enum/campaign'
import modalCrawlCamp from '@/store/modalCrawlCamp'
import { SelectOption, UploadFileInfo } from 'naive-ui'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import api_v2 from '@/core/api_v2'
import LanguageSelector from '@/components/common/LanguageSelector.vue'
import { GENERATE_MODE, TYPE_PROMPT } from '@/enum/crawl_campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { FULL_URL_MEDIA, URL_UPLOAD } from '@/constants/urls'

const storeModalCrawl = modalCrawlCamp()

const landingOptions = ref<SelectOption[]>([])
const loadingLandingOptions = ref(false)

const modeImageOptions = computed(() => {
  return storeModalCrawl.dataCrawlCamp.IsGoogleTS() ||
    storeModalCrawl.dataCrawlCamp.IsFacebookTS()
    ? [
        {
          label: 'Per Angle',
          value: GENERATE_MODE.PER_ANGLE,
          description: 'Generate AI images for each angle.',
        },
      ]
    : [
        {
          label: 'Per Angle',
          value: GENERATE_MODE.PER_ANGLE,
          description: 'Generate AI images for each angle.',
        },
        {
          label: 'Per Variation',
          value: GENERATE_MODE.PER_VARIATION,
          description: 'Generate AI images for each variation.',
        },
        {
          label: 'General',
          value: GENERATE_MODE.GENERAL,
          description: 'Use shared images for all variations.',
        },
      ]
})

const modeLandingOptions = computed(() => {
  return storeModalCrawl.dataCrawlCamp.IsGoogleTS() ||
    storeModalCrawl.dataCrawlCamp.IsFacebookTS()
    ? [
        {
          label: 'Per Angle',
          value: GENERATE_MODE.PER_ANGLE,
          description: 'Generate landing page for each angle.',
        },
      ]
    : [
        {
          label: 'Per Angle',
          value: GENERATE_MODE.PER_ANGLE,
          description: 'Generate landing page for each angle.',
        },
        {
          label: 'Per Variation',
          value: GENERATE_MODE.PER_VARIATION,
          description: ' Generate landing page for each variation.',
        },
      ]
})

const renderLabel = (option: any) => {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      },
    },
    [
      h(
        'span',
        {
          style: {
            textAlign: 'left',
            flex: 1,
          },
        },
        option.label
      ),
      h(
        'span',
        {
          style: {
            textAlign: 'right',
            color: '#888',
            fontSize: '12px',
            marginLeft: '8px',
            whiteSpace: 'nowrap',
          },
        },
        option.description
      ),
    ]
  )
}

const isShow = computed(() => {
  return storeModalCrawl.dataCrawlCamp.IsInputSourceTargetAudience()
})

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      // storeModalCrawl.dataCrawlCamp.images = []
      // storeModalCrawl.dataCrawlCamp.ai_image = ONOFF.OFF
      storeModalCrawl.dataCrawlCamp.number_of_angles = null
      storeModalCrawl.dataCrawlCamp.number_of_variations = null
      storeModalCrawl.dataCrawlCamp.ai_image = null
      storeModalCrawl.dataCrawlCamp.image_generate_mode = null
      storeModalCrawl.dataCrawlCamp.number_of_images = null
      storeModalCrawl.dataCrawlCamp.images = null
      storeModalCrawl.dataCrawlCamp.ai_landing = null
      storeModalCrawl.dataCrawlCamp.landing_generate_mode = null
      storeModalCrawl.dataCrawlCamp.number_of_landings = null
      storeModalCrawl.dataCrawlCamp.landing_page_id = null
    }
  }
)

watch(
  () => storeModalCrawl.dataCrawlCamp.IsImageModeGeneral(),
  (newValue) => {
    if (!newValue) {
      storeModalCrawl.dataCrawlCamp.number_of_images = null
    }
  }
)

watch(
  () => storeModalCrawl.dataCrawlCamp.IsOffAIImage(),
  (newValue) => {
    if (newValue) {
      storeModalCrawl.dataCrawlCamp.image_generate_mode = null
      storeModalCrawl.dataCrawlCamp.number_of_images = null
    }
  }
)

watch(
  () => storeModalCrawl.dataCrawlCamp.IsOnAIImage(),
  (newValue) => {
    if (newValue) {
      storeModalCrawl.dataCrawlCamp.images = null
    }
  }
)

watch(
  () => storeModalCrawl.dataCrawlCamp.IsOnAILanding(),
  (newValue) => {
    if (newValue) {
      storeModalCrawl.dataCrawlCamp.landing_page_id = null
    } else {
      storeModalCrawl.dataCrawlCamp.landing_generate_mode = null
      storeModalCrawl.dataCrawlCamp.number_of_landings = null
      storeModalCrawl.dataCrawlCamp.landing_language = null
    }
  }
)

watch(
  () => storeModalCrawl.dataCrawlCamp.IsOffAILanding(),
  (newValue) => {
    if (newValue) {
      fetchLandingPageByDemand()
    }
  }
)

const ajax = async (opts: { q: string; notfound?: boolean } = { q: '' }) => {
  let data = {
    filter: { demand_source: DS.ADSENSE } as Record<string, any>,
  }

  const landingResult = await api_v2.request({
    url: 'filter/landing-page',
    params: {
      q: opts.q,
      f: storeModalCrawl.dataCrawlCamp.landing_page_id
        ? String(storeModalCrawl.dataCrawlCamp.landing_page_id)
        : undefined,
      nf: opts.notfound ? 1 : 0,
    },

    data: data,
  })
  landingOptions.value = (landingResult?.data || []).map((element: any) =>
    Object.assign({}, element, {
      value: element.value,
      label: `${element.value} - ${element.label}`,
    })
  )
}

const fetchLandingPageByDemand = async (
  opts: { q: string; notfound?: boolean } = { q: '' }
) => {
  loadingLandingOptions.value = true

  ajax(opts)

  loadingLandingOptions.value = false
}

onMounted(() => {
  if (storeModalCrawl.dataCrawlCamp.IsOffAILanding()) {
    fetchLandingPageByDemand({
      q: '',
      notfound: true,
    })
  }
})

const searchTimeout = ref<ReturnType<typeof setTimeout>>()

const handleLandingSearch = (query: string) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    fetchLandingPageByDemand({
      q: query,
    })
  }, 300)
}

const blurHandle = () => {
  if (!landingOptions.value.length) {
    ajax()
  }
}

const fileList = ref<UploadFileInfo[]>([])

const beforeUpload = async (data: any): Promise<boolean> => {
  const imageTypes = ['image/jpeg', 'image/png', 'image/svg+xml']

  const fileExtension = data.file.type?.toLowerCase()
  const isImage = fileExtension && imageTypes.includes(fileExtension)

  if (!isImage) {
    window.message.error('Only JPEG, PNG and SVG images are allowed.')
    return false
  }

  return true
}

const handleError = ({ file }: { file: UploadFileInfo }) => {
  const index = fileList.value.findIndex((f) => f.id === file.id)
  if (index !== -1) fileList.value[index].status = 'error'
}

const handleFinish = ({
  file,
  event,
}: {
  file: UploadFileInfo
  event?: any
}) => {
  try {
    const result = JSON.parse(event?.target?.response || '{}')
    const thumb = result?.data_object?.thumb?.[0]

    if (!thumb) {
      window.message.error('Upload failed, no URL returned')
      return
    }

    const imageUrl = URL_UPLOAD + thumb

    if (!storeModalCrawl.dataCrawlCamp.images) {
      storeModalCrawl.dataCrawlCamp.images = []
    }
    storeModalCrawl.dataCrawlCamp.images?.push(thumb)

    const index = fileList.value.findIndex((f) => f.id === file.id)
    if (index !== -1) {
      fileList.value[index] = {
        ...fileList.value[index],
        status: 'finished',
        url: imageUrl,
      }
    }
  } catch (err) {
    console.error('Upload parsing error', err)
  }
}

const removeImage = (index: number) => {
  storeModalCrawl.dataCrawlCamp.images?.splice(index, 1)
}

const adCreativeImages = computed(() =>
  storeModalCrawl.dataCrawlCamp.AdCreativeImages()
)

const openDrawerPrompt = (typeDrawer: TYPE_PROMPT) => {
  storeModalCrawl.typeDrawer = typeDrawer
  storeModalCrawl.setDataDrawer()
  storeModalCrawl.showDrawer = true
}
</script>

<template>
  <div v-if="isShow" class="flex flex-col gap-4">
    <div class="flex flex-col gap-4 shadow border p-4 rounded">
      <div class="flex items-center gap-2">
        <div class="flex-1 min-w-0 flex gap-2">
          <FloatingWrapper :name="'Angles & Variations'" :required="true">
            <template #extra>
              <n-popover trigger="hover">
                <template #trigger>
                  <n-icon :component="QuestionCircleRegular"></n-icon>
                </template>
                <span
                  >Enter the number of angles to generate, and for each angle,
                  specify how many variations to create.</span
                >
              </n-popover>
            </template>
            <div class="flex gap-2">
              <n-input-number
                class="w-1/2"
                v-model:value="storeModalCrawl.dataCrawlCamp.number_of_angles"
                placeholder="Number"
                min="0"
                max="5"
              >
                <template #suffix> angles </template>
              </n-input-number>

              <n-input-number
                v-if="storeModalCrawl.dataCrawlCamp.IsTaboolaTS()"
                class="w-1/2"
                v-model:value="
                  storeModalCrawl.dataCrawlCamp.number_of_variations
                "
                placeholder="Number"
                min="0"
                max="5"
              >
                <template #suffix> variations </template>
              </n-input-number>
            </div>
          </FloatingWrapper>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-24 font-bold text-xs">AI Image</div>
        <div class="flex-1 min-w-0">
          <CustomSwitch
            v-model="storeModalCrawl.dataCrawlCamp.ai_image"
            type="onoff"
            true-label="On"
            false-label="Off"
            size="small"
          />
        </div>

        <n-button
          size="small"
          round
          @click="openDrawerPrompt(TYPE_PROMPT.PROMPT)"
          v-if="storeModalCrawl.dataCrawlCamp.IsFacebookTS()"
          >Prompt</n-button
        >
        <n-button
          size="small"
          round
          @click="openDrawerPrompt(TYPE_PROMPT.API)"
          v-if="storeModalCrawl.dataCrawlCamp.IsFacebookTS()"
          >API</n-button
        >
      </div>

      <FloatingWrapper
        v-if="
          storeModalCrawl.dataCrawlCamp.IsOnAIImage() &&
          storeModalCrawl.dataCrawlCamp.IsTaboolaTS()
        "
        :name="'AI Image Generation Mode'"
      >
        <n-select
          v-model:value="storeModalCrawl.dataCrawlCamp.image_generate_mode"
          placeholder=""
          :options="modeImageOptions"
          :render-label="renderLabel"
        />
      </FloatingWrapper>

      <FloatingWrapper
        v-if="
          storeModalCrawl.dataCrawlCamp.IsImageModeGeneral() &&
          storeModalCrawl.dataCrawlCamp.IsOnAIImage()
        "
        :name="'Number of AI Images'"
        :required="true"
      >
        <template #extra>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
            </template>
            Specify the number of AI-generated images to be created based on the
            selected generation mode above.
          </n-popover>
        </template>
        <n-input-number
          v-model:value="storeModalCrawl.dataCrawlCamp.number_of_images"
          placeholder=""
          min="0"
          max="1000"
        />
      </FloatingWrapper>

      <div
        class="flex gap-2 items-center"
        v-if="storeModalCrawl.dataCrawlCamp.IsOffAIImage()"
      >
        <div class="w-24 text-xs font-bold">Upload Manual</div>

        <div class="flex flex-wrap gap-2 items-center flex-1 min-w-0">
          <n-upload
            :action="FULL_URL_MEDIA"
            :show-file-list="false"
            accept="image/jpeg,image/png,image/svg+xml"
            multiple
            :on-before-upload="beforeUpload"
            :on-finish="handleFinish"
            :on-error="handleError"
            class="w-24 h-24"
          >
            <div
              class="w-24 h-24 flex-shrink-0 flex items-center justify-center border border-dashed rounded cursor-pointer hover:border-blue-500 transition text-sm text-gray-500 hover:text-blue-500"
            >
              Upload
            </div>
          </n-upload>

          <div
            v-for="(url, index) in storeModalCrawl.dataCrawlCamp.images"
            :key="url"
            class="relative w-24 h-24 rounded overflow-hidden group bg-gray-800 flex-shrink-0"
          >
            <img
              :src="URL_UPLOAD + url"
              class="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-60"
            />
            <button
              @click="removeImage(index)"
              class="absolute top-1 right-1 bg-white text-red-600 text-xs rounded-full px-1 opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition"
              title="Delete"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <ImagePrompt
        v-if="
          storeModalCrawl.dataCrawlCamp.IsOnAIImage() &&
          storeModalCrawl.dataCrawlCamp.IsFacebookTS()
        "
      />

      <div
        class="flex items-center gap-2"
        v-if="storeModalCrawl.dataCrawlCamp.IsTaboolaTS()"
      >
        <div class="w-24 font-bold text-xs">Total Ads</div>
        <div class="flex-1 min-w-0 flex gap-2">
          <n-tag round size="small">{{ adCreativeImages }}</n-tag>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col gap-4 shadow border p-4 rounded"
      v-if="storeModalCrawl.dataCrawlCamp.IsGoogleDS()"
    >
      <div class="flex items-center gap-2">
        <div class="w-24 text-xs font-bold">AI Landing</div>
        <div class="flex-1 min-w-0">
          <CustomSwitch
            v-model="storeModalCrawl.dataCrawlCamp.ai_landing"
            type="onoff"
            true-label="On"
            false-label="Off"
            size="small"
          />
        </div>
      </div>

      <FloatingWrapper
        :name="'AI Landing Generation Mode'"
        :required="true"
        v-if="
          storeModalCrawl.dataCrawlCamp.IsOnAILanding() &&
          storeModalCrawl.dataCrawlCamp.IsGoogleTS()
        "
      >
        <n-select
          class="flex-1 min-w-0"
          v-model:value="storeModalCrawl.dataCrawlCamp.landing_generate_mode"
          placeholder=""
          :options="modeLandingOptions"
          :render-label="renderLabel"
        />
      </FloatingWrapper>

      <div
        class="flex items-center gap-2"
        v-if="storeModalCrawl.dataCrawlCamp.IsOnAILanding()"
      >
        <LanguageSelector
          v-model="storeModalCrawl.dataCrawlCamp.landing_language"
          label="Landing Language"
          width="w-48"
        />
      </div>

      <FloatingWrapper
        :name="'Number of AI Landings'"
        v-if="
          storeModalCrawl.dataCrawlCamp.IsLandingModeGeneral() &&
          storeModalCrawl.dataCrawlCamp.IsOnAILanding()
        "
        :required="true"
      >
        <template #extra>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
            </template>
            Specify the number of AI-generated landing pages to be created based
            on the selected generation mode above.
          </n-popover>
        </template>
        <n-input-number
          v-model:value="storeModalCrawl.dataCrawlCamp.number_of_landings"
          placeholder=""
          min="0"
          max="1000"
        />
      </FloatingWrapper>

      <FloatingWrapper
        :name="'Landing Page'"
        v-if="storeModalCrawl.dataCrawlCamp.IsOffAILanding()"
        :required="true"
      >
        <n-select
          v-model:value="storeModalCrawl.dataCrawlCamp.landing_page_id"
          placeholder=""
          remote
          filterable
          :options="landingOptions"
          :loading="loadingLandingOptions"
          :on-blur="blurHandle"
          @search="handleLandingSearch"
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
