<script setup lang="ts">
import PermissionConfigDetail from '@/store/details/PermissionConfigDetail'
import { storeToRefs } from 'pinia'
const usePermissionConfigDetail = PermissionConfigDetail()
const { filterPermissionInfo, filterType } = storeToRefs(
  usePermissionConfigDetail
)

const permissionNameNow = (key: string) => {
  if (usePermissionConfigDetail.permissionName[key]) {
    return usePermissionConfigDetail.permissionName[key]
  }
  return helper.makeNameUpperCase(key)
}

const scrollToId = async (keyPermission: string) => {
  await nextTick()
  const el = document.getElementById(`section-${keyPermission}`)
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const options = [
  { label: 'All', value: 'all' },
  { label: 'Selected', value: 'selected' },
  { label: 'Unselected', value: 'unselected' },
]
</script>
<template>
  <div
    class="sticky top-1 bg-white max-h-[650px] overflow-y-auto scroll-thin-custom"
  >
    <div class="px-3 pt-3 pb-1 sticky z-10 top-0 bg-white">
      <n-select
        v-model:value="filterType"
        :options="options"
        placeholder="All"
      />
    </div>
    <div class="rounded-md p-3 h-fit w-64">
      <div
        v-for="(_, keyPermission) in filterPermissionInfo"
        :key="keyPermission"
        class="mb-3"
      >
        <span
          class="cursor-pointer group-hover:font-semibold group-hover:duration-150 shrink-0 truncate"
          @click="scrollToId(`${keyPermission}`)"
          >{{ permissionNameNow(String(keyPermission)) }}</span
        >
      </div>
    </div>
  </div>
</template>
