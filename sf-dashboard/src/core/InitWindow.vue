<script setup lang="ts">
import { useMessage } from 'naive-ui'
import { useRouter, useRoute } from 'vue-router'

//Global để sử dụng ở bất kỳ component nào
window.message = useMessage()
window.router = useRouter()
window.route = useRoute()
</script>
<template></template>
