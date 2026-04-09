<script setup lang="ts">
import Minus from '@/assets/icons/Minus.vue'
import PlusLg from '@/assets/icons/PlusLg.vue'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import {
  _registerSection,
  useCollapsePersist,
} from '@/composables/useCollapsePersist'
import { useRoute } from 'vue-router'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  header: {
    type: String,
    required: true,
  },
  popover: {
    type: String,
    required: false,
  },
})

const route = useRoute()
const keyRef = computed(() => {
  const cleaned = route.path
    .replace(/\/\d+(?=\/|$)/g, '')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '')
    .replace(/^((?:\/[^/]+){1})\/.*$/, '$1')
  return `collapse::${cleaned}`
})
const storageKey = keyRef.value

onMounted(() => {
  _registerSection(storageKey, props.name)
})

const { expandedNames, isExpanded, setExpanded } = useCollapsePersist(keyRef, [
  props.name,
])

const expandedModel = computed<string[]>({
  get: () => expandedNames.value,
  set: (next) => {
    const wantOpen = next.includes(props.name)
    const cur = new Set(expandedNames.value)
    if (wantOpen) cur.add(props.name)
    else cur.delete(props.name)
    setExpanded(Array.from(cur))
  },
})

const isOpen = computed(() => isExpanded(props.name))
const hasPopover = computed(() => (props.popover?.length ?? 0) > 0)
</script>

<template>
  <n-collapse
    v-model:expanded-names="expandedModel"
    :arrow-placement="'right'"
    class="rounded-md border border-gray2 overflow-hidden"
  >
    <n-collapse-item :name="name">
      <template #header>
        <div class="font-medium">
          {{ header }}
          <n-popover trigger="hover" v-if="hasPopover">
            <template #trigger>
              <n-button text>
                <n-icon :component="QuestionCircleRegular"></n-icon>
              </n-button>
            </template>
            <span>{{ popover }}</span>
          </n-popover>
        </div>
      </template>
      <template #header-extra>
        <n-icon :component="isOpen ? Minus : PlusLg" size="20" />
      </template>
      <n-card class="card-flex-gap-4 rounded-[5px] !border-gray2">
        <slot />
      </n-card>
    </n-collapse-item>
  </n-collapse>
</template>

<style scoped>
:deep(.n-card.n-card--bordered) {
  border: none;
}
:deep(.n-collapse-item__header-main) {
  padding: 15px;
  font-size: 17px;
}
:deep(.n-collapse-item__content-inner) {
  padding: 0px !important;
}
:deep(.n-collapse-item-arrow) {
  display: none !important;
}
:deep(.n-collapse-item__header-extra) {
  margin-right: 20px;
}
:deep(.n-collapse-item__header:hover) {
  background-color: #e4e4e4;
}
</style>
