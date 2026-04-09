<script setup lang="ts">
import { useDraftConfirm } from '@/composables/useDraftConfirm'
import useResponsive from '@/composables/useResponsive'
import ctr_notify_system from '@/services/ctr_notify_system'
import useNotifySystem from '@/store/details/useNotifySystem'
import useGeneralStore from '@/store/useGeneralStore'
import { useRoute, useRouter } from 'vue-router'
import useModalStore from '@/store/useModalStore'

const router = useRouter()
const route = useRoute()
const notifySystemStore = useNotifySystem()
const generalStore = useGeneralStore()
const { isResponsive } = useResponsive()
const modalStore = useModalStore()

// !! State
const dataPermission = ref<any[]>([])
const visibleItems = ref<Record<number, boolean>>({})

const levelBorderColor: Record<string, string> = {
  error: 'border-red-500',
  warning: 'border-yellow-500',
  info: 'border-blue-500',
}

// !! Computed
const pageOptions = computed(() => notifySystemStore.pageOptions)

const layoutClass = computed(() => {
  const path = route.path
  const layoutMap = [
    {
      prefix: '/landing_page/',
      cls: {
        mobile: 'ml-[90px] w-[calc(100%-120px)]',
        desktop: 'ml-[290px] w-[calc(100%-300px)]',
      },
    },
    {
      prefix: '/campaign/',
      cls: {
        mobile: 'ml-[90px] w-[calc(100%-120px)]',
        desktop: 'ml-[350px] w-[calc(100%-360px)]',
      },
    },
  ]

  const matched = layoutMap.find((i) => path.startsWith(i.prefix))
  return matched ? matched.cls[isResponsive.value ? 'mobile' : 'desktop'] : ''
})

// !! Func
const fetchPermission = async (fullPath: string) => {
  dataPermission.value = []
  if (route.meta?.layout === 'notfound') return

  if (!fullPath) return

  const path = fullPath.split('?')[0]

  const isValidPath = pageOptions.value.some((p: any) => {
    if (!p.url) return false
    return path.startsWith(p.url.replace(/:id$/, ''))
  })

  if (!isValidPath) return

  try {
    const result = await ctr_notify_system.GetPermission({ path })
    if (result?.status) {
      dataPermission.value = result?.data || []
      visibleItems.value = {}
      dataPermission.value.forEach((_, idx) => (visibleItems.value[idx] = true))
    }
  } catch (err) {
    console.error('Error fetching permission:', err)
  }
}

// !! Lifecycle
onMounted(() => {
  notifySystemStore.setPageOptions(generalStore.menuRouter || [])
})

// !! Watch route change
watch(
  () => router.currentRoute.value.fullPath,
  (newPath) => fetchPermission(newPath),
  { immediate: true }
)
</script>

<template>
  <div v-for="(item, index) in dataPermission" :key="index">
    <div
      v-show="
        visibleItems[index] &&
        !useDraftConfirm.showModal.value &&
        !modalStore.showModal
      "
      style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px"
      :class="[
        'bg-white mt-4 ml-2 mr-2 border-l-4 px-4 py-2 mb-[5px] flex justify-between items-center z-[1000] rounded-md',
        levelBorderColor[item.level] || 'border-gray-300',
        layoutClass,
      ]"
    >
      <span class="text-gray-700 font-medium" v-html="item.message"></span>

      <button
        @click="visibleItems[index] = false"
        class="mt-[-5px] ml-4 text-gray-400 hover:text-gray-700 text-2xl leading-none font-bold focus:outline-none flex items-center justify-center"
        title="Close"
      >
        &times;
      </button>
    </div>
  </div>
</template>
