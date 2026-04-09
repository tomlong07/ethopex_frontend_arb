<script setup lang="ts">
const tabNow = ref('default')
</script>

<template>
  <div class="wrapper flex flex-col px-3 flex-1">
    <div class="h-screen flex flex-col bg-white my-12 flex-1 gap-4">
      <div class="flex justify-center flex-1">
        <div
          class="grid gap-4 grid-cols-1 p-5 mt-5 w-full max-w-4xl bg-base rounded-lg border"
        >
          <div class="flex flex-col gap-4">
            <n-tabs
              v-model:value="tabNow"
              type="line"
              class="custom-text-layout pb-2"
            >
              <n-tab-pane name="default" tab="Default">
                <Test2 />
              </n-tab-pane>

              <n-tab-pane name="configs" tab="Rule Taxonomy">
                <AITestConfigs />
              </n-tab-pane>
            </n-tabs>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
