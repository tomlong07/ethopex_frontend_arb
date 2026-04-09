<script lang="ts" setup></script>

<template>
  <div class="flex flex-col border">
    <div class="flex w-full p-4">
      <div class="flex flex-col gap-1 w-60">
        <div class="text-xs text-gray-500 font-bold"><n-skeleton text /></div>
        <n-skeleton :sharp="false" size="medium" />
      </div>

      <div class="flex flex-col gap-1 ml-auto w-24">
        <div class="text-xs text-gray-500 font-bold"><n-skeleton text /></div>
        <n-skeleton :sharp="false" size="medium" />
      </div>
    </div>

    <div class="flex w-full p-4 gap-2 border-t">
      <div class="flex flex-col gap-1 w-40">
        <div class="text-xs text-gray-500 font-bold"><n-skeleton text /></div>
        <n-skeleton :sharp="false" size="medium" />
      </div>
      <div class="flex flex-col gap-1 w-40">
        <div class="text-xs text-gray-500 font-bold"><n-skeleton text /></div>
        <n-skeleton :sharp="false" size="medium" />
      </div>

      <div class="flex flex-col gap-1 w-40">
        <div class="text-xs text-gray-500 font-bold"><n-skeleton text /></div>
        <n-skeleton :sharp="false" size="medium" />
      </div>
    </div>
  </div>
</template>
