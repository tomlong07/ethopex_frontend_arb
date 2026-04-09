<script setup lang="ts">
import Close from '@/assets/icons/Close.vue'

import Checkmark2 from '@/assets/icons/Checkmark2.vue'
import { ctr_google_targeting } from '@/services/ctr_google_targeting'

const props = defineProps({
  referer: {
    type: String,
    required: true,
  },
  whiteListType: {
    type: String,
    default: '',
  },
})

const typeWhiteList = ref(props.whiteListType)

const color = computed(() => {
  switch (typeWhiteList.value) {
    case '':
      return 'secondary'

    case 'whitelist':
      return 'success'

    default:
      return 'danger'
  }
})

const text = computed(() => {
  switch (typeWhiteList.value) {
    case '':
      return 'Unknown'

    case 'whitelist':
      return 'Yes'

    default:
      return 'No'
  }
})

const toggleStatus = async (type: string) => {
  const ok = await addGoogleTargeting(type)
  if (!ok) return
  typeWhiteList.value = type
}

const addGoogleTargeting = async (type: string) => {
  if (!type) return

  if (!props.referer) {
    window.message.error('Section referer is missing')
    return
  }

  const confirm = window.confirm(
    `Are you sure you want to add ${props.referer} to ${type}?`
  )

  if (!confirm) return

  const result = await ctr_google_targeting.Add({
    type: type,
    domains: [props.referer],
    data_source: 'manual',
  })

  if (!result.status) return

  window.message.success(`Submit ${type} successfully!`)
  return true
}
</script>

<template>
  <span class="flex align-items-center white-list-wrapper">
    <span class="badge w-16 text-center" :class="`badge-${color}`">{{
      text
    }}</span>

    <span
      v-if="referer"
      title="White List"
      class="ml-2 whitelist-element-action"
      @click="toggleStatus('whitelist')"
    >
      <Checkmark2 />
    </span>

    <span
      v-if="referer"
      title="Black List"
      class="ml-2 blacklist-element-action"
      @click="toggleStatus('blacklist')"
    >
      <Close />
    </span>
  </span>
</template>
