<script setup lang="ts">
import { ICellRendererParams } from "ag-grid-community";
import Close from "@/assets/icons/Close.vue";
import Checkmark from "@/assets/icons/Checkmark.vue";
import ctr_notify_system from "@/services/ctr_notify_system";

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
});

const status = ref(props.params.data.status || "off");
const isLoading = ref(false);

const changeStatus = async () => {
  const id = props.params.data.id;
  if (!id) return;

  const newStatus = status.value === "on" ? "off" : "on";

  const message = `Are you sure you want to change status to ${newStatus}?`;
  if (!window.confirm(message)) return;

  isLoading.value = true;
  const loading = window.message.loading("Changing is on process. Please wait!");

  const result = await ctr_notify_system.ChangeStatus({
    ids: [id],
    status: newStatus,
  });

  if (result?.status) {
    status.value = newStatus;
    window.message.success("Status updated successfully");
  }

  loading.destroy();

  isLoading.value = false;
};
</script>
<template>
  <div class="flex h-full items-center">
    <n-switch
      v-model:value="status"
      checked-value="on"
      unchecked-value="off"
      class="mr-2"
      :on-update:value="changeStatus"
      :loading="isLoading"
    >
      <template #checked-icon>
        <n-icon :component="Checkmark" color="#121212" />
      </template>
      <template #unchecked-icon>
        <n-icon :component="Close" />
      </template>
    </n-switch>
  </div>
</template>
