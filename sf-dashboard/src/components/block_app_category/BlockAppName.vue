<script lang="ts" setup>
import { useBlockAppCategory } from '@/store/details/blockAppCategory'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue';
const blockAppCategoryStore = useBlockAppCategory()

const name = `Name`
</script>

<template>
  <FloatingWrapper
    :name="name"
    :required="true"
    :error="blockAppCategoryStore.showErr['name']"
  >
      <n-input
        maxlength="500"
        v-model:value="blockAppCategoryStore.blockAppCategoryData.name"
      ></n-input>
  </FloatingWrapper>
</template>
