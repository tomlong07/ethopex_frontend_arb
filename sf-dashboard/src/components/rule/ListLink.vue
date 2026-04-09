<script setup lang="ts">
import Minus from '@/assets/icons/Minus.vue'
import Plus from '@/assets/icons/Plus.vue'

const props = defineProps({
  rule: {
    type: Object,
    required: true,
  },
})

const addLink = () => {
  props.rule.add_campaign.list_link.push('')
}

const removeLink = (index: number) => {
  props.rule.add_campaign.list_link.splice(index, 1)
}
</script>

<template>
  <n-card title="List Link">
    <div
      v-for="(item, index) in props.rule.add_campaign.list_link"
      :key="index"
      class="py-2"
    >
      <div class="flex flex-row gap-2">
        <n-input v-model:value="props.rule.add_campaign.list_link[index]" />

        <n-button
          @click="removeLink(index)"
          :disabled="props.rule.add_campaign.list_link.length <= 1"
          ><n-icon size="12"><Minus /></n-icon
        ></n-button>

        <n-button @click="addLink"
          ><n-icon size="12" class="cursor-pointer"><Plus /></n-icon
        ></n-button>
      </div>
    </div>
  </n-card>
</template>
