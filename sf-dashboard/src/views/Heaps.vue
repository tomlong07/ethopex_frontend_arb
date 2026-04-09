<script setup lang="ts">
import { HeapsData } from '@/class/heaps'
import { ctr_tool } from '@/services/ctr_tool'

const isLoading = ref(true)
const loadingHeap = ref(false)

const heapData = ref<HeapsData>(new HeapsData())

const loadHeaps = async () => {
  isLoading.value = true
  const result = await ctr_tool.Heaps()
  heapData.value = new HeapsData(result?.data || {})
  isLoading.value = false
}

onMounted(() => {
  loadHeaps()
})

type AppDataItem = {
  name: string
  url: string
}

// state
const selectedKey = ref<string | null>(null)
const selectedItem = ref<AppDataItem | null>(null)

const menuOptions = computed(() => {
  const result: any[] = []

  const data = heapData.value?.data || {}

  Object.entries(data).forEach(([groupName, apps]) => {
    result.push({
      label: groupName, // apps / apps2
      key: groupName,
      children: Object.entries(apps).map(([appName, items]) => ({
        label: () => h('div', { class: 'menu-child-item truncate' }, appName),
        key: `${groupName}::${appName}`,
        children: items.map((item) => ({
          label: () =>
            h('div', { class: 'menu-child-item-2 truncate' }, item.name),
          key: `${groupName}::${appName}::${item.name}`,
          item, // Heap instance
        })),
      })),
    })
  })

  return result
})

const expandedKeys = computed(() => {
  const keys: string[] = []

  const walk = (items: any[]) => {
    items.forEach((item) => {
      if (item.children?.length) {
        keys.push(item.key)
        walk(item.children)
      }
    })
  }

  walk(menuOptions.value)
  return keys
})

const handleMenuSelect = (key: string, option: any) => {
  selectedKey.value = key
  selectedItem.value = option.item || null

  getHeapByID()
}

const getHeapByID = async () => {
  loadingHeap.value = true

  const result = await ctr_tool.Heap(selectedItem.value?.url)
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
    imageUrl.value = null
  }

  if (result) imageUrl.value = URL.createObjectURL(result)

  loadingHeap.value = false
}

const imageUrl = ref<string | null>(null)
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1 pb-12 mt-4">
    <div v-show="isLoading">
      <Skeleton />
    </div>
    <div v-if="!isLoading" class="border">
      <div
        class="flex justify-between relative bg-gray-100 items-center gap-1 flex-wrap"
      >
        <n-layout has-sider class="h-full">
          <n-layout-sider width="260" bordered>
            <n-menu
              :options="menuOptions"
              :value="selectedKey"
              :expandedKeys="expandedKeys"
              @update:value="handleMenuSelect"
            />
          </n-layout-sider>

          <n-layout-content class="p-4">
            <n-card v-if="selectedItem" :title="selectedItem.name">
              <n-spin :show="loadingHeap">
                <template v-if="imageUrl">
                  <n-image :src="imageUrl" width="100%" object-fit="contain" />
                </template>

                <template v-else-if="!loadingHeap"> No Image </template>
              </n-spin>
            </n-card>

            <n-card v-else> Select a file to view </n-card>
          </n-layout-content>
        </n-layout>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.menu-child-item),
:deep(.menu-child-item-2) {
  font-size: 13px;
  opacity: 0.9;
}

:deep(.menu-child-item) {
  padding-left: 16px;
}

:deep(.menu-child-item-2) {
  padding-left: 24px;
}
</style>
