<script setup lang="ts">
import DropCustom from '@/components/common/DropCustom.vue'
import useByDimensionStore from '@/store/useByDimensionStore'

const byDimensionStore = useByDimensionStore()
const dropRef = ref<InstanceType<typeof DropCustom> | null>(null)

const updateOrder = (value: string) => {
  byDimensionStore.changeOrderBy(value)
}

watch(
  () => byDimensionStore.resetOrderBySignal,
  () => {
    dropRef.value?.changeValueNow(byDimensionStore.resetOrderBySignal)
  }
)
</script>

<template>
  <DropCustom
    class="w-32"
    name="Order By"
    size="small"
    title="Select Order By"
    disabled
    :defaultValue="(byDimensionStore.fixedOrder[0].value as any)"
    :valueOptions="byDimensionStore.fixedOrder"
    @updateValue="updateOrder"
    v-if="byDimensionStore.fixedOrder?.length"
  />

  <DropCustom
    class="w-32"
    name="Order By"
    size="small"
    title="Select Order By"
    :defaultValue="byDimensionStore.orderBy"
    :valueOptions="byDimensionStore.orderOptions"
    @updateValue="updateOrder"
    ref="dropRef"
    v-else
  />
</template>
