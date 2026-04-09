<script lang="ts" setup>
import useShortCodeBlock from '@/store/useShortCodeBlock'
import { CB } from '@/enum/landing'
import JobType from '../EditBlock/JobType.vue'
import Amount from '../EditBlock/Amount.vue'
import Company from '../EditBlock/Company.vue'
import Title from '../EditBlock/Title.vue'
import Description from '../EditBlock/Description.vue'
import ButtonText from '../EditBlock/ButtonText.vue'
import ButtonUrl from '../EditBlock/ButtonUrl.vue'
import EditBlockTimePosted from '../EditBlock/EditBlockTimePosted.vue'

const store = useShortCodeBlock()

// Load ra các component input dựa trên template
const gridFields = computed(() => {
  if (!store.editingForm) return []

  const template = store.editingForm.template
  if (template === CB.JOB_POSTING_CARD) {
    return [
      { key: 'timePosted', component: EditBlockTimePosted },
      { key: 'jobType', component: JobType },
      { key: 'amount', component: Amount },
    ]
  }
  if (template === CB.PRICE_OFFER_CARD) {
    return [
      { key: 'company', component: Company },
      { key: 'amount', component: Amount },
    ]
  }
  return []
})

// Render columns utility function (moved from blockUtils.ts since only used here)
const renderCols = (template: string): number => {
  return template === CB.JOB_POSTING_CARD
    ? 3
    : template === CB.PRICE_OFFER_CARD
    ? 2
    : 1
}
</script>

<template>
  <div
    v-if="
      store.editingIndex !== undefined &&
      store.editingForm &&
      store.editingForm.items
    "
  >
    <Title
      :model-value="store.editingForm.items.title"
      @update:model-value="(val) => store.updateFormValue('title', val)"
    />
    <Description
      :model-value="store.editingForm.items.description"
      @update:model-value="(val) => store.updateFormValue('description', val)"
    />

    <n-grid :cols="renderCols(store.editingForm.template || '')" :x-gap="12">
      <!-- Load ra các component dựa trên template (gridFields)-->
      <n-grid-item v-for="field in gridFields" :key="field.key">
        <component
          :is="field.component"
          :model-value="(store.editingForm.items as any)?.[field.key]"
          @update:model-value="(val) => store.updateFormValue(field.key, val)"
        />
      </n-grid-item>
    </n-grid>

    <n-grid :cols="2" :x-gap="12">
      <n-grid-item>
        <ButtonText
          :model-value="store.editingForm.items.buttonText"
          @update:model-value="
            (val) => store.updateFormValue('buttonText', val)
          "
        />
      </n-grid-item>
      <n-grid-item>
        <ButtonUrl
          :model-value="store.editingForm.items.buttonUrl"
          @update:model-value="(val) => store.updateFormValue('buttonUrl', val)"
        />
      </n-grid-item>
    </n-grid>
  </div>
</template>
