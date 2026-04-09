<script setup lang="ts">
import { useRouter } from 'vue-router'

const props = defineProps<{
  tabData: Array<{ key: string; name: string }>
  activeTab: string
}>()
const router = useRouter()

const handleClick = (event: MouseEvent, key: string) => {
  if (event.ctrlKey || event.metaKey || event.button === 1) {
    return
  }
  event.preventDefault()
  router.push(key)
}
</script>

<template>
  <div class="m-2 w-90 custom-tabs">
    <nav class="custom-tabs-nav" role="tablist">
      <a
        v-for="item in props.tabData"
        :key="item.key"
        :href="item.key"
        class="custom-tabs-tab n-tabs-tab__label mb-2"
        :aria-current="props.activeTab === item.key ? 'true' : 'false'"
        :data-active="props.activeTab === item.key"
        rel="noopener noreferrer"
        role="tab"
        @click="handleClick($event, item.key)"
      >
        {{ item.name }}
      </a>
    </nav>
  </div>
</template>
<style scoped>
.custom-tabs-nav {
  display: flex;
  gap: 35px;
}

.custom-tabs-tab:hover {
  color: #2d5cc8 !important;
  background-color: transparent !important;
}

.custom-tabs-tab {
  padding: 6px 0 2px 0;
  color: #4b5563;
  position: relative;
  transition: color 120ms ease, background-color 120ms ease;
}

.custom-tabs-tab[data-active='true'] {
  color: #2d5cc8;
}

.custom-tabs-tab::after {
  content: '';
  height: 2px;
  position: absolute;
  left: 1px;
  right: 1px;
  bottom: -6px;
  transition: background 160ms ease;
}

.custom-tabs-tab[data-active='true']::after {
  background: #2d5cc8;
}
</style>
