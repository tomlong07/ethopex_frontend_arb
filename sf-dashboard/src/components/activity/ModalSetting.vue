<script setup lang="ts">
import { useModalSettingStore } from '@/store/activity/modalSetting'

// !! State
const modalSettinglStore = useModalSettingStore()
</script>

<template>
  <n-modal v-model:show="modalSettinglStore.showModal">
    <n-card
      style="height: 400px; width: 800px"
      size="huge"
      title="Settings"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <n-card
        class="flex-gap-4 overflow-y-auto"
        :style="{ height: 220 + 'px' }"
      >
        <n-table :single-line="false">
          <thead>
            <tr>
              <th>Setting</th>
              <th>Status</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Datetime interface</td>
              <td>
                <n-button
                  v-for="(item, index) in modalSettinglStore.languageOptions"
                  :key="item.value as string + index"
                  @click="
                    modalSettinglStore.settingsNow.language =
                      item.value as string
                  "
                  :type="
                    modalSettinglStore.settingsNow.language === item.value
                      ? 'success'
                      : 'default'
                  "
                >
                  {{ item.label }}</n-button
                >
                 
              </td>
              <td>The language used to display date and time in logs</td>
            </tr>
            <tr>
              <td>Mode</td>
              <td>
                <n-button
                  v-for="(item, index) in modalSettinglStore.modeOptions"
                  :key="item.value as string + index"
                  @click="
                    modalSettinglStore.settingsNow.mode = item.value as string
                  "
                  :type="
                    modalSettinglStore.settingsNow.mode === item.value
                      ? 'success'
                      : 'default'
                  "
                >
                  {{ item.label }}</n-button
                >
              </td>
              <td>Log view mode</td>
            </tr>
          </tbody>
        </n-table>
      </n-card>

      <template #footer>
        <div class="flex justify-end">
          <n-button
            class="button-apply"
            color="#f43f5e"
            @click="modalSettinglStore.submitForm()"
          >
            Apply
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>
