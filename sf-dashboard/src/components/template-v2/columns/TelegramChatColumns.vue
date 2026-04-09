<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import StatusTelegram from '@/components/telegram_bot/cell/StatusTelegram.vue'
import TelegramChatAction from '@/components/telegram_bot/cell/TelegramChatAction.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'status':
      return StatusTelegram
    case 'actions':
      return TelegramChatAction
  }
  return
}
</script>
<template></template>
