<script setup lang="ts">
import { creativeTypeClass } from '@/types/components/creative-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },
})

const MAX_CHARACTERS = 34

const countCharacters = computed(() => {
  return helper.countCharactersV2(props.cre.titles[0].title || '')
})

const name = 'Headline'
</script>

<template>
  <FloatingWrapper
    name="Headline"
    small
    rounded
    v-if="props.cre.IsSnapchat() && props.cre.titles"
  >
    <div>
      <div class="flex flex-row gap-2">
        <n-input v-model:value="cre.titles[0].title" :placeholder="name">
          <template #suffix
            ><span>{{ countCharacters }}/{{ MAX_CHARACTERS }}</span>
          </template>
        </n-input>
      </div>
      <span
        class="text-red-500 ml-4 text-xxs font-medium text-error-noti absolute"
        >{{ countCharacters > MAX_CHARACTERS ? 'Value too long' : '' }}</span
      >
    </div></FloatingWrapper
  >
</template>
