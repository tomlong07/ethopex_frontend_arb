<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import addsenseAcountStore from '@/store/details/useAdsenseStore'
import { ctr_adsense_style } from '@/services/ctr_adsense_style'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { debounceV2 } from '@/utils'
const dataConfig = addsenseAcountStore()
const id = Number(window.route.params.id || 0)
const isAddPage = computed<boolean>(() => id === 0)
const isEditPage = computed<boolean>(() => !isAddPage.value)
const generationSelectOptions = ref<SelectOption[]>([])

const getGenerationByAdsense = async () => {
  const result = await ctr_adsense_style.GetGenerationOfStyleByPubID(
    dataConfig.adsenseAccountConfig.pub_id
  )

  if (result?.status) {
    generationSelectOptions.value = []
    ;(result?.data || []).forEach((element: any) => {
      generationSelectOptions.value.push({
        value: element?.generation,
        label: element?.generation,
      })
    })
  }
}

const debounceGeneration = debounceV2(async () => {
  getGenerationByAdsense()
}, 600)

watch(
  () => dataConfig.adsenseAccountConfig.pub_id,
  (newValue, oldValue) => {
    if (newValue) {
      if (isAddPage.value) return
      debounceGeneration()
    }
  }
)
const name = 'Generation'
</script>

<template>
  <div class="flex items-center" v-if="isEditPage">
    <FloatingWrapper :name="name" rounded>
      <n-select
        v-model:value="dataConfig.adsenseAccountConfig.generation"
        tag
        :options="generationSelectOptions"
      />
    </FloatingWrapper>
  </div>
</template>
