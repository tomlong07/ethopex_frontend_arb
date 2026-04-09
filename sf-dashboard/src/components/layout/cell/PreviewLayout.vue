<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import NewspaperOutline from '@/assets/icons/NewspaperOutline.vue'
import SearchOutline from '@/assets/icons/SearchOutline.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const onPreviewContent = () => {
  window.open(
    `https://cumaps.net/carb/${props.params.data.id}/m_onlinesearching-p142.webm`,
    '_blank'
  )
}
const onPreviewSearch = () => {
  window.open(
    `https://aff-ads.cumaps.net/search?cfgKey=cumaps.net&layout=${props.params.data.id}&network=&styleID=2793368595&styleTrack=Desktop_v2_1&pixel_id=&channel=&uid=&_clkcie=d7975719-a01e-47fd-85ae-0e45ea7d81b0&ttu=5d4f6bb7-a597-4655-8cb9-77ac2f303552&query=React&rsToken=ChMIh83C84Gw_gIVFqVWAR3nMApoElwBJ3TYYRY4LZ_lkk-_oiZzlxsVwiCMkRRoi7JDBr6ilgzOkaJsl8xcaqoCsa-sMOkiunGT3hKSdOlBdWjZa-GKKQpSqVkg-ydH_j8TiRhu_3Lb4jFJpe5zl0G8mQ&nb=0&rurl=https%3A%2F%2Faff-ads.cumaps.net%2Fsearch%3FcfgKey%3Dcumaps.net%26layout%3D1%26network%3D%26styleID%3D2793368595%26styleTrack%3DDesktop_v2_1%26pixel_id%3D%26channel%3D%26uid%3D%26_clkcie%3Dd7975719-a01e-47fd-85ae-0e45ea7d81b0%26ttu%3D5d4f6bb7-a597-4655-8cb9-77ac2f303552%26query%3Dm%25C3%25A1y%2Bt%25C3%25ADnh%26rsToken%3DChMIh83C84Gw_gIVFqVWAR3nMApoElsBJ3TYYXn59MRlOYvljLFdqec23uvS5ck9wEIzVfw0Bt4-e9N2evjhHdVBvxBlOTFg-4cqNVdF8Eem8dJLqXftGL_Npy1caS0szJXTphSdOWB7BAgqS108nlCq%26nb%3D0%26rurl%3Dhttps%253A%252F%252Fwww.google.com%252F%26nm%3D9%26nx%3D106%26ny%3D26%26is%3D631x319%26clkt%3D57%26page%3D10&nm=9&nx=173&ny=10&is=631x319&clkt=59&page=1`,
    '_blank'
  )
}
</script>
<template>
  <div class="flex w-full h-full items-center">
    <n-icon
      size="35"
      class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
      @click="onPreviewContent"
    >
      <n-tooltip trigger="hover">
        <template #trigger>
          <NewspaperOutline />
        </template>
        Preview Layout Content
      </n-tooltip>
    </n-icon>
    <n-icon
      size="35"
      class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
      @click="onPreviewSearch"
    >
      <n-tooltip trigger="hover">
        <template #trigger>
          <SearchOutline />
        </template>
        Preview Layout Search
      </n-tooltip>
    </n-icon>
  </div>
</template>
