<template>
  <div
    class="bg-white p-4 rounded shadow max-h-[800px] overflow-auto text-base leading-relaxed text-gray-900 mt-4"
  >
    <h2 class="text-xl font-bold mb-4 text-gray-800">Logs</h2>

    <div v-if="domainConfig.dataConfig.logs_domain_config?.length">
      <table
        class="min-w-full border border-gray-300 rounded overflow-hidden text-left"
      >
        <thead class="bg-gray-100 text-gray-700">
          <tr>
            <th class="py-2 px-4 border-b border-gray-300">Date</th>
            <th class="py-2 px-4 border-b border-gray-300">Time</th>
            <th class="py-2 px-4 border-b border-gray-300">Log Message</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(log, index) in formattedLogs"
            :key="index"
            class="hover:bg-gray-50 transition"
          >
            <td class="py-2 px-4 border-b border-gray-200">{{ log.date }}</td>
            <td class="py-2 px-4 border-b border-gray-200">{{ log.time }}</td>
            <td
              class="py-2 px-4 border-b border-gray-200 break-words whitespace-pre-wrap max-w-[600px]"
            >
              {{ log.message }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-gray-400 italic">No logs available.</div>
  </div>
</template>

<script setup lang="ts">
import useDomainConfigStore from '@/store/details/useDomainConfigStore'
import { Log } from '@/types/components/domain_config'
const domainConfig = useDomainConfigStore()

const formattedLogs = computed(() => {
  const logs: Log[] = domainConfig.dataConfig.logs_domain_config || []
  return logs.map((log) => {
    const dateObj = new Date(log.created_at)

    const day = dateObj.getDate().toString().padStart(2, '0')
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
    const year = dateObj.getFullYear()

    const hours = dateObj.getHours().toString().padStart(2, '0')
    const minutes = dateObj.getMinutes().toString().padStart(2, '0')
    const seconds = dateObj.getSeconds().toString().padStart(2, '0')

    return {
      date: `${day}/${month}/${year}`,
      time: `${hours}:${minutes}:${seconds} (UTC+7)`,
      message: log.log,
    }
  })
})
</script>
