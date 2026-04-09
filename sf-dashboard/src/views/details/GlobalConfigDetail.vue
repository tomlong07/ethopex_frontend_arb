<script setup lang="ts">
import { useGlobalConfig } from '@/store/details/globalConfig'
import { usePermissionConfigs } from '@/composables/usePermissionConfigs'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'

import { ctr_permission_settings } from '@/services/ctr_permission_settings'
import TabInfo from '@/components/common/TabInfo.vue'
import AutoEnable from '@/components/global_config/AutoEnable.vue'
import PushToPub from '@/components/global_config/PushToPub.vue'
import Publishers from '@/components/global_config/Publishers.vue'
import TargetGeoBy from '@/components/global_config/TargetGeoBy.vue'

const globalConfigStore = useGlobalConfig()
const { tabInfo, getPermissionConfigs } = usePermissionConfigs()

const getPermissionAsyncConfig = async () => {
  if (!window.route?.meta?.url) return
  const result = await ctr_permission_settings.PermissionAsync(
    window.route?.meta?.url as string
  )

  globalConfigStore.setPermissionAsyncConfigs(result.data || {})
}

onMounted(async () => {
  globalConfigStore.initData()
  getPermissionAsyncConfig()

  if (window.route?.meta?.url) {
    await getPermissionConfigs(window.route?.meta?.url as string)
  }
})
const thisRoute = computed(() => window.route.path)
const globalTabData = computed(() => tabInfo.value || [])
</script>

<template>
  <div class="wrapper flex flex-col px-3 flex-1">
    <div class="flex justify-center mt-2 items-center">
      <div class="w-full 5xl:w-1/2">
        <TabInfo :tabData="globalTabData" :activeTab="thisRoute" />
        <div class="flex justify-center items-start mt-6">
          <div class="w-full max-w-[923px]">
            <div v-if="globalConfigStore.isLoading">
              <Skeleton />
            </div>

            <n-grid x-gap="14" y-gap="14" cols="1" v-else>
              <n-gi class="flex flex-col gap-4">
                <n-card class="card-flex-gap-2 bg-base rounded-none">
                  <div class="flex flex-col mt-3 bg-base">
                    <n-card title="Global Config" class="card-flex-gap-4">
                      <AutoEnable />
                      <PushToPub
                        v-if="
                          globalConfigStore.permissionAsyncConfigs.pushToPub
                        "
                      />
                      <Publishers />
                      <TargetGeoBy />
                    </n-card>
                  </div>
                </n-card>
              </n-gi>
            </n-grid>
            <GlobalConfigSubmit />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
:deep(.n-card > .n-card__content) {
  padding: 0px 10px 15px 16px !important;
}

:deep(.card-flex-gap-4 .n-card__content) {
  padding: 24px !important;
}
</style>
