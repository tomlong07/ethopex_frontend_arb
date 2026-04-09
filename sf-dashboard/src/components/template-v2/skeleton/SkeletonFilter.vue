<script setup lang="ts"></script>
<template>
  <div class="filter flex bg-gray-200">
    <div class="flex flex-wrap pb-1 w-full">
      <!-- custom tag -->
      <div
        class="flex flex-none form-condition-wrapper mt-1 mr-2 items-center md:w-1/6 sm:w-1/5 max-w-xs"
      >
        <div class="w-full">
          <div class="pb-1">
            <n-skeleton
              class="h-5 ml-4"
              text
              :repeat="1"
              height="15px"
              width="30%"
            />
          </div>
          <div class="flex items-center">
            <n-skeleton
              class="flex flex-1 h-5 ml-4"
              text
              :repeat="1"
              height="28px"
              width="40%"
            />
          </div>
        </div>
      </div>
      <div
        class="flex flex-none form-condition-wrapper mt-1 mr-2 items-center md:w-1/6 sm:w-1/5 max-w-xs"
      >
        <div class="w-full">
          <div class="pb-1">
            <n-skeleton
              class="h-5"
              text
              :repeat="1"
              height="15px"
              width="50%"
            />
          </div>
          <div class="flex items-center">
            <n-skeleton
              class="flex flex-1 h-5"
              text
              :repeat="1"
              height="28px"
              width="55%"
            />
          </div>
        </div>
      </div>
      <div
        class="flex flex-none form-condition-wrapper mt-1 mr-2 items-center md:w-1/6 sm:w-1/5 max-w-xs"
      >
        <div class="w-full">
          <div class="pb-1">
            <n-skeleton
              class="h-5"
              text
              :repeat="1"
              height="15px"
              width="50%"
            />
          </div>
          <div class="flex items-center">
            <n-skeleton
              class="flex flex-1 h-5"
              text
              :repeat="1"
              height="28px"
              width="55%"
            />
          </div>
        </div>
      </div>
      <div
        class="flex flex-none form-condition-wrapper mt-1 mr-2 items-center md:w-1/6 sm:w-1/5 max-w-xs"
      >
        <div class="w-full">
          <div class="pb-1">
            <n-skeleton
              class="h-5"
              text
              :repeat="1"
              height="15px"
              width="30%"
            />
          </div>
          <div class="flex items-center">
            <n-skeleton
              class="flex flex-1 h-5"
              text
              :repeat="1"
              height="28px"
              width="55%"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center">
      <n-skeleton class="h-4 mr-2" :width="150" :sharp="false" size="medium" />
      <n-skeleton class="h-4 mr-2" :width="65" :sharp="false" size="medium" />
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
