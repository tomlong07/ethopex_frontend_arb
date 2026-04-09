<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'

const ButtonPerformance = defineAsyncComponent(
  () => import('@/components/google_targeting/ButtonPerformance.vue')
)

const templateV2Store = useTemplateV2(helper.truePath())()

const showAllButton = computed(() => {
  try {
    return templateV2Store.itemSelectedV2?.length != templateV2Store.totalItems
  } catch {
    return false
  }
})

const selectAll = () => {
  templateV2Store.isSelectAll = !templateV2Store.isSelectAll

  if (templateV2Store.isSelectAll) {
    templateV2Store.gridApiV2?.selectAll()
  } else {
    templateV2Store.gridApiV2?.deselectAll()
  }
}

const itemTotal = computed(() => {
  if (templateV2Store.isSelectAll) {
    return helper.formatNumberV2(templateV2Store.totalItems) || 0
  }

  return helper.formatNumberV2(templateV2Store.itemSelectedV2?.length) || 0
})

const textAll = computed(() => {
  if (templateV2Store.isSelectAll) {
    return 'unSelect all'
  }

  return 'Select all'
})
</script>

<template>
  <div
    v-if="templateV2Store.itemSelectedV2?.length || templateV2Store.isSelectAll"
    class="w-full z-[3] shadow-lg"
    :class="[
      templateV2Store.showSelectedAlert
        ? 'absolute -top-14 left-0'
        : 'fixed bottom-10 left-20',
    ]"
  >
    <n-alert
      type="info"
      closable
      :show-icon="false"
      v-if="templateV2Store.showSelectedAlert"
      @close="templateV2Store.showSelectedAlert = false"
    >
      <div class="flex items-center gap-2 custom-select-all-alert">
        {{ templateV2Store.isSelectAll ? 'All ' : '' }}{{ itemTotal }} selected

        <n-button
          :class="{ 'opacity-0': !showAllButton }"
          @click="selectAll"
          type="info"
          >{{ textAll }}</n-button
        >

        <div class="border-l border-black-500 h-10 ml-4">
          <n-divider vertical />
        </div>

        <ButtonPerformance
          v-if="templateV2Store.asyncConfigs.performanceButton"
        />
      </div>
    </n-alert>

    <n-button
      v-else
      @click="templateV2Store.showSelectedAlert = true"
      type="info"
      class="absolute -top-1"
      >Action</n-button
    >
  </div>
</template>
