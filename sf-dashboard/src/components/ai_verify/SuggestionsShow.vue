<script lang="ts" setup>
import {
  creativeTypeClass,
  StatusCreativeManager,
} from '@/types/components/creative-v2'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },
})
</script>

<template>
  <div v-if="props.cre.ai_verify?.contents_show?.length">
    <n-table :single-line="false" striped class="table-fixed">
      <thead>
        <tr>
          <th class="w-[calc((100%-6rem)/2)]">Content</th>
          <th class="w-24">Compliant</th>
          <th class="w-[calc((100%-6rem)/2)]">Explanation</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in props.cre.ai_verify?.contents_show"
          :key="index"
        >
          <td class="w-[calc((100%-6rem)/2)]">{{ item?.content }}</td>
          <td class="w-24">
            {{ item.compliance_status }}
          </td>

          <td class="w-[calc((100%-6rem)/2)]">{{ item?.explanation }}</td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>
