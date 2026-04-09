<script setup lang="ts">
import PermissionConfigDetail from '@/store/details/PermissionConfigDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { storeToRefs } from 'pinia'
import PermissionNav from './PermissionNav.vue'
const usePermissionConfigDetail = PermissionConfigDetail()
const { filterPermissionInfo, permissionStatus } = storeToRefs(
  usePermissionConfigDetail
)
const permissionNameNow = (key: string) => {
  if (usePermissionConfigDetail.permissionName[key]) {
    return usePermissionConfigDetail.permissionName[key]
  }
  return helper.makeNameUpperCase(key)
}
</script>
<template>
  <div class="flex gap-3">
    <div class="shirk-0">
      <PermissionNav />
    </div>
    <div class="flex-1">
      <div class="overflow-y-auto max-h-[650px] scroll-thin-custom">
        <n-card>
          <div
            v-for="(miniPermission, keyPermission) in filterPermissionInfo"
            :key="keyPermission"
          >
            <div class="flex mb-4" :id="`section-${keyPermission}`">
              <FloatingWrapper
                :name="permissionNameNow(String(keyPermission))"
                rounded
              >
                <n-card>
                  <div class="w-3/4 flex flex-col gap-2">
                    <div v-for="(value, key) in miniPermission" :key="key">
                      <n-checkbox
                        v-model:checked="
                          permissionStatus[String(keyPermission)][value.key]
                        "
                      >
                        {{ value.value }}
                      </n-checkbox>
                    </div>
                  </div>
                </n-card>
              </FloatingWrapper>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>
