<script setup lang="ts">
import Close2 from '@/assets/icons/Close2.vue'
import useCreativeModal from '@/store/useCreativeModal'
import CreativeDetail3 from '@/views/details/CreativeDetail3.vue'

const creativeMenuModal = useCreativeModal()

const offModal = () => {
  creativeMenuModal.changeShowModal(false)
}
</script>

<template>
  <div>
    <n-modal
      v-model:show="creativeMenuModal.showModal"
      class="overflow-auto"
      style="width: 95vw; height: 90vh"
    >
      <div>
        <n-card title="&nbsp;" :bordered="false">
          <template #header-extra>
            <n-icon
              @click="offModal"
              size="24"
              :component="Close2"
              class="button-close cursor-pointer"
          /></template>
        </n-card>
        <CreativeDetail3 :dataModal="creativeMenuModal.dataModal" />
      </div>
    </n-modal>
  </div>
</template>
