<script setup lang="ts">
import useCampaignAddMultiple, {
  AddMultipleInfo,
} from '@/store/useCampaignAddMultiple'
import CreativeFanpage from '@/components/campaign/modules/facebook/Ads/CreativeFanpage.vue'
import {
  creativeStruct,
  SelectOptionsManager,
} from '@/types/components/campaign-v2'
import { RenderLabel, renderTag } from '@/components/campaign/modules/Creative'

import { SelectOption } from 'naive-ui'
import { debounceV2 } from '@/utils'
import { AD_SETUP, TS } from '@/enum/campaign'
import Close2 from '@/assets/icons/Close2.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
const addMultipleStore = useCampaignAddMultiple()

const offModal = () => {
  addMultipleStore.changeShowModal(false)
}

const dataManager = ref<AddMultipleInfo>({})

const optionManager = ref(new SelectOptionsManager())
const isLoading = ref(false)

const creative_ids = computed(() => {
  return dataManager.value.creative_ids
    ? dataManager.value.creative_ids.toString()
    : ''
})

watch(
  () => addMultipleStore.showModal,
  (newVal, oldVal) => {
    if (newVal) {
      dataManager.value = {}
      optionManager.value.fetchFanpageOptions()
      fetchCreatives()
    }
  }
)

// onMounted(() => {
//   optionManager.value.fetchFanpageOptions()
//   fetchCreatives()
// })

const renderCreativeLabel = (option: SelectOption) => {
  return RenderLabel(option, true)
}

const fetchCreatives = async (q?: string) => {
  optionManager.value.fetchCreativeOptions({
    ts: TS.FACEBOOK,
    type: TS.FACEBOOK,
    q: q,
    ids: creative_ids.value,
  })
}

const handleCreativeSearch = debounceV2(async (query?: string) => {
  fetchCreatives(query)
}, 300)

const changeNameDuplicate = (
  adcreative: creativeStruct,
  creatives: creativeStruct[]
) => {
  const baseName = (adcreative.name ?? '').replace(/\s*\(Copy( \d+)?\)$/, '')

  let counter = 1
  let newName = `${baseName} (Copy)`

  while (creatives.some((c) => c.name === newName)) {
    counter++
    newName = `${baseName} (Copy ${counter})`
  }

  return newName
}

const submit = () => {
  try {
    const adgroup = addMultipleStore.dataModal.adgroup
    if (adgroup) {
      const creatives = adgroup.creatives || []

      dataManager.value.creative_ids?.map((e, index) => {
        const newCreative: creativeStruct = {
          creative_id: e,
          fanpage: dataManager.value.fanpage,
          ad_setup: AD_SETUP.CREATE_AD,
          name: changeNameDuplicate(
            { name: `Ad ${creatives.length + 1}` } as creativeStruct,
            creatives
          ),
        }

        creatives.push(newCreative)
      })

      adgroup.creatives = creatives
    }

    if (addMultipleStore.dataModal.callback) {
      addMultipleStore.dataModal.callback()
    }
  } catch (error) {
    console.error(error)
  }

  offModal()
}
const name = 'Creatives'
</script>

<template>
  <n-modal v-model:show="addMultipleStore.showModal">
    <n-card
      style="width: 600px; height: 300px"
      title="Add Multiple"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-icon
          size="26"
          class="ml-auto button-close cursor-pointer"
          @click="offModal"
          ><Close2 /></n-icon
      ></template>

      <div class="flex flex-col gap-4">
        <CreativeFanpage
          :adcreative="dataManager"
          :optionsManager="optionManager"
        />

        <FloatingWrapper :name="name" required rounded>
          <n-select
            v-model:value="dataManager.creative_ids"
            filterable
            remote
            multiple
            value-field="id"
            label-field="name"
            :loading="isLoading"
            :placeholder="name"
            :render-label="renderCreativeLabel"
            :render-tag="(props: any)=>renderTag(props, true)"
            :options="optionManager.creativeOptions"
            :max-tag-count="1"
            @search="handleCreativeSearch"
          />
        </FloatingWrapper>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <n-button class="button-apply" color="#f43f5e" @click="submit()">
            Submit
          </n-button>
        </div></template
      >
    </n-card>
  </n-modal>
</template>
