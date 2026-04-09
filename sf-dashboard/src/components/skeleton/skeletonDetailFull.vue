<script setup lang="ts"></script>
<template>
  <div class="flex mt-6">
    <n-card>
      <div class="title-card">
        <n-skeleton :width="120" round size="medium" />
      </div>
      <div class="flex my-4">
        <div class="w-1/6 font-bold">
          <n-skeleton text :repeat="1" :width="120" round />
        </div>
        <div class="w-5/6 flex flex-col">
          <n-skeleton text :repeat="1" round />
        </div>
      </div>

      <div class="flex my-4">
        <div class="w-1/6 font-bold">
          <n-skeleton text :repeat="1" :width="120" round />
        </div>
        <div class="w-5/6 flex flex-col">
          <n-skeleton text :repeat="1" round />
        </div>
      </div>

      <div class="flex my-4">
        <div class="w-1/6 font-bold">
          <n-skeleton text :repeat="1" :width="120" round />
        </div>
        <div class="w-5/6">
          <n-skeleton text :repeat="1" style="width: 30%" round />
        </div>
      </div>

      <div class="flex my-4">
        <div class="w-1/6 font-bold">
          <n-skeleton text :repeat="1" :width="120" round />
        </div>
        <div class="w-5/6">
          <n-skeleton text :repeat="1" round />
        </div>
      </div>
      <div class="flex my-4">
        <div class="w-1/6 font-bold">
          <n-skeleton text :repeat="1" :width="120" round />
        </div>
        <div class="w-5/6">
          <n-skeleton text :repeat="1" round />
        </div>
      </div>
      <div class="flex my-4">
        <div class="w-1/6 font-bold">
          <n-skeleton text :repeat="1" :width="120" round />
        </div>
        <div class="w-5/6">
          <n-skeleton text :repeat="1" round />
        </div>
      </div>
    </n-card>
  </div>
</template>
<style lang="scss">
.n-base-select-option__content {
  width: 100%;
}
.title-card {
  font-weight: 500;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  flex: 1;
  min-width: 0;
  color: rgb(31, 34, 37);
}
</style>
