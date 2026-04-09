<script setup lang="ts">
import { useGoogleExcludeList } from '@/store/details/googleExcludeList';
import FloatingWrapper from '@/components/common/FloatingWrapper.vue';

const googleExcludeListStore = useGoogleExcludeList()
const name = `Description`
</script>
<template>
    <FloatingWrapper
        :name="name"
    >
        <n-input
          placeholder="Please Input Description"
          maxlength="500"
          v-model:value="
            googleExcludeListStore.googleExcludeListData.description
          "
        ></n-input>
    </FloatingWrapper>
</template>