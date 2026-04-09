<script setup lang="ts">
import { DS } from '@/enum/campaign'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { ctr_layout } from '@/services/ctr_layout'

import useModalLandingLink from '@/store/landing/modalLink'
import { SelectOption } from 'naive-ui'

const modalLandingLinkStore = useModalLandingLink()

const selectedDomain = ref<string | null>('')
const selectedLayout = ref<number | null>(null)
const utmSource = ref('')
const utmCampaign = ref('')
const isLoadingDomain = ref(false)
const isLoadingLayout = ref(false)

const domainOptions = ref<SelectOption[]>([])
const layoutOptions = ref<SelectOption[]>([])

const fetchDomains = async () => {
  isLoadingDomain.value = true
  const result = await ctr_filter_v2.FilterDomain({})

  domainOptions.value = result?.data || []

  selectedDomain.value =
    domainOptions.value.length > 0
      ? (domainOptions.value[0].value as string)
      : null

  isLoadingDomain.value = false
}

const fetchLayouts = async () => {
  isLoadingLayout.value = true
  const result = await ctr_layout.Layouts({ demand_source: DS.PUBPOWER })

  layoutOptions.value = result?.data || []

  selectedLayout.value =
    layoutOptions.value.length > 0
      ? (layoutOptions.value[0].id as number)
      : null

  isLoadingLayout.value = false
}

watch(
  () => modalLandingLinkStore.showModal,
  (newVal) => {
    if (newVal) {
      const landingID =
        modalLandingLinkStore.dataLandingLink?.landing_id?.toString() || ''
      utmSource.value = `uk`
      utmCampaign.value = `uk-${landingID}`
      fetchDomains()
      fetchLayouts()
    }
  }
)

const generatedUrl = computed(() => {
  if (!selectedDomain.value) return ''
  const base = `https://${selectedDomain.value}/carb/${selectedLayout.value}/${modalLandingLinkStore.dataLandingLink.slug}.webm`
  const params = new URLSearchParams()
  params.set('utm_source', utmSource.value)
  params.set('utm_campaign', utmCampaign.value)
  params.set(
    'utm_lid',
    modalLandingLinkStore.dataLandingLink?.landing_id?.toString() || ''
  )

  params.set(
    'utm_uid',
    modalLandingLinkStore.dataLandingLink?.user_id?.toString() || ''
  )
  return `${base}?${params.toString()}`
})

const copyUrl = async () => {
  try {
    helper.copyText(generatedUrl.value)
    window.message.success('Copied URL to clipboard!')
  } catch {
    window.message.error('Copy failed!')
  }
}

const previewUrl = () => {
  window.open(generatedUrl.value, '_blank')
}
</script>

<template>
  <n-modal
    v-model:show="modalLandingLinkStore.showModal"
    preset="card"
    :title="modalLandingLinkStore.dataLandingLink.landing_name"
    style="width: 1200px"
  >
    <div class="space-y-4">
      <!-- Row Inputs -->
      <div class="flex gap-4 items-start">
        <!-- Domain -->
        <div class="flex-1 flex flex-col">
          <label class="invisible text-sm mb-1">&nbsp;</label>
          <n-select
            v-model:value="selectedDomain"
            :options="domainOptions"
            filterable
            placeholder="Select Domain"
            :loading="isLoadingDomain"
          />
        </div>

        <!-- Layout -->
        <div class="flex-1 flex flex-col">
          <label class="invisible text-sm mb-1">&nbsp;</label>
          <n-select
            v-model:value="selectedLayout"
            :options="layoutOptions"
            placeholder="Select Layout"
            :loading="isLoadingLayout"
            value-field="id"
            label-field="name"
          />
        </div>

        <!-- UTM Source -->
        <div class="flex-1 flex flex-col">
          <label class="text-sm font-bold mb-1">utm_source</label>
          <n-input
            v-model:value="utmSource"
            placeholder="utm_source"
            maxlength="5"
            show-count
            :allow-input="(val:string) => !/[ _]/.test(val)"
          />
        </div>

        <!-- UTM Campaign -->
        <div class="flex-1 flex flex-col">
          <label class="text-sm font-bold mb-1">utm_campaign</label>
          <n-input
            v-model:value="utmCampaign"
            placeholder="utm_campaign"
            :allow-input="(val:string) => !/[ _]/.test(val)"
          />
        </div>
      </div>

      <!-- URL Output -->
      <n-input
        :value="generatedUrl"
        readonly
        class="w-full"
        placeholder="Link"
        :input-props="{
          style: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
        }"
      />

      <div class="flex items-center">
        <div class="text-xs text-red-400">
          Note: Add <b>utm_source</b> and <b>utm_campaign</b> names to track
          your campaign easily.
        </div>

        <!-- Buttons -->
        <div class="flex ml-auto gap-2">
          <n-button type="primary" @click="copyUrl">Copy Url</n-button>
          <n-button type="default" @click="previewUrl" secondary
            >Preview</n-button
          >
        </div>
      </div>
    </div>
  </n-modal>
</template>
