<template>
  <div class="text-xs w-32 font-bold text-gray-400">Macros</div>
  <div class="flex flex-col">
    <n-space size="small">
      <n-tag :bordered="false" type="info" size="small" class="n-tag-exclude">
        ${city}$
      </n-tag>
      <n-tag :bordered="false" type="info" size="small" class="n-tag-exclude">
        ${country}$
      </n-tag>
      <n-tag :bordered="false" type="info" size="small" class="n-tag-exclude">
        ${month}$
      </n-tag>
    </n-space>
  </div>
</template>
