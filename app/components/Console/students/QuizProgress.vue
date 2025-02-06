<template>
    <div class="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 p-4">
        <div class="space-y-4">
            <!-- Progress Header -->
            <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-700 dark:text-zinc-300">Question Progress</h3>
                <span class="text-sm text-gray-500 dark:text-zinc-400">
                    {{ answeredQuestions.length }}/{{ totalQuestions }} Answered
                </span>
            </div>

            <!-- Progress Bar -->
            <div class="w-full bg-gray-200 dark:bg-zinc-700 rounded-full h-2.5">
                <div 
                    class="bg-blue-500 dark:bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    :style="{ width: `${(answeredQuestions.length / totalQuestions) * 100}%` }"
                ></div>
            </div>

            <!-- Question Grid -->
            <div class="grid grid-cols-5 gap-2">
                <button
                    v-for="index in totalQuestions"
                    :key="index"
                    @click="$emit('jump', index)"
                    :class="[
                        'p-2 rounded-lg text-sm font-medium transition-colors duration-200',
                        getQuestionButtonClass(index)
                    ]"
                >
                    {{ index }}
                </button>
            </div>

            <!-- Legend -->
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-zinc-400 pt-2">
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full bg-blue-500 dark:bg-blue-600"></div>
                    <span>Answered</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full bg-gray-200 dark:bg-zinc-700"></div>
                    <span>Unanswered</span>
                </div>
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500 dark:border-blue-400"></div>
                    <span>Current</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    currentQuestion: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    answeredQuestions: {
        type: Array,
        required: true
    }
})

defineEmits(['jump'])

const getQuestionButtonClass = (index) => {
    const isAnswered = props.answeredQuestions.includes(index)
    const isCurrent = props.currentQuestion === index

    if (isCurrent) {
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-2 border-blue-500 dark:border-blue-400'
    }
    if (isAnswered) {
        return 'bg-blue-500 dark:bg-blue-600 text-white'
    }
    return 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-300 dark:hover:bg-zinc-600'
}
</script>