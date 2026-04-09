<script setup lang="ts">
import { landingTypeClass } from '@/types/components/landing'
import TitleDropdown from './TitleDropdown.vue'
import RemoveButton from '@/components/creative3/RemoveButton.vue'
import CompanyName from './CompanyName.vue'
import NumberOfJobs from './NumberOfJobs.vue'
import PlusLg from '@/assets/icons/PlusLg.vue'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})

const onRemoveThisCompany = (index: number) => {
  if (props.landing.prelander_configs?.list_company) {
    props.landing.prelander_configs.list_company.splice(index, 1)
  }
}

watch(
  () => props.landing.prelander_configs?.IsTheme1(),
  (newValue) => {
    if (newValue) {
      try {
        if (props.landing.prelander_configs) {
          props.landing.prelander_configs.title_dropdown = `What companies are hiring for Siding Installer job in United States?`

          if (!props.landing.prelander_configs?.list_company) {
            props.landing.prelander_configs.list_company = []
            props.landing.prelander_configs?.addCompanyDefault()
          }
        }
      } catch {}
    } else {
      if (props.landing.prelander_configs) {
        props.landing.prelander_configs.list_company = undefined
      }
    }
  }
)
</script>
<template>
  <n-card
    class="card-flex-gap-4"
    title="Company Configs (Theme 1)"
    v-show="
      props.landing.IsShowPrelanderConfigs() &&
      props.landing.prelander_configs?.IsTheme1()
    "
  >
    <TitleDropdown
      v-if="props.landing.prelander_configs"
      :configs="props.landing.prelander_configs"
    />

    <n-card
      class="card-flex-gap-4"
      title="List Company"
      v-if="props.landing.prelander_configs?.IsTheme1()"
    >
      <div class="grid grid-cols-2 gap-4">
        <div
          v-for="(company, index) in props.landing.prelander_configs
            ?.list_company"
          :key="index"
          class="relative grid grid-cols-2 gap-2 shadow-md border p-4 rounded"
        >
          <CompanyName :company="company" />
          <NumberOfJobs :company="company" />
          <RemoveButton
            @onClick="() => onRemoveThisCompany(index)"
            class="shadow-md"
            text="Remove this item"
          />
        </div>

        <n-button
          size="small"
          class="w-32"
          title="Add new company"
          @click="props.landing.prelander_configs?.addCompany()"
          ><n-icon :component="PlusLg" size="16" />Add Company</n-button
        >
      </div>
    </n-card>
  </n-card>
</template>
