<template>
  <div>
    <button @click="toggleTheme" style="margin-bottom: 1rem;">
      Toggle Theme (Hiện tại: {{ isDarkMode ? 'Dark' : 'Light' }})
    </button>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onMounted, watch, computed } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')

const isDarkMode = computed(() => theme.value === 'dark')

const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') as Theme | null
  const initialTheme = savedTheme || 'light'
  theme.value = initialTheme

  if (initialTheme === 'dark') {
    document.documentElement.classList.add('dark')
  }
})

watch(theme, (newTheme) => {
  localStorage.setItem('theme', newTheme)

  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})

provide('theme', {
  isDarkMode,
  toggleTheme,
})
</script>

<script lang="ts">
import { inject } from 'vue'

export function useTheme() {
  const theme = inject('theme')
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return theme
}
</script>

<style>


.dark * {
  background-color: #101828 !important;
  color: white;
}

</style>
