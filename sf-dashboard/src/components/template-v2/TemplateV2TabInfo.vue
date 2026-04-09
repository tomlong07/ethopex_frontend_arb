<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { useTemplateV2 } from '@/store/templateV2Store'

import TabInfo from '../common/TabInfo.vue'
import { IconTrafficSourcesCDN } from '@/map/campaign'
import useGeneralStore from '@/store/useGeneralStore'

const CrawlKeyword = defineAsyncComponent(
  () => import('@/components/crawl_campaign/CrawlKeyword.vue')
)

const CrawlModal = defineAsyncComponent(
  () => import('@/components/crawl_campaign/CrawlModal.vue')
)

const ButtonSyncBlackList = defineAsyncComponent(
  () => import('@/components/google_targeting/ButtonSyncBlackList.vue')
)
const generalStore = useGeneralStore()

const templateV2Store = useTemplateV2(helper.truePath())()

const thisRoute = computed(() => window.route.path)

const handleTabChangeRouter = (tabKey: string) => {
  const thisTab = templateV2Store.backRouter.find((item) => item.url === tabKey)

  if (!thisTab || thisTab.current) return

  const thisId = window.route.query[thisTab.query] as string
  window.router.push(tabKey.replace(':id', thisId))
}

const urlTo = (tabKey: string) => {
  const thisTab = templateV2Store.backRouter.find((item) => item.url === tabKey)

  if (!thisTab || thisTab.current) return ''

  const thisId = window.route.query[thisTab.query] as string
  return tabKey.replace(':id', thisId)
}

const getLogo = (logo: string) => {
  const item = IconTrafficSourcesCDN[logo]
  if (!item) return null

  return h('div', { class: 'flex-shrink-0' }, [
    h('img', {
      src: item.URL(),
      class: 'rounded p-0.5 scale-75',
      style: generalStore.isDark ? { backgroundColor: 'white' } : undefined,
      width: item.size,
      height: item.size,
    }),
  ])
}

const templateTabData = computed(
  () => templateV2Store.baseConfigs?.tabInfo || []
)

const activeNow = computed(() => {
  return thisRoute.value
})
</script>

<template>
  <div
    class="z-10 relative bg-gray-100 main-group-child campaign-group-by flex items-center"
  >
    <div class="group-btn flex justify-start mx-2">
      <div
        class="flex p-2 flex-col"
        v-if="templateV2Store.baseConfigs.tabRadio"
      >
        <div class="font-bold text-xs text-gray-500 pb-1">Tab View:</div>
        <div class="flex flex-row custom-tab-info-radio">
          <router-link
            :to="item.key"
            v-for="(item, index) in templateV2Store.baseConfigs.tabInfo"
            :key="item.key"
          >
            <n-radio-group :value="thisRoute">
              <div class="grid grid-rows-1 grid-flow-col gap-1">
                <n-radio
                  size="small"
                  :value="item.key"
                  :label="item.name"
                  class="text-xs"
                />
              </div>
            </n-radio-group>
          </router-link>
        </div>
      </div>

      <template v-else>
        <n-tabs
          :value="thisRoute"
          animated
          class="m-2"
          v-if="templateV2Store.backRouter?.length"
          @update:value="handleTabChangeRouter"
        >
          <n-tab-pane
            :name="item.url"
            :tab="item.name"
            v-for="(item, index) in templateV2Store.backRouter"
            :key="index"
          >
            <template #tab>
              <a
                :href="urlTo(item.url)"
                class="no-underline text-inherit"
                @click.stop
              >
                {{ item.name }}
              </a>
            </template>
          </n-tab-pane>
        </n-tabs>

        <TabInfo :tabData="templateTabData" :activeTab="activeNow" v-else />
      </template>
    </div>

    <div class="ml-auto">
      <CrawlModal v-if="templateV2Store.baseConfigs.IsModalCrawl()" />

      <CrawlKeyword v-if="templateV2Store.baseConfigs.IsModalCrawlKeyword()" />

      <ButtonSyncBlackList
        v-if="templateV2Store.asyncConfigs.actionBlackList"
      />

      <router-link
        :to="templateV2Store.addUrlNow"
        v-if="templateV2Store.addUrlNow"
      >
        <n-button class="mr-4" color="#f43f5e" size="small">
          {{ templateV2Store.nameAddNow }}
        </n-button>
      </router-link>
    </div>
  </div>
</template>
<style scoped>
:deep(.n-tab-pane) {
  --n-pane-padding-top: 0px !important;
}
</style>
