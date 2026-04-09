<script setup lang="ts"></script>
<template>
  <div id="app"></div>
  <div class="container mx-auto">
    <div class="p-3 mt-2 mx-auto w-full md:max-w-4xl">
      <n-card>
        <div class="title-card">
          <n-skeleton :width="120" round size="medium" />
        </div>
        <n-form size="large" label-width="auto">
          <div class="my-2">
            <div class="w-full mb-4 font-bold">
              <n-skeleton text :repeat="1" round />
            </div>
            <div class="w-full macro">
              <n-form-item path="keyword">
                <n-skeleton text :repeat="1" round />
              </n-form-item>
            </div>
          </div>
          <n-divider dashed> </n-divider>
          <div class="my-2">
            <div class="w-full mb-3 font-bold">
              <n-skeleton text :repeat="1" :width="300" round />
            </div>
            <div class="w-full macro">
              <n-skeleton text :repeat="2" round />
            </div>
          </div>
        </n-form>
      </n-card>
    </div>
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
