<script setup lang="ts">
import useDomainManagerStore from '@/store/details/useDomainManager'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { typeOptions } from '@/options/domain_manager';
const domainConfig = useDomainManagerStore()
</script>

<template>
  <FloatingWrapper name="Type" rounded>
    <n-select
      v-model:value="domainConfig.dataConfig.type"
      clearable
      placeholder=""
      multiple
      :options="typeOptions"
    />
  </FloatingWrapper>
</template>
