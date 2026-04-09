<template>
  <div
    class="absolute bottom-0 w-full h-6 footer-clock flex justify-center items-center"
  >
    <div class="clock-text text-xs">{{ formattedDateTime }}</div>
  </div>
</template>

<script setup>
const timeZone = ref('UTC')
const formattedDateTime = ref('')

const updateDateTime = () => {
  const now = new Date()

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: timeZone.value,
    timeZoneName: 'short',
  }

  const formatter = new Intl.DateTimeFormat('en-US', options)
  formattedDateTime.value = formatter.format(now)
}

onMounted(() => {
  updateDateTime()
  setInterval(updateDateTime, 1000)
})
</script>

<style scoped>
.footer-clock {
  display: flex;
  justify-content: center;
  align-items: center;

  background-image: linear-gradient(0deg, white 50%, #eaeded 100%);
}
.clock-text {
  font-family: 'Roboto', sans-serif;
  font-weight: bold;
  color: #666;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 1.5px;
  transition: color 0.3s ease;
}

.clock-text:hover {
  color: #007bff;
}
</style>
