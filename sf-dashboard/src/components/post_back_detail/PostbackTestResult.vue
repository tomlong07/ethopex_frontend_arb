<script setup lang="ts">
import { computed } from 'vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import usePostBack from '@/store/details/usePostBack'

const postBackStore = usePostBack()

const data = computed(() => postBackStore.dataTest)
</script>
<template>
  <FloatingWrapper v-if="data">
    <div class="postback-view">
      
      <div class="row">
        <span class="label">Event</span>
        <span class="value">{{ data.event }}</span>
      </div>

      <div class="row">
        <span class="label">Status</span>
        <span :class="['value', data.success ? 'success' : 'error']">
          {{ data.status }} ({{ data.status_code }})
        </span>
      </div>

      <div class="row">
        <span class="label">Method</span>
        <span class="value">{{ data.method }}</span>
      </div>

      <div class="row">
        <span class="label">Duration</span>
        <span class="value">{{ data.duration }} ms</span>
      </div>

      <div class="row">
        <span class="label">Postback URL ID</span>
        <span class="value">{{ data.postback_url_id }}</span>
      </div>

      <div class="row">
        <span class="label">Request URL</span>
      </div>
      <pre class="block">{{ data.url }}</pre>

      <details open>
        <summary>Response Body</summary>
        <pre class="block">{{ data.response_body }}</pre>
      </details>

      <details>
        <summary>Response Headers</summary>
        <pre class="block">{{ JSON.stringify(data.response_headers, null, 2) }}</pre>
      </details>
    </div>
  </FloatingWrapper>
</template>

<style scoped>
.postback-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
}

.row {
  display: flex;
  gap: 8px;
}

.label {
  width: 130px;
  font-weight: 600;
  color: #64748b;
}

.value {
  font-weight: 500;
}

.success {
  color: #16a34a;
}

.error {
  color: #dc2626;
}

.block {
  background: #0f172a;
  color: #e5e7eb;
  padding: 12px;
  border-radius: 6px;
  font-size: 12px;
  overflow: auto;
  max-height: 280px;
}
</style>