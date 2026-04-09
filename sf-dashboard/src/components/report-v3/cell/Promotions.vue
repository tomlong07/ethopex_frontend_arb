<script setup lang="ts">
import { NPopover, NIcon } from 'naive-ui'
import Redeem from '@/assets/icons/Redeem.vue'

// props
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  special: {
    type: Boolean,
    default: true,
  },
})

const color = computed(() => {
  switch (props.data?.promotion_status) {
    case 'Active':
      return '#18a058'
    case 'Credit expired':
    case 'Expired':
      return 'black'
    case 'Redeemed: Complete further requirements':
      return 'rgb(96, 165, 250)'
    case 'Processing':
      return 'rgb(59 130 246)'
  }

  return 'gray'
})

const formatCurrency = (value: number) => {
  if (props.data?.spent_percent) return '$500' //Nếu đã có khuyến mãi thì đoạn tiêu để km là $500
  return value ? `$${helper.formatNumberV2(value)}` : '$0'
}
</script>

<template>
  <div class="flex items-center">
    <n-popover trigger="hover" v-if="special" :show-arrow="false">
      <template #trigger>
        <n-icon :component="Redeem" size="22" :color="color" />
      </template>

      <div class="text-sm space-y-1">
        <div>
          Date redeemed:
          <b>{{ props.data?.redemption }}</b>
        </div>
        <div>
          Qualification (Expiration dates):
          <b>{{ props.data?.criteria }}</b>
        </div>
        <div>
          Spend (Expiration dates):
          <b>{{ props.data?.consumption }}</b>
        </div>
        <div>
          Promotional spend progress:
          <b>
            {{ formatCurrency(props.data?.amount_spent_for_promotion) }} / $500
          </b>
        </div>
        <div>
          Spend From Promotion:
          <b>{{ props.data?.spent_percent }}% </b>
          ({{ formatCurrency(props.data?.spent_amount) }})
        </div>
        <div>
          Promotion Status:
          <b :style="{ color: color }">{{ props.data?.promotion_status }} </b>
        </div>
      </div>
    </n-popover>
  </div>
</template>
