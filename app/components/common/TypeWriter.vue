<template>
  <span class="typewriter">{{ displayText }}</span>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  text: string
  speed?: number
}>()

const displayText = ref('')

onMounted(() => {
  let currentIndex = 0
  const interval = setInterval(() => {
    if (currentIndex <= props.text.length) {
      displayText.value = props.text.slice(0, currentIndex)
      currentIndex++
    } else {
      clearInterval(interval)
    }
  }, props.speed || 100)
})
</script>

<style scoped>
.typewriter {
  border-right: 2px solid currentColor;
  animation: blink 0.75s step-end infinite;
}

@keyframes blink {
  from, to { border-color: transparent }
  50% { border-color: currentColor; }
}
</style>
