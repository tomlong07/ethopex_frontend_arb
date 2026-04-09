<script setup lang="ts">
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'

import { useReportV2 } from '@/store/report/report-v2'

import { ctr_report } from '@/services/ctr_report'
import { NTooltip } from 'naive-ui'
import { ID_STORAGE_PROFILE } from '@/constants/storage'
import { ctr_payload_key } from '@/services/ctr_payload_key'

const reportStoreV2 = useReportV2(helper.truePath())()

const isSubmit = ref<boolean>(false)
const showProfileConfirm = ref<boolean>(false)
const profileName = ref<string>('')

const validateName = () => {
  if (profileName.value.trim().toLocaleLowerCase() === 'default') {
    window.message.warning('Profile name cannot be "Default"')
    return false
  }
  return true
}

const createNewProfile = async () => {
  const ok = validateName()
  if (!ok) return

  isSubmit.value = true
  const result = await ctr_report.CreateReportProfile(payload.value)

  try {
    await reportStoreV2.prepareProfileOption()
    reportStoreV2.profileSelectedId = reportStoreV2.profileOptions[1].id
    localStorage.setItem(
      ID_STORAGE_PROFILE,
      reportStoreV2.profileSelectedId.toString()
    )
  } catch (error) {
    console.error(error)
  }

  if (result?.status) window.message.success('Successfully!')

  profileName.value = ''
  isSubmit.value = false
  showProfileConfirm.value = false
}

const updateUrlWithPlk = (newPlk: string) => {
  if (!newPlk) {
    return
  }
  const url = new URL(window.location.href)
  url.searchParams.set('plk', newPlk)
  
  window.history.replaceState({}, '', url.toString())
  
  if (window.route && window.route.query) {
    window.route.query.plk = newPlk
  }
}

const updateProfile = async () => {
  const ok = validateName()
  if (!ok) return

  isSubmit.value = true

  const result = await ctr_report.UpdateReportProfile({
    ...payload.value,
    id: reportStoreV2.profileSelectedId,
  })
  const plk = await ctr_payload_key.SavePlk(reportStoreV2.payload)

  // Gán PLK lên URL
  if (plk.status) {
    updateUrlWithPlk(plk.data.key)
  }
  
  await reportStoreV2.prepareProfileOption()

  if (result?.status) window.message.success('Successfully!')

  profileName.value = ''
  isSubmit.value = false
  showProfileConfirm.value = false
}

const onChangeFilterItemNew = async (id: number) => {
  reportStoreV2.profileSelectedId = id

  localStorage.setItem(ID_STORAGE_PROFILE, id.toString())
  reportStoreV2.profileChangeHandle(id)

  reportStoreV2.updateClicked++
}

const payload = computed(() => {
  return {
    name: profileName.value,
    plk: window.route.query.plk as string,
    column_display: `${reportStoreV2.listColAccepted}`,
    group_by: `${reportStoreV2.group_by}`,
    filters: reportStoreV2.filtersStringify(),
    charts: JSON.stringify(reportStoreV2.chartV2Payload),
    path: helper.truePath(),
    settings: JSON.stringify({
      auto_sync: reportStoreV2.autoSync,
      show_chart: reportStoreV2.isShowChart,
      dateRange: reportStoreV2.dateRange,
      time_interval: reportStoreV2.time_interval,
      timezone: reportStoreV2.timezone,
      sort: reportStoreV2.sort,
    }),
  }
})

const showModalName = () => {
  showProfileConfirm.value = true
  profileName.value = reportStoreV2.selectedProfile?.name || ''

  if (profileName.value.trim().toLocaleLowerCase() === 'default')
    profileName.value = 'My Profile'
}

const deleteProfile = async (id: number) => {
  if (!id && id !== 0) return

  const profileNow = reportStoreV2.profileOptions.find(
    (profile) => profile.id == id
  )
  if (!profileNow) return

  const m = `Are you sure to delete ${profileNow.name} profile?`
  const ok = window.confirm(m)
  if (!ok) return

  const result = await ctr_report.DeleteReportProfile({
    id: id,
  })
  if (result?.status) window.message.success('Delete profile successfully!')

  await reportStoreV2.prepareProfileOption()

  try {
    reportStoreV2.profileSelectedId = reportStoreV2.profileOptions[0].id
    localStorage.setItem(
      ID_STORAGE_PROFILE,
      reportStoreV2.profileSelectedId.toString()
    )
  } catch (error) {
    console.error(error)
  }
  showProfileConfirm.value = false
}

const renderLabel = (option: any) => {
  return h('div', { class: 'flex justify-between items-center w-full' }, [
    h('span', { class: 'truncate' }, option.name),
    // eslint-disable-next-line no-constant-condition
    option.id !== -2 && window.arb.isDev() && false
      ? h(
          NTooltip,
          { trigger: 'hover' },
          {
            trigger: () =>
              h(
                'span',
                {
                  class:
                    'text-red-500 text-xs ml-2 cursor-pointer hover:underline',
                  onClick: (e: MouseEvent) => {
                    e.stopPropagation()
                    deleteProfile(option.id)
                  },
                },
                '✕'
              ),
            default: () => 'Delete this profile',
          }
        )
      : null,
  ])
}
</script>
<template>
  <div class="flex flex-col gap-2 w-56 ml-auto justify-center">
    <div class="flex items-center gap-2">
      <n-select
        v-model:value="reportStoreV2.profileSelectedId"
        class="small-select-dropdown w-36"
        :menu-props="{ class: 'small-select-dropdown' }"
        :options="reportStoreV2.profileOptions"
        :consistent-menu-width="false"
        size="small"
        label-field="name"
        value-field="id"
        :render-label="renderLabel"
        :on-update:value="onChangeFilterItemNew"
      />
      <div class="flex item-center custom-button-profile-rp">
        <n-popconfirm
          v-model:show="showProfileConfirm"
          :show-icon="false"
          :positive-text="null"
          :negative-text="null"
        >
          <template #trigger>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button
                  class="bg-gray-200 hover:bg-gray-300"
                  @click="showModalName()"
                  size="small"
                >
                  Action
                </n-button>
              </template>
              <div class="flex flex-col">
                <div class="flex">Change profile</div>
              </div>
            </n-tooltip>
          </template>

          <div class="flex flex-col gap-2">
            <div class="flex items-center text-sm gap-2">
              Profile
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon size="12" class="text-gray-500">
                    <QuestionCircleRegular />
                  </n-icon>
                </template>
                <div class="flex flex-col">
                  <div>
                    Profile can save settings for Filters, Groups, and Columns.
                  </div>
                </div>
              </n-tooltip>
            </div>

            <div class="flex gap-2">
              <n-input
                v-model:value="profileName"
                type="text"
                placeholder="Input name of Profile"
                maxlength="100"
              />
              <n-button
                type="success"
                @click="createNewProfile()"
                :disabled="isSubmit"
              >
                Create
              </n-button>

              <n-button
                type="primary"
                @click="updateProfile()"
                v-if="reportStoreV2.profileSelectedId > 0"
                :disabled="isSubmit"
              >
                Update
              </n-button>

              <n-button
                type="error"
                @click="deleteProfile(reportStoreV2.profileSelectedId)"
                v-if="reportStoreV2.profileSelectedId > 0"
                ghost
                :disabled="isSubmit"
              >
                Delete
              </n-button>
            </div>
          </div>
        </n-popconfirm>
      </div>
    </div>
  </div>
</template>
