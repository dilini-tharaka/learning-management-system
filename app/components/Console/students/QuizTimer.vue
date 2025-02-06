<template>
    <div class="fixed top-0 left-0 w-full bg-white dark:bg-zinc-900 shadow-sm border-b border-gray-200 dark:border-zinc-800 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div class="flex items-center justify-between">
                <!-- Back Button -->
                <button 
                    @click="navigateBack"
                    class="inline-flex items-center text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-100"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                    </svg>
                    Back to Quizzes
                </button>

                <!-- Timer -->
                <div class="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600 dark:text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                    </svg>
                    <span class="text-lg font-medium text-gray-900 dark:text-zinc-100">
                        {{ formatTime }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
    duration: {
        type: Number,
        required: true
    },
    onTimeUp: {
        type: Function,
        required: true
    }
})

const timeLeft = ref(props.duration)
let timer

const formatTime = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60)
    const seconds = timeLeft.value % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const startTimer = () => {
    timer = setInterval(() => {
        if (timeLeft.value > 0) {
            timeLeft.value--
        } else {
            clearInterval(timer)
            props.onTimeUp()
        }
    }, 1000)
}

const navigateBack = () => {
    if (confirm('Are you sure you want to leave? Your progress will be lost.')) {
        clearInterval(timer)
        router.push('/console/quizzes')
    }
}

onMounted(() => {
    startTimer()
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
})
</script>