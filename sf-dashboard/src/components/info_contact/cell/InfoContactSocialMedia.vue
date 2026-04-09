<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
    required: false,
  },
})

// Hàm kiểm tra số điện thoại
const isPhoneNumber = (value: string) => {
  return /^[\d+]/.test(value)
}

// Tạo link WhatsApp
const getWhatsAppLink = (phone: string) =>
  `whatsapp://send?phone=${phone.replace(/^0/, '').replace(/\+/, '')}`

// Tạo link Telegram app
const getTelegramLink = (username: string) => 
  `tg://resolve?domain=${username.replace(/^@/, '')}`

const handleClick = (value: string) => {
  if (isPhoneNumber(value)) {
    window.open(getWhatsAppLink(value), '_blank')
  } else {
    window.open(getTelegramLink(value), '_blank')
  }
}
</script>

<template>
  <div 
    class="cursor-pointer truncate"
    @click="handleClick(props.params.data?.telegram_whatsapp)">
      {{ props.params.data?.telegram_whatsapp }}
  </div>
</template>
