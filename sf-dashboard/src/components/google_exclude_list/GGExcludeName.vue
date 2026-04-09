<script setup lang="ts">
import { useGoogleExcludeList } from '@/store/details/googleExcludeList';
import FloatingWrapper from '@/components/common/FloatingWrapper.vue';

const googleExcludeListStore = useGoogleExcludeList()

</script> 
<template>
    <FloatingWrapper
        :name="`Name`"
    >
        <n-input
          placeholder="Please Input Name"
          maxlength="500"
          v-model:value="googleExcludeListStore.googleExcludeListData.name"
        ></n-input>
    </FloatingWrapper>
</template>
