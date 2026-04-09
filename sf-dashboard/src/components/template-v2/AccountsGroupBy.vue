<script setup lang="ts">
import { LOCAL_STORAGE_TOKEN } from '@/constants/storage'

import useGeneralStore from '@/store/useGeneralStore'

import { useTemplateV2 } from '@/store/templateV2Store'
import { IconTrafficSourcesCDN } from '@/map/campaign'
const templateV2Store = useTemplateV2(helper.truePath())()
const generalStore = useGeneralStore()

const isShowModel = ref<boolean>(false)
const uifObj = JSON.parse(localStorage.getItem(LOCAL_STORAGE_TOKEN) || '{}')

const toURL = (url: string) => {
  if (url.includes('${token}')) return url.replace('${token}', uifObj.token)
  return url
}
const getInfo = (ts: string) => {
  return IconTrafficSourcesCDN[ts] || null
}
</script>

<template>
  <div
    class="flex justify-between z-10 relative bg-gray-100 main-group-child campaign-group-by"
  >
    <div class="group-btn flex justify-start"></div>

    <div class="flex items-center py-2 px-2">
      <n-button
        class="mr-2"
        color="#f43f5e"
        size="small"
        @click="isShowModel = true"
      >
        {{ 'Add Account' }}
      </n-button>
    </div>
  </div>
  <!-- model popup -->
  <n-modal v-model:show="isShowModel">
    <n-card
      style="width: 1000px"
      title="Select type of account you want add!"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <div class="grid grid-cols-4 gap-4">
        <component
          :is="item.url?.includes('http') ? 'a' : 'router-link'"
          v-for="(item, index) in templateV2Store.asyncConfigs?.addAccounts"
          :key="item.url"
          :to="item.url?.includes('http') ? undefined : toURL(item.url)"
          :href="item.url?.includes('http') ? toURL(item.url) : undefined"
          :target="item.url?.includes('http') ? item.target || '' : ''"
          class="flex flex-col justify-center text-center items-center mb-4 p-4 border-dotted border-2 border-gray-400 cursor-pointer rainbow"
        >
          <img
            class="rounded p-0.5"
            :style="
              generalStore.isDark ? { backgroundColor: 'white' } : undefined
            "
            :src="getInfo(item.icon)?.URL()"
            :width="getInfo(item.icon)?.size"
            :height="getInfo(item.icon)?.size"
            loading="lazy"
          />
          <div class="text-lg font-semibold">{{ item.name }}</div>
          <div class="text-xs text-gray-500">
            {{ item.text }}
          </div>
        </component>
      </div>
    </n-card>
  </n-modal>
</template>
<style lang="scss" scoped>
.rainbow:hover {
  place-content: center;
  text-align: center;
  font-size: 1.5em;

  /* Paint an image in the border */
  border-image: conic-gradient(
      from var(--angle),
      #effb00 0deg 180deg,
      #fbdd00 180deg 360deg
    )
    1 stretch;
}

/* Animate when Houdini is available */
@supports (background: paint(houdini)) {
  @property --opacity {
    syntax: '<number>';
    initial-value: 0.5;
    inherits: false;
  }

  @property --angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }

  @keyframes opacityChange {
    to {
      --opacity: 1;
    }
  }

  @keyframes rotate {
    to {
      --angle: 360deg;
    }
  }

  .rainbow {
    animation: rotate 4s linear infinite, opacityChange 3s infinite alternate;
  }

  /* Hide the warning */
  .warning {
    display: none;
  }
}
</style>
