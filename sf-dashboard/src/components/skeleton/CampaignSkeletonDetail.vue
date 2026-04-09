<script setup lang="ts"></script>
<template>
  <n-grid class="mt-12" x-gap="12" :cols="2">
    <n-gi>
      <n-card class="mb-4">
        <div class="title-card">
          <n-skeleton :width="120" :sharp="false" size="medium" />
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">
            <n-skeleton text :repeat="1" :width="120" round />
          </div>
          <div class="w-3/4"><n-skeleton text :repeat="1" round /></div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">
            <n-skeleton text :repeat="1" :width="120" round />
          </div>
          <div class="w-3/4">
            <n-skeleton text :repeat="1" style="width: 30%" round />
          </div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">
            <n-skeleton text :repeat="1" :width="120" round />
          </div>
          <div class="w-3/4"><n-skeleton text :repeat="1" round /></div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">
            <n-skeleton text :repeat="1" :width="120" round />
          </div>
          <div class="w-3/4">
            <n-skeleton text :repeat="1" round />
          </div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">
            <n-skeleton text :repeat="1" :width="120" round />
          </div>
          <div class="w-3/4"><n-skeleton text :repeat="1" round /></div>
        </div>
      </n-card>

      <n-card class="mb-4 relative">
        <div class="title-card">
          <n-skeleton :width="120" :sharp="false" size="medium" />
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">
            <n-skeleton text :repeat="1" :width="120" round />
          </div>
          <div class="w-3/4"><n-skeleton text :repeat="1" round /></div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">
            <n-skeleton text :repeat="1" :width="120" round />
          </div>
          <div class="w-3/4">
            <n-skeleton text :repeat="1" round />
          </div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">
            <n-skeleton text :repeat="1" :width="120" round />
          </div>
          <div class="w-3/4">
            <n-skeleton text :repeat="1" style="width: 30%" round />
          </div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">
            <n-skeleton text :repeat="1" :width="120" round />
          </div>
          <div class="w-3/4"><n-skeleton text :repeat="1" round /></div>
        </div>
      </n-card>

      <n-card class="mb-4">
        <div class="title-card">
          <n-skeleton :width="120" :sharp="false" size="medium" />
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">
            <n-skeleton text :repeat="1" :width="120" round />
          </div>
          <div class="w-3/4"><n-skeleton text :repeat="1" round /></div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">
            <n-skeleton text :repeat="1" :width="120" round />
          </div>
          <div class="w-3/4"><n-skeleton text :repeat="1" round /></div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">
            <n-skeleton text :repeat="1" :width="120" round />
          </div>
          <div class="w-3/4"><n-skeleton text :repeat="1" round /></div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">
            <n-skeleton text :repeat="1" :width="120" round />
          </div>
          <div class="w-3/4 flex items-center">
            <n-skeleton text :repeat="1" round />
          </div>
        </div>
        <div class="flex items-center my-4">
          <div class="w-1/4 font-bold">
            <n-skeleton text :repeat="1" :width="120" round />
          </div>
          <div class="w-3/4 flex items-center">
            <n-skeleton text :repeat="1" round style="width: 60%" />
          </div>
        </div>
      </n-card>
    </n-gi>
    <n-gi>
      <n-card class="mb-4">
        <div class="title-card">
          <n-skeleton :width="120" :sharp="false" size="medium" />
        </div>
        <div class="flex flex-col my-4">
          <n-skeleton text :repeat="1" round />
        </div>
      </n-card>
    </n-gi>
  </n-grid>
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
