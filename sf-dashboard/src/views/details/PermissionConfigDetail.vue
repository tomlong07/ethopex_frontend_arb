<script setup lang="ts">
import BackPage from '@/components/common/BackPage.vue'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'
import PermissionConfigDetail from '@/store/details/PermissionConfigDetail'
import { ctr_roles } from '@/services/ctr_roles'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import Permission from '@/components/permission_config_detail/Permission.vue'
import AccountDemand from '@/components/permission_config_detail/PermissionAccountDemand.vue'
import AccountTraffic from '@/components/permission_config_detail/PermissionAccountTraffic.vue'
import DemandSource from '@/components/permission_config_detail/PermissionDemandSource.vue'
import Description from '@/components/permission_config_detail/PermissionDescription.vue'
import Name from '@/components/permission_config_detail/PermissionName.vue'
import RoleInheritance from '@/components/permission_config_detail/PermissionRoleInheritance.vue'
import TrafficSource from '@/components/permission_config_detail/PermissionTrafficSource.vue'

const usePermissionConfigDetail = PermissionConfigDetail()
const id = Number(window.route.params.id || 0)
const duplicateId = Number(window.route.query.duplicate) || 0

const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const isAddPage = computed<boolean>(() => id === 0)
const isEditPage = computed<boolean>(() => !isAddPage.value)
const isLoading = ref<boolean>(false)
const isSubmitBtnLoading = ref<boolean>(false)

const CONFIG_DETAIL_TAB = 'config-detail'
const PERMISSION_TAB = 'permission'

const activeTab = ref<string>(CONFIG_DETAIL_TAB)

const initTabFromUrl = () => {
  const tabFromUrl = window.route.query.tab as string
  if (tabFromUrl === PERMISSION_TAB || tabFromUrl === CONFIG_DETAIL_TAB) {
    activeTab.value = tabFromUrl
  } else {
    activeTab.value = CONFIG_DETAIL_TAB
  }
}

// Cập nhật URL khi đổi tab
const handleTabChange = (tabName: string) => {
  activeTab.value = tabName
  window.router.push({
    query: {
      ...window.route.query,
      tab: tabName,
    },
  })
}

const preCreateData = ref<any>()

if (isAddPage.value) {
  usePermissionConfigDetail.clearData()
}

const preDataInit = async () => {
  const result = await ctr_roles.PreCreate()
  preCreateData.value = result?.data || {}
}

const getById = async () => {
  const result = await ctr_roles.Get(id)
  usePermissionConfigDetail.permission = result?.data || {}
}

const duplicateById = async (id: number) => {
  const result = await ctr_roles.Duplicate(id)
  usePermissionConfigDetail.permission = result?.data || {}
  usePermissionConfigDetail.permission.name += ' - Copy'
}

const getPermissionName = async () => {
  const result = await ctr_roles.GetPermissionName()
  usePermissionConfigDetail.permissionName = result?.data || {}
}

const syncOptions = () => {
  usePermissionConfigDetail.trafficOptions =
    preCreateData.value?.traffic_source || []
  usePermissionConfigDetail.demandOptions =
    preCreateData.value?.demand_source || []
  usePermissionConfigDetail.trafficAccountOptions =
    preCreateData.value?.account_traffic || []
  usePermissionConfigDetail.demandAccountOptions =
    preCreateData.value?.account_demand || []
  usePermissionConfigDetail.roleInheritanceOptions =
    preCreateData.value?.role_inheritance || []
}

