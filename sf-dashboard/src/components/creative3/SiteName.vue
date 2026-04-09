<script setup lang="ts">
import {
  SelectOption,
  UploadCustomRequestOptions,
  UploadFileInfo,
} from 'naive-ui'

import {
  CreativeStateManager,
  creativeTypeClass,
  StatusCreativeManager,
} from '@/types/components/creative-v2'

import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { ctr_creative } from '@/services/ctr_creative'
import Edit20Regular from '@/assets/icons/Edit20Regular.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { debounceV2 } from '@/utils'
import {
  CDN_IMAGE_MINIO_S3_IMAGE,
  NO_THUMBNAIL,
  URL_UPLOAD,
} from '@/constants/urls'

import { useLocale } from '@/lang/messages'
import { siteNameStatus } from '@/options/creative'

const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },
  stateManager: {
    type: Object as () => CreativeStateManager,
    required: true,
  },
})

const optionBusiness = ref<SelectOption[]>([])
const isUploadingIcon = ref<boolean>(false)

const showNameSiteName = computed<string>(() => {
  switch (true) {
    case props.cre.IsPocpocBanner():
    case props.cre.IsNative():
      return 'Site Name'
    case props.cre.IsGoogleSearch():
    case props.cre.IsDemandGen():
    case props.cre.IsPMax():
    case props.cre.IsGoogleDisplay():
      return 'Business Name'
    case props.cre.IsTikTok():
      return 'Indentity'
    case props.cre.IsNewsbreak():
    case props.cre.IsSnapchat():
      return 'Brand Name'
    default:
      return ''
  }
})

const isShowStatus = computed<boolean>(() => {
  return props.status.permissionCreative?.approvedCreative || false
})
const isLoadingBusiness = ref<boolean>(false)
const src = (path: string | undefined) => {
  if (!path) return `${CDN_IMAGE_MINIO_S3_IMAGE}/default-avatar.png`
  if (path?.includes('http') || path?.includes('https')) return path
  return `${URL_UPLOAD}${path ? path : NO_THUMBNAIL}`
}

const validateImage = (data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const isImage = data.file.type?.startsWith('image/')
    const fileData = data.file.file

    if (!isImage || !(fileData instanceof File)) {
      window.message.error(Creative.value.only_img)
      reject(false)
      return
    }
    const reader = new FileReader()
    reader.onload = (event) => {
      const image = new Image()
      image.onload = () => {
        const width = image.width
        const height = image.height
        const ratio = width / height
        if (Math.abs(ratio) !== 1) {
          window.message.error(Creative.value.ratio_1_1)
          reject(false)
        } else {
          switch (true) {
            case image.height > 1280 || image.width > 1280:
              window.message.error(Creative.value.icon_max)
              reject(false)
              break

            case (props.cre.IsDemandGen() || props.cre.IsPMax()) &&
              (image.width < 128 || image.height < 128):
              window.message.error(Creative.value.icon_min)
              reject(false)
              break

            default:
              resolve(true)
          }
        }
      }
      image.src = event.target?.result as string
    }
    reader.readAsDataURL(fileData)
  })
}

const customRequestIcon = async ({ file }: UploadCustomRequestOptions) => {
  try {
    isUploadingIcon.value = true
    const formData = new FormData()
    formData.append('file', file.file as File)
    const result = await ctr_creative.uploadImage(formData)

    const url = result?.data_object?.thumb[0]

    props.cre.site_icon = url
  } catch {
    window.message.error('Upload failed')
  } finally {
    isUploadingIcon.value = false
  }
}

watch(
  () => props.cre.IsShowIcon(),
  async (newValue, oldValue) => {
    if (!newValue) {
      props.cre.site_icon = undefined
    }
  }
)

