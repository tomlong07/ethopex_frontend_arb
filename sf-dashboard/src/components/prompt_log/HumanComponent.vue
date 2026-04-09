<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import BaseInput from './BaseInput.vue'
import promptLogs from '@/store/promptLogs'
import Decision from './Decision.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
  },

  className: {
    type: String,
  },

  size: {
    type: String,
  },

  type: {
    type: String,
  },

  openDecision: {
    type: Boolean,
  },

  float: {
    type: Boolean,
  },
})

const promptLogStore = promptLogs()

const openModal = async (retryCount: number = 0) => {
  const params = props.params
  if (!params.colDef) return //component này dùng từ modal thì ko handle event này
  //Chỉ handle event này khi click ở table
  const { api, node, data } = params || {}

  if (!api || !node) {
    if (retryCount < 5) {
      // 🔁 thử lại tối đa 5 lần (500 ms tổng)
      console.warn(`⚠️ api/node not ready yet, retrying (${retryCount + 1})...`)

      await helper.sleep(100)
      openModal(retryCount + 1)
      return
    } else {
      console.error('❌ Failed to get api/node after multiple retries.')
      return
    }
  }

  // ✅ Khi đã có api và node
  promptLogStore.setDataLog(helper.clone(data))
  promptLogStore.callbackDeleteRow = () => removeThisRow(api, node)
  promptLogStore.callbackUpdateRow = (newData: any) =>
    updateThisRow(api, node, newData)
  promptLogStore.showModal = true
}

const removeThisRow = (api: any, node: any) => {
  api.applyTransaction({ remove: [node.data] })
}

const updateThisRow = (api: any, node: any, newData: any) => {
  node.setData({ ...node.data, ...newData })
}
const isDisabled = props.openDecision ? false : true
</script>

<template>
  <div
    class="py-2 flex flex-col"
    :class="props.size === 'medium' ? 'gap-4' : 'gap-2'"
    @dblclick="openModal(0)"
  >
    <slot></slot>
    <Decision
      name="Decision"
      v-model:value="props.params.data.human_decision"
      :disabled="isDisabled"
      :className="props.className"
      :size="props.size"
      :float="props.float"
    />

    <BaseInput
      name="Rule Violated"
      v-model:value="props.params.data.human_rule_violated"
      :className="props.className"
      :size="props.size"
      :float="props.float"
    />

    <BaseInput
      name="Explanation"
      v-model:value="props.params.data.human_explanation"
      :className="props.className"
      :size="props.size"
      :type="props.type"
      :float="props.float"
    />
  </div>
</template>
