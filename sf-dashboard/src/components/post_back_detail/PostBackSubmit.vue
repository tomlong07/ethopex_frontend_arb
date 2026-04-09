<script setup lang="ts">
import usePostBack from '@/store/details/usePostBack'

const postBackStore = usePostBack()
</script>

<template>
  <div class="flex justify-end mt-4 gap-4">
    <n-button
      type="error"
      @click="postBackStore.handleSubmit"
      :loading="postBackStore.isSubmitLoading"
    >
      Submit
    </n-button>
  </div>
</template>
