<template>
  <div class="flex items-center my-4">
    <FloatingWrapper
      :name="name"
    >
        <n-select
          v-model:value="dataConfig.googleTargetingConfig.type"
          placeholder="Select"
          filterable
          :options="typeOptions"
        />
    </FloatingWrapper>
  </div>
</template>
<script setup lang="ts">
import useGgTargetStore from '@/store/details/useGgTargetStore'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { typeOptions } from '@/options/gg_targeting'

const dataConfig = useGgTargetStore()


const name = `Type`
</script>
