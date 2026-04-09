<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import useRoleStore from '@/store/useRoleStore'

const roleStore = useRoleStore()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

//Lấy options để map get ra tên
const label = computed<string[]>(() => {
  let result: string[] = []
  props.params.data.account_demand.forEach((element: string) => {
    const i = roleStore.accountDemandOptions.find(
      (item) => item.key === element
    )

    if (i) {
      result.push(String(i.value))
    } else {
      result.push(element)
    }
  })

  return result
})
</script>
<template>
  <div class="flex w-full h-full items-center">
    {{ label.toString() }}
  </div>
</template>