onMounted(async () => {
  isLoading.value = true
  usePermissionConfigDetail.filterType = 'all'
  // Khởi tạo tab từ URL
  initTabFromUrl()

  let ajax = [preDataInit(), getPermissionName()]

  if (isAddPage.value && duplicateId) {
    ajax.push(duplicateById(duplicateId))
  }

  if (isEditPage.value) {
    ajax.push(getById())
  }

  await Promise.all(ajax)

  //Tạo permissionStatus default
  usePermissionConfigDetail.permissionInfo =
    preCreateData.value?.permission || {}
  for (const key in usePermissionConfigDetail.permissionInfo) {
    if (
      Object.prototype.hasOwnProperty.call(
        usePermissionConfigDetail.permissionInfo,
        key
      )
    ) {
      const element = usePermissionConfigDetail.permissionInfo[key]
      usePermissionConfigDetail.permissionStatus[key] = {}

      element.forEach((e) => {
        usePermissionConfigDetail.permissionStatus[key][e.key] = false
      })
    }
  }

  //Đồng bộ permissionStatus theo edit page
  if (isEditPage.value || (isAddPage.value && duplicateId)) {
    const oldPer =
      (usePermissionConfigDetail.permission.permission as Record<
        string,
        string[]
      >) || {}
    // const oldPer = usePermissionConfigDetail.permission.permission || {};
    for (const key in oldPer) {
      if (Object.prototype.hasOwnProperty.call(oldPer, key)) {
        if (oldPer[key] && Array.isArray(oldPer[key]) && oldPer[key].length) {
          if (usePermissionConfigDetail.permissionStatus[key]) {
            oldPer[key].forEach((element) => {
              usePermissionConfigDetail.permissionStatus[key][element] = true
            })
          }
        }
      }
    }
  }

  syncOptions()

  isLoading.value = false
})

const submitForm = async () => {
  isSubmitBtnLoading.value = true

  // submit form
  if (isAddPage.value) {
    const result = await ctr_roles.Create(payload.value)
    if (result?.status) {
      window.message.success('Create permission success')
      if (feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value.page_list })
      }
    }
  }

  if (isEditPage.value) {
    const result = await ctr_roles.Update(id, payload.value)
    if (result?.status) {
      window.message.success('Edit permission success')
    }
  }

  isSubmitBtnLoading.value = false
}

const payload = computed(() => {
  const pl = helper.clone(usePermissionConfigDetail.permission)

  let newPermission: { [key: string]: string[] } = {}

  for (const key in usePermissionConfigDetail.permissionStatus) {
    if (
      Object.prototype.hasOwnProperty.call(
        usePermissionConfigDetail.permissionStatus,
        key
      )
    ) {
      const element = usePermissionConfigDetail.permissionStatus[key]
      newPermission[key] = []
      for (const key2 in element) {
        if (Object.prototype.hasOwnProperty.call(element, key2)) {
          const element2 = element[key2]
          if (element2) {
            newPermission[key].push(key2)
          }
        }
      }
    }
  }

  pl.permission = newPermission

  return pl
})
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="h-screen flex flex-col bg-base flex-1 gap-4 mt-3">
      <BackPage
        :url="feSettings?.page_list"
        :name="'Role'"
        v-if="feSettings?.page_list"
      />
      <Skeleton v-if="isLoading" />

      <div
        v-else
        class="flex flex-col w-full lg:w-2/3 bg-base gap-4 mx-auto max-w-[1300px]"
      >
        <n-tabs
          type="line"
          animated
          :value="activeTab"
          @update:value="handleTabChange"
        >
          <n-tab-pane :name="CONFIG_DETAIL_TAB" tab="Config Detail">
            <n-card title="Config Detail">
              <div class="space-y-4">
                <Name />
                <Description />
                <n-divider />
                <TrafficSource />
                <AccountTraffic />
                <n-divider />
                <DemandSource />
                <AccountDemand />
                <n-divider />
                <RoleInheritance />
              </div>
            </n-card>
          </n-tab-pane>

          <n-tab-pane :name="PERMISSION_TAB" tab="Permissions">
            <Permission />
          </n-tab-pane>
        </n-tabs>

        <div class="flex flex-row-reverse sticky bottom-0 p-2">
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :loading="isSubmitBtnLoading"
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>
