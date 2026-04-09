<script setup lang="ts">
import addsenseAcountStore from '@/store/details/useAdsenseStore'
import { ONOFF } from '@/enum/campaign'
import Checkmark from '@/assets/icons/Checkmark.vue'
import Close from '@/assets/icons/Close.vue'
import TrashAltRegular from '@/assets/icons/TrashAltRegular.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const dataConfig = addsenseAcountStore()

const addPosition = (device: 'mobile' | 'desktop') => {
  dataConfig.adsenseAccountConfig.position![device].push({
    status: ONOFF.ON,
    top: 1,
    bottom: 0,
  })
}

const removePosition = (device: 'mobile' | 'desktop', index: number) => {
  dataConfig.adsenseAccountConfig.position![device].splice(index, 1)
}
</script>

<template>
  <n-card title="Position"
    ><div class="grid grid-cols-2 gap-6">
      <!-- MOBILE -->
      <div>
        <h3 class="font-bold mb-2">Mobile</h3>
        <n-button size="small" @click="addPosition('mobile')">+ Add</n-button>
        <div
          v-for="(item, index) in dataConfig.adsenseAccountConfig.position
            ?.mobile"
          :key="'mobile-' + index"
          class="border rounded-lg p-3 mt-3 flex gap-3 items-center"
        >
          <n-switch
            v-model:value="item.status"
            checked-value="on"
            unchecked-value="off"
          >
            <template #checked-icon>
              <n-icon :component="Checkmark" color="#121212" />
            </template>
            <template #unchecked-icon> <n-icon :component="Close" /> </template
          ></n-switch>

          <FloatingWrapper name="Top" rounded>
            <n-input-number
              v-model:value="item.top"
              placeholder="Top"
              class="w-1/2"
              min="1"
              max="2"
          /></FloatingWrapper>

          <FloatingWrapper name="Bottom" rounded>
            <n-input-number
              v-model:value="item.bottom"
              placeholder="Bottom"
              class="w-1/2"
              min="0"
              max="2"
          /></FloatingWrapper>

          <n-button
            type="error"
            size="small"
            @click="removePosition('mobile', index)"
          >
            <n-icon :component="TrashAltRegular" size="14" />
          </n-button>
        </div>
      </div>

      <!-- DESKTOP -->
      <div>
        <h3 class="font-bold mb-2">Desktop</h3>
        <n-button size="small" @click="addPosition('desktop')">+ Add</n-button>
        <div
          v-for="(item, index) in dataConfig.adsenseAccountConfig.position
            ?.desktop"
          :key="'desktop-' + index"
          class="border rounded-lg p-3 mt-3 flex gap-3 items-center"
        >
          <n-switch
            v-model:value="item.status"
            checked-value="on"
            unchecked-value="off"
          >
            <template #checked-icon>
              <n-icon :component="Checkmark" color="#121212" />
            </template>
            <template #unchecked-icon> <n-icon :component="Close" /> </template
          ></n-switch>
          <FloatingWrapper name="Top" rounded>
            <n-input-number
              v-model:value="item.top"
              placeholder="Top"
              class="w-1/2"
              min="1"
              max="2"
          /></FloatingWrapper>
          <FloatingWrapper name="Bottom" rounded>
            <n-input-number
              v-model:value="item.bottom"
              placeholder="Bottom"
              class="w-1/2"
              min="0"
              max="2"
          /></FloatingWrapper>
          <n-button
            type="error"
            size="small"
            @click="removePosition('desktop', index)"
          >
            <n-icon :component="TrashAltRegular" size="14" />
          </n-button>
        </div>
      </div></div
  ></n-card>
</template>
