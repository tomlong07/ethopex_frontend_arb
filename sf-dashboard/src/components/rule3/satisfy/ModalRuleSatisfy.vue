<template>
  <n-modal
    v-model:show="modalSatisfyStore.showModal"
    :mask-closable="true"
    preset="card"
    class="overflow-hidden"
    :closable="false"
    style="width: 95vw; max-width: 1400px; max-height: 800px"
    :bordered="false"
  >
    <slot></slot>
    <template #header>
      <div class="flex">
        {{ props.title }}

        <n-button
          quaternary
          circle
          @click="modalSatisfyStore.showModal = false"
          class="bg-gray-100 ml-auto custom-modal-satisfy"
        >
          <template #icon>
            <n-icon :component="Close" />
          </template>
        </n-button>
      </div>
    </template>

    <div class="flex flex-col min-h-[400px] h-[550px]">
      <!-- Fixed Rule Information Section -->
      <div
        class="bg-gray-50 border border-gray-200 px-2 py-3 flex-shrink-0"
        v-if="modalSatisfyStore.dataRowSatisfy"
      >
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex flex-col">
            <span class="font-semibold text-gray-600 text-sm">Rule Name</span>
            <span v-if="ruleNameLink" class="text-blue-600 font-medium">
              <a
                :href="ruleNameLink"
                target="_blank"
                class="text-blue-600 hover:text-red-500 hover:underline"
              >
                {{ modalSatisfyStore.dataRowSatisfy.rule_name }}
              </a>
            </span>
            <span v-else class="text-blue-600 font-medium">
              {{ modalSatisfyStore.dataRowSatisfy.rule_name }}
            </span>
          </div>

          <div class="flex flex-col">
            <span class="font-semibold text-gray-600 text-sm"
              >Campaign Name</span
            >
            <span
              v-if="modalSatisfyStore.campaignHref"
              class="text-blue-600 font-medium"
            >
              <a
                :href="modalSatisfyStore.campaignHref"
                target="_blank"
                class="text-blue-600 hover:text-red-500 hover:underline"
              >
                {{ modalSatisfyStore.dataRowSatisfy.campaign_name }}
              </a>
            </span>
            <span v-else class="text-blue-600 font-medium">
              {{ modalSatisfyStore.dataRowSatisfy.campaign_name }}
            </span>
          </div>

          <div
            class="flex flex-col"
            v-if="modalSatisfyStore.isRuleDuplicateCampaign"
          >
            <span class="font-semibold text-gray-600 text-sm"
              >New Campaign</span
            >
            <span class="text-blue-600 font-medium">
              <a
                :href="`/campaign/${TS.FACEBOOK}/${modalSatisfyStore.dataRowSatisfy.new_campaign_id}`"
                target="_blank"
                class="text-blue-600 hover:text-red-500 hover:underline"
              >
                {{ modalSatisfyStore.dataRowSatisfy.new_campaign_name }}
              </a>
            </span>
          </div>

          <!-- Section -->
          <div
            v-if="modalSatisfyStore.dataRowSatisfy.section_name"
            class="flex flex-col"
          >
            <span class="font-semibold text-gray-600 text-sm">Section</span>
            <span class="text-gray-800">
              {{ modalSatisfyStore.dataRowSatisfy.section_name }}
            </span>
          </div>

          <!-- Ad Group ID -->
          <div
            v-if="modalSatisfyStore.dataRowSatisfy.ad_group_id"
            class="flex flex-col"
          >
            <span class="font-semibold text-gray-600 text-sm">Ad Group ID</span>
            <span class="text-gray-800">
              {{ modalSatisfyStore.dataRowSatisfy.ad_group_id }}
            </span>
          </div>

          <!-- Ad ID -->
          <div
            v-if="modalSatisfyStore.dataRowSatisfy.ad_id"
            class="flex flex-col"
          >
            <span class="font-semibold text-gray-600 text-sm">Ad ID</span>
            <span class="text-gray-800">
              {{ modalSatisfyStore.dataRowSatisfy.ad_id }}
            </span>
          </div>
        </div>
      </div>

      <!-- Scrollable Content Area -->
      <LogRuleSatisfy
        :data="modalSatisfyStore.dataRowSatisfy"
        :loading="props.isLoading"
        v-if="props.isReady"
      />

      <div v-else class="h-[300px] border rounded flex justify-center p-2 mt-4">
        Run a rule test to see the results.
      </div>
    </div>

    <!-- Fixed Footer -->
    <template #footer>
      <div class="flex items-center">
        <n-popover trigger="hover" v-if="!props.isLoading && props.isReady">
          <template #trigger>
            <div
              class="truncate text-xs mx-4"
              :class="[
                modalSatisfyStore.dataRowSatisfy?.message_error
                  ? 'text-red-400'
                  : 'text-gray-400',
              ]"
            >
              {{
                modalSatisfyStore.dataRowSatisfy?.message_error || 'No error'
              }}
            </div>
          </template>
          <span>{{ modalSatisfyStore.dataRowSatisfy?.message_error }}</span>
        </n-popover>
        <div class="ml-auto gap-2">
          <n-button @click="modalSatisfyStore.showModal = false" type="primary">
            Close
          </n-button>
        </div>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import LogRuleSatisfy from '@/components/common/LogRuleSatisfy.vue'
import Close from '@/assets/icons/Close.vue'
import { useTemplateV2 } from '@/store/templateV2Store'
import useModalSatisfyStore from '@/store/modalSatisfy'
import { TS } from '@/enum/campaign'

const props = defineProps({
  title: {
    type: String,
    default: 'Satisfy',
  },

  isLoading: {
    type: Boolean,
    default: false,
  },
  isReady: {
    type: Boolean,
    default: true,
  },
})

const modalSatisfyStore = useModalSatisfyStore()

const templateV2Store = useTemplateV2(helper.truePath())()

const generateLink = (fieldName: string, fieldValue: string) => {
  if (!fieldValue) return null

  const columnConfig = templateV2Store.columnConfigs.columns?.find(
    (col) => col.field === fieldName
  )
  if (!columnConfig?.link) return null

  if (fieldValue && String(fieldValue).includes('http')) return fieldValue
  if (columnConfig.link === 'http') return fieldValue

  let link = columnConfig.link
  const macros = helper.getMacros(columnConfig.link)
  if (macros && macros.length) {
    macros.forEach((macro) => {
      if (macro === 'value') {
        link = link.replace(`{{${macro}}}`, fieldValue)
      } else {
        let replacementValue = modalSatisfyStore.dataRowSatisfy?.[macro]
        if (
          !replacementValue &&
          modalSatisfyStore.dataRowSatisfy?.metrics &&
          modalSatisfyStore.dataRowSatisfy.metrics.length > 0
        ) {
          replacementValue = modalSatisfyStore.dataRowSatisfy.metrics[0][macro]
        }
        link = link.replace(`{{${macro}}}`, replacementValue || 'test')
      }
    })
  }

  return link
}

const ruleNameLink = computed(() =>
  generateLink('rule_name', modalSatisfyStore.dataRowSatisfy?.rule_name || '')
)
</script>