const textSiteName = computed<string>(() => {
  return props.cre.IsDemandGen() || props.cre.IsPMax()
    ? Creative.value.auto_domain
    : 'Enter the ' + showNameSiteName.value
})
watch(
  () => props.cre.IsTikTok(),
  async (newValue, oldValue) => {
    if (newValue) {
      siteNameTemp.value = undefined
      props.cre.site_name = undefined

      fetchBusiness()
    }
  }
)
const renderLabel = (option: any) => {
  return h(
    'div',
    {
      style:
        'display: flex; align-items: center; justify-content: space-between;',
    },
    [
      h('span', option.label),
      option.site_icon
        ? h('img', {
            src: `https://arb-ul.pubpowerplatform.io${option.site_icon}`,
            style: 'width: 20px; height: 20px; border-radius: 4px;',
          })
        : null,
    ]
  )
}
const renderTag = ({ option }: { option: any }) => {
  return option.label
}
const siteNameTemp = ref<string | undefined>(undefined)
const identityMode = ref<'existing' | 'new'>('existing')

watch(
  () => siteNameTemp.value,
  async (newValue, oldValue) => {
    if (newValue && props.cre.IsTikTok() && identityMode.value === 'existing') {
      const siteName = newValue.split('/')
      props.cre.site_name = siteName[0]
    }
  }
)

watch(
  () => identityMode.value,
  async (newValue, oldValue) => {
    if (props.cre.IsTikTok()) {
      if (newValue === 'new') {
        siteNameTemp.value = undefined
        props.cre.site_name = undefined
        props.cre.site_icon = undefined
      } else {
        props.cre.site_name = undefined
      }
    }
  }
)
const fetchBusiness = async (q = '') => {
  isLoadingBusiness.value = true
  const rs = await ctr_creative.GetBusiness({
    q: q,
    ts: 'tiktok',
  })

  optionBusiness.value = (rs.data || []).map((item: any) => ({
    label: item.site_name,
    value: `${item.site_name}${item.site_icon}`,
    site_icon: item.site_icon,
  }))

  if (props.cre.IsTikTok() && props.cre.site_name) {
    const indentity = `${props.cre.site_name}${props.cre.site_icon || ''}`
    const existOption = optionBusiness.value.find((item: SelectOption) => {
      return item.value === indentity
    })
    if (!existOption) {
      optionBusiness.value.unshift({
        label: props.cre.site_name,
        value: `${props.cre.site_name}${props.cre.site_icon}`,
        site_icon: props.cre.site_icon,
      })
    }
  }

  const existOption = optionBusiness.value.find((item: any) => {
    return item.value === q.trim()
  })

  if (!existOption && q.trim() !== '') {
    optionBusiness.value.unshift({
      label: q.trim(),
      value: q.trim(),
    })
  }

  isLoadingBusiness.value = false
}
const handleSearch = debounceV2((value: any) => {
  fetchBusiness(value)
}, 500)
const handleSelectChange = async (value: string) => {
  if (!value || !props.cre.IsTikTok() || !props.cre.IsShowIcon()) return

  const selectedOption = optionBusiness.value.find(
    (opt) => typeof opt.label === 'string' && opt.value === value
  )

  if (selectedOption?.site_icon) {
    props.cre.site_icon = selectedOption.site_icon as string
  } else {
    props.cre.site_icon = undefined
  }
}

onMounted(async () => {
  if (props.cre.IsTikTok()) {
    await fetchBusiness()
    // Xác định mode dựa trên data có sẵn
    if (props.cre.site_name) {
      const existingOption = optionBusiness.value.find(
        (opt) => opt.label === props.cre.site_name
      )

      identityMode.value = existingOption ? 'existing' : 'new'
    }
  }
  siteNameTemp.value = props.cre.site_name
})
</script>

