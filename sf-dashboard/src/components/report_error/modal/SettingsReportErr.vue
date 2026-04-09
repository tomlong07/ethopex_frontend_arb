<template>
  <n-modal
    v-model:show="reportErrorStore.showSettingModal"
    preset="dialog"
    title="Report Settings"
    :closable="false"
    type="success"
    :show-icon="false"
    style="width: 1000px"
    negative-text="Close"
  >
    <div class="flex gap-4 flex-col">
      <n-table :single-line="false">
        <thead>
          <tr>
            <th class="w-1/5">Name</th>
            <th class="w-2/5">Setting</th>
            <th class="w-2/5">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="setting in settings" :key="setting.key">
            <td>{{ setting.name }}</td>
            <td>
              <n-switch
                v-if="setting.type === 'switch'"
                :value="getSettingValue(setting.key)"
                @update:value="(value: boolean) => updateSetting(setting.key, value)"
              />
              <n-select
                v-else-if="setting.type === 'select'"
                class="min-w-40 w-full"
                :placeholder="setting.placeholder"
                :options="setting.options"
                :value="getSettingValue(setting.key)"
                :consistent-menu-width="setting.consistentMenuWidth"
                @update:value="(value:any) => updateSetting(setting.key, value)"
              />
            </td>
            <td>{{ setting.description }}</td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { useReportError } from '@/store/report-error'
import { ReportErrSettings } from '@/types/components/report-error'
const reportErrorStore = useReportError()

const LOCAL_STORAGE_KEY = 'reportSettings'

const settings = [
  {
    key: 'showTable',
    name: 'Display Table',
    description: 'Enable or disable table display.',
    type: 'switch',
  },
  {
    key: 'showChart',
    name: 'Display Chart',
    description: 'Enable or disable chart display.',
    type: 'switch',
  },
  {
    key: 'widthOfTable',
    name: 'Width Of Table',
    description: 'Change the width and display of the table.',
    placeholder: 'Please Select',
    options: [
      { label: '25%', value: 25 },
      { label: '33%', value: 33 },
      { label: '50%', value: 50 },
      { label: '100%', value: 100 },
    ],
    consistentMenuWidth: false,
    type: 'select',
  },
]

const getSettingValue = (key: string) => {
  return (reportErrorStore.reportSettingErr as any)[key]
}

const updateSetting = (key: string, value: any) => {
  ;(reportErrorStore.reportSettingErr as any)[key] = value
  saveSettingsToLocalStorage()
}

const saveSettingsToLocalStorage = () => {
  try {
    const settingsToSave = reportErrorStore.reportSettingErr
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settingsToSave))
  } catch (error) {
    console.warn('Failed to save settings:', error)
  }
}

const loadSettingsFromLocalStorage = () => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)

      reportErrorStore.reportSettingErr = new ReportErrSettings(parsed)
    }
  } catch (error) {
    console.warn('Failed to load settings:', error)
  }
}

onMounted(() => {
  loadSettingsFromLocalStorage()
})
</script>
