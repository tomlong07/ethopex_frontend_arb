<script setup lang="ts">
import Close from '@/assets/icons/Close.vue'
import useGeneralStore from '@/store/useGeneralStore'

const generalStore = useGeneralStore()
const props = defineProps({
  title: {
    type: String,
    default: 'Default',
  },
  data: {
    type: Array as PropType<any[]>,
  },

  hoveredIndex: Number,
  hoveredList: Number,
  isActive: Boolean,
  isScrolling: Boolean,
})
const emit = defineEmits(['mouseHover'])
const itemRefs = ref<HTMLElement[]>([])

function setItemRef(el: HTMLElement | null, index: number) {
  if (el) itemRefs.value[index] = el
}

const isScrolling = computed(() => props.isScrolling)

watch(
  () => props.hoveredIndex,
  async (newIndex) => {
    if (newIndex == null || newIndex < 0) return
    await nextTick()
    itemRefs.value[newIndex]?.scrollIntoView({
      block: 'nearest',
      behavior: 'auto',
    })
  }
)

const isRecent = computed(() => {
  return ['Recent', 'recent'].includes(props.title)
})

const isOnSaveRecent = computed(() => generalStore.isSaveRecent ?? false)

const isExistRecent = computed(() => {
  return generalStore.recentActivity && generalStore.recentActivity.length > 0
})
const buildName = (item: any) => {
  let arrName: string[] = []

  if (item.name) {
    arrName.push(item.name)
  }
  if (item.title) {
    arrName.push(item.title)
  }

  let response = arrName.join(' - ')

  if (response) {
    return response
  }
  return item.url
}

const handleSaveRecent = async (value: any) => {
  if (!value || !value.url) return
  await generalStore.saveRecent(value)
}

const mouseHover = (index: number) => {
  if (index == -1) return
  const _mouse = {
    hoveredIndex: index,
    hoveredList: isRecent.value ? 0 : 1,
  }
  emit('mouseHover', _mouse)
}

const removeAll = async () => {
  await generalStore.removeRecentAll()
}

const removeItem = async (item: any) => {
  if (!item) return
  await generalStore.removeRecent(item)
}
</script>

<template>
  <div
    class="flex justify-between px-2 pt-3 items-center"
    v-if="isRecent && isExistRecent"
  >
    <div class="font-medium text-gray-800">
      {{ title }}
    </div>
    <div class="btn-remove">
      <button
        @click="removeAll"
        class="remove-recents text-sm font-medium text-gray-500"
      >
        Remove recents
      </button>
    </div>
  </div>

  <div
    class="font-medium text-gray-800 px-2 pt-3"
    v-else-if="isOnSaveRecent && isExistRecent"
  >
    {{ title }}
  </div>

  <div
    v-for="(item, index) in data"
    :key="item.url"
    class="router-link-search px-2 rounded-lg"
    :class="{
      'enter-now-router bg-[#e0e7ff]': index === hoveredIndex,
    }"
    :ref="(el) => setItemRef(el as HTMLElement | null, index)"
    @mouseenter="!isScrolling && mouseHover(index)"
  >
    <div
      :class="[isRecent ? 'flex gap-1 items-center cursor-pointer' : 'link']"
      v-if="item.url.includes('http')"
    >
      <n-icon
        v-if="isRecent"
        :component="Close"
        @click="removeItem(item)"
        :size="20"
      />
      <a
        @click="handleSaveRecent(item)"
        target="_blank"
        :href="item.url"
        class="py-2"
      >
        <div class="flex items-center">
          <div
            class="ml-auto text-xxs text-blue-300 overflow-hidden text-ellipsis max-w-64 text-nowrap"
          >
            {{ item.url }}
          </div>
        </div>
      </a>
    </div>
    <div
      :class="[isRecent ? 'flex gap-1 items-center cursor-pointer' : 'link']"
      v-else
    >
      <n-icon
        v-if="isRecent"
        :component="Close"
        @click="removeItem(item)"
        :size="20"
        color="#99a1af"
      />
      <router-link
        @click="handleSaveRecent(item)"
        target="_blank"
        :to="item.url"
        class="py-2"
      >
        <div class="flex items-center">
          {{ buildName(item) }}

          <div
            class="ml-auto text-xxs text-blue-300 overflow-hidden text-ellipsis max-w-64 text-nowrap"
          >
            {{ item.url }}
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>
