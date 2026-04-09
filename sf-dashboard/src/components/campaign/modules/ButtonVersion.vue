<script lang="ts" setup>
const switchVersions = ref(false)

const searchParams = new URLSearchParams(window.location.search)
switchVersions.value = searchParams.get('test') === 'true'

const toggleVersion = () => {
  switchVersions.value = !switchVersions.value
  const url = new URL(window.location.href)
  if (switchVersions.value) {
    url.searchParams.set('test', 'true')
  } else {
    url.searchParams.delete('test')
  }
  window.location.href = url.toString()
}
</script>
<template>
  <div>
    <n-button @click="toggleVersion" type="info">
      {{ switchVersions ? 'New Version' : 'Old Version' }}
    </n-button>
  </div>
</template>
