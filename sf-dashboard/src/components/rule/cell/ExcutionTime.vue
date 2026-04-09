<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
</script>
<template>
  <div class="">
    <div class="">
      <table>
        <tbody>
          <tr>
            <td class="leading-snug">
              <span class="text-xs text-gray-400"><b>Created at: </b> </span>
              <span>{{
                props.params.data.created_at != '0001-01-01 at 00:00:00'
                  ? props.params.data.created_at?.replace('at', ' ')
                  : ''
              }}</span>
            </td>
          </tr>
          <tr>
            <td class="leading-none">
              <span class="text-xs text-gray-400"><b>Processed at: </b> </span>
              <span>{{
                props.params.data.processed_at != '0001-01-01 at 00:00:00'
                  ? props.params.data.processed_at?.replace('at', ' ')
                  : ''
              }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
