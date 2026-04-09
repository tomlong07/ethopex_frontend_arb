<template>
  <div role="status" aria-label="Loading recommendation" class="w-full">
    <div class="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div class="px-4 py-2 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="h-4 w-4 rounded bg-gray-200"></div>
            <div class="h-4 w-28 rounded bg-gray-200"></div>
          </div>
          <div class="h-6 w-36 rounded-full bg-gray-200"></div>
        </div>
      </div>

      <div class="p-4">
        <div class="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <div class="h-12 w-12 rounded-md bg-gray-200"></div>

          <div class="min-w-0 space-y-2">
            <div class="h-4 w-40 max-w-full rounded bg-gray-200"></div>
            <div class="h-3 w-56 max-w-full rounded bg-gray-200"></div>
            <div class="h-3 w-32 max-w-full rounded bg-gray-200"></div>
          </div>

          <div class="h-9 w-28 rounded-full bg-gray-200"></div>
        </div>
      </div>
    </div>
  </div>
</template>
