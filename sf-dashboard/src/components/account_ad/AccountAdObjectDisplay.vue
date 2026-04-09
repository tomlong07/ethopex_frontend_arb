<template>
  <div class="p-2 mb-2 w-full" v-if="!isEmpty()">
    <!-- Kiểm tra nếu là object -->
    <div v-if="isObject(data)">
      <ul>
        <li
          v-for="(value, key) in data"
          :key="key"
          class="mb-1 flex items-center"
        >
          <!-- Hiển thị key và value trên cùng một dòng với w-1/6 và w-5/6, giữ chiều rộng đồng đều -->
          <strong class="text-blue-600 w-1/6">{{ key }}:</strong>
          <!-- Đệ quy nếu value là object hoặc array với w-5/6 để giữ chiều rộng đồng nhất -->
          <ObjectDisplay v-if="isObject(value)" :data="value" class="w-5/6" />

          <n-input
            v-else-if="isArray(value)"
            :value="JSON.stringify(data[key])"
            class="w-5/6 p-1 text-sm bg-gray-100 border border-gray-300 rounded text-original"
            disabled
            placeholder="N/A"
            size="small"
          />
          <!-- Hiển thị n-input cho các giá trị không phải object/array -->
          <n-input
            v-else
            :value="String(data[key])"
            class="w-5/6 p-1 text-sm bg-gray-100 border border-gray-300 rounded text-original"
            disabled
            placeholder="N/A"
            size="small"
          />
        </li>
      </ul>
    </div>

    <!-- Kiểm tra nếu là array -->
    <div v-else-if="isArray(data)" class="ml-4">
      <strong class="text-green-600 mr-2">Array:</strong>
      <!-- Flex-wrap để array tự động xuống dòng khi quá dài -->
      <n-input
        :value="JSON.stringify(data)"
        class="w-5/6 p-1 text-sm bg-gray-100 border border-gray-300 rounded text-original"
        disabled
        placeholder="N/A"
        size="small"
      />
      <!-- <div class="inline-flex flex-wrap items-center w-full">
        <span
          v-for="(item, index) in data"
          :key="index"
          class="mr-1 mb-1 w-full"
        >
           Đệ quy cho item nếu là object hoặc array 
          <ObjectDisplay
            v-if="isObject(item) || isArray(item)"
            :data="item"
            class="w-5/6 p-1 text-sm bg-gray-100 border border-gray-300 rounded"
            disabled
          />
           Hiển thị giá trị nếu không phải object/array 
          <n-input
            v-else
            v-model:value="data[index]"
            class="w-5/6 p-1 text-sm bg-gray-100 border border-gray-300 rounded"
            placeholder="N/A"
            disabled
          />
        </span>
      </div> -->
    </div>
  </div>
</template>

<script>
// Import Naive UI components
import { NInput } from 'naive-ui'

export default {
  name: 'ObjectDisplay',
  props: {
    data: {
      type: [Object, Array],
      required: true,
    },
  },
  components: {
    NInput,
  },
  methods: {
    isObject(val) {
      return typeof val === 'object' && !Array.isArray(val) && val !== null
    },
    isArray(val) {
      return Array.isArray(val)
    },

    isEmpty() {
      return helper.isEmpty(this.data)
    },
  },
}
</script>
