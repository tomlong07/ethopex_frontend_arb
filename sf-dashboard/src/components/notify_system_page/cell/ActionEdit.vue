<script setup lang="ts">
import { ICellRendererParams } from "ag-grid-community";
import Settings20Regular from "@/assets/icons/Settings20Regular.vue";
import { useRouter } from "vue-router";

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
});
const router = useRouter();
const getId = computed(() => props.params.data?.id);

const navigatePageEdit = () => {
  const id = getId.value;
  if (id) {
    router.push(`/notify-page/edit/${id}`);
  }
};
</script>
<template>
  <div class="flex w-full h-full items-center">
    <button>
      <n-icon
        size="35"
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        title="Edit"
        :component="Settings20Regular"
        @click="navigatePageEdit"
      />
    </button>
  </div>
</template>
