<script setup lang="ts">
import Plus from '@/assets/icons/Plus.vue'
import Minus from '@/assets/icons/Minus.vue'
import addsenseAcountStore from '@/store/details/useAdsenseStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const dataConfig = addsenseAcountStore()
</script>

<template>
  <n-card title="Layout - Native to Search">
    <div class="flex">
      <div class="w-full flex flex-col">
        <n-input-group
          v-for="(miniData, ind) in dataConfig.currentN2S"
          :key="ind"
          class="pb-8 pt-2 gap-2"
        >
          <div class="flex items-center" style="width: 6%">
            <n-switch
              v-model:value="miniData.status"
              checked-value="on"
              :unchecked-value="'off'"
              size="large"
            />
          </div>
          <FloatingWrapper name="Layout N2S" rounded>
            <n-select
              v-model:value="miniData.layout"
              filterable
              value-field="value"
              label-field="name"
              :disabled="dataConfig.isDisable"
              placeholder=""
              :options="dataConfig.layoutOptions"
            />
          </FloatingWrapper>

          <FloatingWrapper name="Style ID" rounded>
            <n-input
              v-model:value="miniData.style_id"
              :loading="dataConfig.isLoading"
              :disabled="dataConfig.isLoading || !dataConfig.isDisable"
              placeholder="Style ID"
            />
          </FloatingWrapper>

          <n-button-group class="mt-1">
            <n-button
              ghost
              class="dynamic-button"
              :loading="dataConfig.isLoading"
              :disabled="
                (ind === 0 && dataConfig.currentN2S.length === 1) ||
                dataConfig.isDisable
              "
              @click="dataConfig.removeN2SItem(ind)"
            >
              <template #icon>
                <n-icon size="12" :component="Minus" />
              </template>
            </n-button>
            <n-button
              ghost
              class="dynamic-button"
              :loading="dataConfig.isLoading"
              :disabled="dataConfig.isDisable"
              @click="dataConfig.addN2SItem()"
            >
              <template #icon>
                <n-icon size="12" :component="Plus"></n-icon>
              </template>
            </n-button>
          </n-button-group>
        </n-input-group>
      </div>
    </div>
  </n-card>
</template>
