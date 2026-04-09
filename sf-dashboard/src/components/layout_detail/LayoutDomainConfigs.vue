<script setup lang="ts">
import LayoutDetail from '@/store/details/LayoutDetail'
import { SelectOption, UploadFileInfo } from 'naive-ui'
import RemoveButton from '@/components/creative3/RemoveButton.vue'
import { DomainConfigs } from '@/store/useLayoutStore'
import { ctr_domain } from '@/services/ctr_domain'
import NoneImage from '@/assets/icons/NoneImage.vue'
import { FULL_URL_MEDIA, URL_UPLOAD } from '@/constants/urls'

const useLayoutDetail = LayoutDetail()

const domainOptions = ref<SelectOption[]>([])
const files = ref([])

onMounted(async () => {
  const result = await ctr_domain.GetAllDomain()

  domainOptions.value = result?.data || []
})

const removeThis = (domain?: any) => {
  if (!domain) return
  useLayoutDetail.domains = useLayoutDetail.domains.filter(
    (item) => item !== domain
  )

  useLayoutDetail.layoutConfig.domain_config =
    useLayoutDetail.layoutConfig.domain_config?.filter(
      (config) => config.domain !== domain
    )
}

const updateDomains = (domains: string[]) => {
  if (!useLayoutDetail.layoutConfig.domain_config)
    useLayoutDetail.layoutConfig.domain_config = []

  const currentConfigs = useLayoutDetail.layoutConfig.domain_config
  const currentDomainSet = new Set(currentConfigs.map((d) => d.domain))

  // Giữ lại các domain đang tồn tại trong domains mới chọn
  const keptConfigs = currentConfigs.filter((config) =>
    domains.includes(config.domain || '')
  )

  // Các domain mới chưa tồn tại → add vào đầu
  const newConfigs = domains
    .filter((domain) => !currentDomainSet.has(domain))
    .map((domain) => new DomainConfigs({ domain }))

  // Gộp lại: domain mới lên đầu
  useLayoutDetail.layoutConfig.domain_config = [...newConfigs, ...keptConfigs]
}

const beforeUpload = (config: DomainConfigs) => {
  return async (data: any) => {
    config.loading = true

    const imageTypes = ['image/jpeg', 'image/png', 'image/svg+xml']

    const fileExtension = data.file.type?.toLowerCase()
    const isImage = fileExtension && imageTypes.includes(fileExtension)

    if (!isImage) {
      window.message.error('Only JPEG and PNG images are allowed.')
      return false
    }

    return true
  }
}

const handleUploadError = (config: DomainConfigs) => {
  config.loading = false
}

const handleUploadFinish = (config: DomainConfigs) => {
  return ({ file, event }: { file: UploadFileInfo; event?: any }) => {
    try {
      config.loading = false
      const result = JSON.parse(event?.target?.response || '{}')

      const urlNew = result?.data_object.thumb[0]

      if (!urlNew) {
        window.message.error('Upload failed, please try again.')
        return
      }

      config.image = URL_UPLOAD + result?.data_object.thumb[0]
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
<template>
  <n-card class="card-flex-gap-4">
    <div class="flex items-center gap-2">
      <div class="w-32 font-bold">Domains</div>
      <div class="min-w-0 flex-1">
        <n-select
          v-model:value="useLayoutDetail.domains"
          value-field="domain"
          label-field="domain"
          :options="domainOptions"
          multiple
          filterable
          clearable
          placeholder="Select domains"
          @update:value="updateDomains"
        />
      </div>
    </div>

    <div
      v-for="(config, index) in useLayoutDetail.layoutConfig.domain_config"
      :key="(config.domain || '') + index"
      class="border border-gray-200 mb-4 relative"
    >
      <div
        class="bg-gray-100 font-semibold text-sm p-4 border-b text-green-900"
      >
        {{ config.domain }}
      </div>

      <div class="flex gap-4 p-4 items-center">
        <div class="flex flex-1 items-center gap-2">
          <div class="font-bold w-32">URL</div>
          <div class="min-w-0 flex-1 flex gap-2 items-center">
            <n-input
              v-model:value="config.image"
              placeholder="Enter URL"
              :loading="config.loading"
            />
            <n-upload
              class="w-fit"
              :action="FULL_URL_MEDIA"
              :show-file-list="false"
              :default-file-list="files"
              accept="image/png, image/jpeg, image/svg+xml"
              :on-before-upload="beforeUpload(config)"
              :on-error="() => handleUploadError(config)"
              :on-finish="handleUploadFinish(config)"
            >
              <n-button class="whitespace-nowrap" :loading="config.loading"
                >Upload</n-button
              >
            </n-upload>

            <div
              v-if="config.image"
              class="w-32 h-24 overflow-hidden border border-gray-200 flex items-center justify-center"
            >
              <n-image
                :src="config.imageSrc()"
                class="w-full h-auto object-contain"
              />
            </div>
            <NoneImage v-else class="w-32 h-24 opacity-50" />
          </div>
        </div>
      </div>

      <RemoveButton
        @onClick="() => removeThis(config.domain)"
        class="z-10 shadow-md"
        text="Remove this domain config"
      />
    </div>
  </n-card>
</template>
