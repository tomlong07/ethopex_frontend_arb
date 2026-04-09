<script setup lang="ts">
import { googleAudienceData } from '@/types/components/google-audience'
import { loadingManager } from '@/types/components/audience-segment'
import { DropdownOption, SelectOption } from 'naive-ui'
import ListStars from '@/assets/icons/ListStars.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  audienceConfig: {
    type: Object as () => googleAudienceData,
    required: true,
  },
  accountId: Number,
  loadingStatus: {
    type: Object as () => loadingManager,
    required: true,
  },
  customSegmentOptions: {
    type: Array as () => SelectOption[],
    default: () => [],
  },
  menuOptions: {
    type: Array as () => DropdownOption[],
    default: () => [],
  },
  handleMenu: Function,
})

const name = 'Custom segments'
</script>

<template>
  <div class="flex items-center">
    <div class="w-full flex items-center flex-grow">
      <FloatingWrapper :name="name" rounded>
        <n-select
          v-model:value="props.audienceConfig.customAudience"
          placeholder="Select"
          filterable
          multiple
          value-field="id"
          label-field="name"
          :disabled="!props.accountId"
          :loading="props.loadingStatus.loadingCustom"
          :options="props.customSegmentOptions"
        />
      </FloatingWrapper>

      <div class="ml-2 flex items-center">
        <n-dropdown
          trigger="hover"
          :options="props.menuOptions"
          :on-select="(props.handleMenu as (key: string | number, option: DropdownOption) => void)"
        >
          <n-button
            color="#f43f5e"
            type="default"
            :class="{
              'pointer-events-none': !props.accountId,
            }"
            :disabled="!props.accountId"
            ><n-icon size="20"><ListStars /></n-icon
          ></n-button>
        </n-dropdown>
      </div>
    </div>
  </div>
</template>
