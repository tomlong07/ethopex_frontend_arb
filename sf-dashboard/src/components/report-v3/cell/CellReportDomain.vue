<script setup lang="ts">
import { NButton, NDropdown, NPopover } from 'naive-ui'

const props = defineProps({
  value: String,
  linkLanding: String,
})

const isMobile = helper.mobileDetect()
const isTablet = helper.isTabletOrSmallOrTouchDevice()

const vlNow = props.value || '#'

const openLink = () => {
  if (props.linkLanding) {
    window.open(props.linkLanding, '_blank')
  }
}

const options = [
  { label: 'Copy', key: 'copy' },
  { label: 'Open', key: 'open' },
]

const handleSelect = (key: string) => {
  if (key === 'copy') {
    helper.copyText(props.linkLanding)
    window.message.success('Copied!')
  } else if (key === 'open') {
    openLink()
  }
}
</script>

<template>
  <div class="flex w-full gap-2">
    <a
      class="overflow-hidden text-ellipsis text-blue-500"
      :href="`/?domain=${vlNow}`"
      target="_blank"
    >
      {{ value }}
    </a>

    <div class="ml-auto flex items-center gap-2" v-if="props.linkLanding">
      <!-- Desktop -->

      <n-popover
        trigger="hover"
        :width="250"
        :show-arrow="false"
        v-if="!isMobile && !isTablet"
      >
        <template #trigger>
          <n-button size="small" :title="props.linkLanding" @click="openLink">
            Open
          </n-button>
        </template>
        <span>{{ props.linkLanding }}</span>
      </n-popover>

      <!-- Mobile / Tablet -->

      <n-dropdown
        trigger="click"
        :options="options"
        @select="handleSelect"
        v-if="isMobile || isTablet"
      >
        <n-popover trigger="hover" :width="250" :show-arrow="false">
          <template #trigger>
            <n-button size="small">Open</n-button>
          </template>
          <div>{{ props.linkLanding }}</div>
        </n-popover>
      </n-dropdown>
    </div>
  </div>
</template>
