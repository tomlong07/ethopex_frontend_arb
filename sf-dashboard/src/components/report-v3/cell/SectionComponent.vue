<script setup lang="ts">
import { CellComponent } from 'tabulator-tables'
import useReportV2Section from '@/store/report/report-v2-section'
import { DropdownOption } from 'naive-ui'
import SettingIcon from '@/assets/icons/SettingIcon.vue'
import CopyOutline from '@/assets/icons/CopyOutline.vue'
import { optionsSection } from '@/options/report'

const storeReportV2Section = useReportV2Section()

const props = defineProps({
  cell: {
    type: Object as () => CellComponent,
    required: true,
  },
})

const data = ref<any>(props.cell.getValue())

const copyData2 = (text: string) => {
  if (!text) {
    window.message.warning('No data to copy')
    return
  }
  helper.copyText(text)
  window.message.success('Copied')
}

const sectionCheck = ref(false)

const toggleSection = () => {
  sectionCheck.value = !sectionCheck.value

  if (sectionCheck.value) {
    storeReportV2Section.addSection(data.value)
  } else {
    storeReportV2Section.removeSection(data.value)
  }
}

const handleSelect = (key: string | number, option: DropdownOption) => {
  try {
    switch (option?.value) {
      case 'ids':
        if (storeReportV2Section.sectionIds?.length) {
          copyData2(storeReportV2Section.sectionIds.join('\n'))
          break
        }
        copyData2(data.value?.id)
        break
      case 'names':
        if (storeReportV2Section.sectionNames?.length) {
          copyData2(storeReportV2Section.sectionNames.join('\n'))
          break
        }
        copyData2(data.value?.name)
        break
      case 'referer':
        if (storeReportV2Section.sectionReferers?.length) {
          copyData2(storeReportV2Section.sectionReferers.join('\n'))
          break
        }
        copyData2(data.value?.referer)
        break
      case 'section_id':
        copyData2(data.value?.id)
        break
      case 'deselect':
        storeReportV2Section.deselectSection()
        break
    }
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => storeReportV2Section.sections,
  async (newValue, oldValue) => {
    if (!newValue?.length && sectionCheck.value) {
      sectionCheck.value = false
    }
  }
)
</script>
<template>
  <div class="flex w-full items-center gap-2 px-1">
    <n-checkbox
      v-model:checked="sectionCheck"
      :on-update:checked="toggleSection"
    />
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <span
          class="max-w-64 overflow-hidden text-ellipsis whitespace-nowrap text-gray-500"
          v-if="data?.name"
          @click="copyData2(data?.name)"
          title="Click to copy"
          >{{ data?.name || '-' }}</span
        >
      </div>

      <div class="flex items-center gap-2">
        <a
          :href="`https://${data?.referer}`"
          target="_blank"
          class="max-w-64 overflow-hidden text-ellipsis whitespace-nowrap text-xs text-blue-link"
          v-if="data?.referer"
          >{{ data?.referer || '-' }}</a
        >
        <n-icon
          class="hover:scale-105"
          size="16"
          title="Copy"
          :component="CopyOutline"
          @click="copyData2(data?.referer)"
          v-if="data?.referer"
        />
      </div>

      <div class="flex items-center gap-2"></div>
    </div>
    <div class="ml-auto">
      <n-dropdown
        trigger="hover"
        :options="optionsSection"
        :on-select="handleSelect"
      >
        <n-button text>
          <template #icon>
            <n-icon :component="SettingIcon" size="24"></n-icon> </template
        ></n-button>
      </n-dropdown>
    </div>
  </div>
</template>
