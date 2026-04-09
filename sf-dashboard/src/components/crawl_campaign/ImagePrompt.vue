<script setup lang="ts">
import { CrawlImagePrompt } from '@/class/crawl_campaign'
import { RatioList } from '@/constants/crawlCampaign'

import modalCrawlCamp from '@/store/modalCrawlCamp'

const storeModalCrawl = modalCrawlCamp()

const sections = computed(() => [
  {
    key: 'p',
    label: 'Prompt',
    items: storeModalCrawl.itemsPrompt,
  },
  {
    key: 'a',
    label: 'API',
    items: storeModalCrawl.itemsAPI,
  },
])

onMounted(async () => {
  if (storeModalCrawl.dataCrawlCamp.IsFacebookTS()) {
    storeModalCrawl.getDataImagePrompts()
  }
})

watch(
  () => storeModalCrawl.dataCrawlCamp.IsFacebookTS(),
  async (newValue) => {
    if (newValue) {
      storeModalCrawl.getDataImagePrompts()
    }
  }
)

const isSelected = (item: CrawlImagePrompt) => {
  return storeModalCrawl.dataCrawlCamp.image_prompt.some(
    (i) => i.KeyUnique() === item.KeyUnique()
  )
}

const toggleSelect = (item: CrawlImagePrompt) => {
  const exists = storeModalCrawl.dataCrawlCamp.CurrentImagePrompt(item)

  if (exists) {
    // bỏ chọn
    storeModalCrawl.dataCrawlCamp.image_prompt =
      storeModalCrawl.dataCrawlCamp.image_prompt.filter(
        (i) => i.KeyUnique() !== item.KeyUnique()
      )
    item.ratio = []
  } else {
    // chọn thêm
    storeModalCrawl.dataCrawlCamp.image_prompt.push(item)
    item.ratio = helper.clone(RatioList)
  }
}

const toggleRatio = (item: CrawlImagePrompt, ratio: string) => {
  const exists = storeModalCrawl.dataCrawlCamp.CurrentImagePrompt(item)

  if (!exists) return

  if (!exists.ratio) exists.ratio = []
  const index = exists.ratio.indexOf(ratio)
  if (index > -1) {
    exists.ratio.splice(index, 1)
  } else {
    exists.ratio.push(ratio)
  }
}

const isIncludeRatio = (item: CrawlImagePrompt, ratio: string) => {
  const exists = storeModalCrawl.dataCrawlCamp.CurrentImagePrompt(item)

  if (!exists) return

  return exists.IsIncludeRatio(ratio)
}
</script>

<template>
  <div
    v-for="section in sections"
    :key="section.key"
    class="flex flex-wrap gap-2 mt-4"
  >
    <template v-if="section.items.length">
      <div class="w-full font-semibold">{{ section.label }}</div>

      <div
        v-for="(item, index) in section.items"
        :key="section.key + '-' + index"
        class="relative flex flex-col gap-2"
      >
        <n-popover>
          <template #trigger>
            <div
              class="w-[90px] h-[90px] flex items-center justify-center rounded-md border overflow-hidden cursor-pointer bg-white"
              @click="toggleSelect(item)"
            >
              <img
                :src="item.ImageURL()"
                class="max-w-full max-h-full object-contain"
              />
            </div>
          </template>

          <!-- Popover content -->
          <template #default>
            <span v-if="section.key === 'p'">Prompt {{ item.prompt }}</span>
            <span v-else>{{ item.api }}</span>
          </template>
        </n-popover>

        <div
          class="text-xxs flex items-center justify-center gap-2 opacity-0 ease-in delay-100"
          :class="{ 'opacity-100': isSelected(item) }"
        >
          <n-button
            v-for="(rat, ind) in RatioList"
            :key="rat + ind"
            :type="isIncludeRatio(item, rat) ? 'primary' : 'default'"
            @click="toggleRatio(item, rat)"
            size="tiny"
          >
            {{ rat }}
          </n-button>
        </div>

        <!-- TICK -->
        <div
          v-if="isSelected(item)"
          @click="toggleSelect(item)"
          class="absolute top-1 right-1 bg-green-500 text-white text-xs rounded px-1"
        >
          ✓
        </div>
      </div>
    </template>
  </div>
</template>
