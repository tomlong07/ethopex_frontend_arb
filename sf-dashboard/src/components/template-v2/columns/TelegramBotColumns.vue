<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import StatusTelegram from '@/components/telegram_bot/cell/StatusTelegram.vue'
import TelegramBotAction from '@/components/telegram_bot/cell/TelegramBotAction.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'status':
      return StatusTelegram
    case 'actions':
      return TelegramBotAction
  }
  return
}
</script>
<template></template>
