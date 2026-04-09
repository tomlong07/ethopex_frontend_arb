<template>
  <div class="flex items-center my-4">
    <FloatingWrapper
      :name="name"
    >
        <n-select
          v-model:value="dataConfig.googleTargetingConfig.data_source"
          placeholder=""
          filterable
          :options="dataSourceOptions"
          @update:value="onChangeDataSource"
        />
    </FloatingWrapper>
  </div>
</template>
<script setup lang="ts">
import useGgTargetStore from '@/store/details/useGgTargetStore'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { dataSourceOptions } from '@/options/gg_targeting'

const dataConfig = useGgTargetStore()
const name = `Data Source`

const onChangeDataSource = () => {
  if (dataConfig.googleTargetingConfig.data_source !== '') {
    dataConfig.googleTargetingConfig.domains = []
    dataConfig.googleTargetingConfig.sellers = ''
  }
}
</script>