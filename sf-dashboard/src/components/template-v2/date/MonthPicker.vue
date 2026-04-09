<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { useTemplateV2 } from '@/store/templateV2Store'

const templateV2Store = useTemplateV2(helper.truePath())()
</script>

<template>
  <div
    class="flex flex-row justify-start items-center mr-4 w-32 month-report-class"
  >
    <VueDatePicker
      v-model="templateV2Store.filterList.month"
      format="yyyy/MM"
      model-type="yyyy-MM-dd"
      :enable-time-picker="false"
      month-picker
      :clearable="false"
      size="small"
    >
    </VueDatePicker>
  </div>
</template>