<template>
  <div class="flex flex-col gap-2" v-if="props.cre.IsTikTok()">
    <n-radio-group v-model:value="identityMode" size="small">
      <n-radio value="existing">Select Existing</n-radio>
      <n-radio value="new">Create New</n-radio>
    </n-radio-group>
    <FloatingWrapper :name="showNameSiteName" small rounded required>
      <div class="flex w-full gap-2">
        <n-select
          v-if="identityMode === 'existing'"
          v-model:value="siteNameTemp"
          placeholder="Select Identity"
          :options="optionBusiness"
          :render-label="renderLabel"
          :render-tag="renderTag"
          filterable
          remote
          @search="handleSearch"
          :loading="isLoadingBusiness"
          @update:value="handleSelectChange"
        />
        <n-input
          v-else
          v-model:value="props.cre.site_name"
          placeholder="Enter new Identity name"
        />

        <n-select
          v-show="isShowStatus && props.cre.site_name_status"
          v-model:value="props.cre.site_name_status"
          class="w-28"
          :options="siteNameStatus"
        />

        <template v-if="props.cre.IsShowIcon()">
          <n-upload
            class="flex items-center"
            list-type="image"
            accept="image/png, image/jpeg"
            :show-file-list="false"
            :custom-request="customRequestIcon"
            @before-upload="validateImage"
            :disabled="isUploadingIcon"
          >
            <div class="flex items-center relative">
              <n-popover trigger="hover" placement="top" :show-arrow="false">
                <template #trigger>
                  <div
                    class="relative w-[30px] h-[30px] flex items-center justify-center"
                  >
                    <n-image
                      class="rounded-full"
                      width="30"
                      preview-disabled
                      :src="src(cre.site_icon)"
                      :style="{ cursor: 'pointer' }"
                      object-fit="scale-down"
                    />

                    <div
                      v-if="isUploadingIcon"
                      class="absolute inset-0 flex items-center justify-center bg-white/40 rounded-full"
                    >
                      <n-spin :size="30" />
                    </div>
                  </div>
                </template>
                <span>Select Icon</span>
              </n-popover>
              <span
                v-if="!isUploadingIcon"
                class="bottom-0 left-5 absolute w-4 h-4 bg-gray-300 border-2 border-white dark:border-gray-800 rounded-full"
              >
                <n-icon size="12" class="flex cursor-pointer">
                  <Edit20Regular />
                </n-icon>
              </span>
            </div>
          </n-upload>
        </template>
      </div>
    </FloatingWrapper>
  </div>

  <div class="flex items-center gap-2" v-else-if="!props.cre.IsFacebook()">
    <FloatingWrapper :name="showNameSiteName" small rounded required>
      <template #extra>
        <n-tooltip
          trigger="hover"
          v-if="
            props.cre.IsDemandGen() ||
            props.cre.IsPMax() ||
            props.cre.IsGoogleDisplay()
          "
        >
          <template #trigger>
            <n-icon size="12">
              <QuestionCircleRegular />
            </n-icon>
          </template>
          <div>{{ Creative.auto_domain }}</div>
        </n-tooltip>
      </template>

      <div class="flex w-full gap-2">
        <n-input
          v-model:value="props.cre.site_name"
          :placeholder="textSiteName"
          class="w-full"
          :maxlength="
            props.cre.IsPMax() ||
            props.cre.IsGoogleDisplay() ||
            props.cre.IsNewsbreak()
              ? 25
              : 1000
          "
          :show-count="props.cre.IsPMax() || props.cre.IsGoogleDisplay()"
        />
        <n-select
          v-show="isShowStatus && props.cre.site_name_status"
          v-model:value="props.cre.site_name_status"
          class="w-28 items-center"
          :options="siteNameStatus"
        />
      </div>
    </FloatingWrapper>

    <template v-if="props.cre.IsShowIcon()">
      <n-upload
        class="flex items-center"
        list-type="image"
        accept="image/png, image/jpeg"
        :show-file-list="false"
        :custom-request="customRequestIcon"
        @before-upload="validateImage"
        :disabled="isUploadingIcon"
      >
        <div class="flex items-center mr-2 relative">
          <n-popover trigger="hover" placement="top" :show-arrow="false">
            <template #trigger>
              <div
                class="relative w-[30px] h-[30px] flex items-center justify-center"
              >
                <n-image
                  class="rounded-full"
                  width="30"
                  preview-disabled
                  :src="src(cre.site_icon)"
                  :style="{ cursor: 'pointer' }"
                  object-fit="scale-down"
                />
                <div
                  v-if="isUploadingIcon"
                  class="absolute inset-0 flex items-center justify-center bg-white/40 rounded-full"
                >
                  <n-spin :size="30" />
                </div>
              </div>
            </template>
            <span>Select Icon</span>
          </n-popover>
          <span
            v-if="!isUploadingIcon"
            class="bottom-0 left-5 absolute w-4 h-4 bg-gray-300 border-2 border-white dark:border-gray-800 rounded-full"
          >
            <n-icon size="12" class="flex cursor-pointer">
              <Edit20Regular />
            </n-icon>
          </span>
        </div>
      </n-upload>
    </template>
  </div>
</template>
