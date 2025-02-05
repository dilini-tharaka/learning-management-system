<template>
    <div class="space-y-6">
        <!-- Question Number -->
        <div class="text-sm font-medium text-gray-500 dark:text-zinc-400">
            Question {{ currentNumber }} of {{ totalQuestions }}
        </div>

        <!-- Question Content -->
        <div class="space-y-4">
            <!-- Question Text -->
            <h2 class="text-xl font-medium text-gray-900 dark:text-zinc-100">
                {{ question.text }}
            </h2>

            <!-- Question Image (if any) -->
            <div v-if="question.image" class="rounded-lg overflow-hidden border border-gray-200 dark:border-zinc-700">
                <img :src="question.image" :alt="question.text" class="w-full h-auto max-h-96 object-cover">
            </div>

            <!-- Options -->
            <div class="space-y-3">
                <button
                    v-for="option in question.options"
                    :key="option.id"
                    @click="selectOption(option.id)"
                    :class="[
                        'w-full text-left px-4 py-3 rounded-lg border',
                        selectedOption === option.id
                            ? 'bg-blue-50 border-blue-500 dark:bg-blue-900/30 dark:border-blue-400'
                            : 'bg-white border-gray-200 hover:border-gray-300 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:border-zinc-600'
                    ]"
                >
                    <div class="flex items-center space-x-3">
                        <div :class="[
                            'flex-shrink-0 w-5 h-5 border rounded-full flex items-center justify-center',
                            selectedOption === option.id
                                ? 'border-blue-500 dark:border-blue-400'
                                : 'border-gray-300 dark:border-zinc-600'
                        ]">
                            <div v-if="selectedOption === option.id" 
                                class="w-2.5 h-2.5 rounded-full bg-blue-500 dark:bg-blue-400">
                            </div>
                        </div>
                        <span :class="[
                            'text-sm',
                            selectedOption === option.id
                                ? 'text-blue-700 dark:text-blue-300'
                                : 'text-gray-700 dark:text-zinc-300'
                        ]">
                            {{ option.text }}
                        </span>
                    </div>
                </button>
            </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center justify-between pt-6">
            <button
                @click="$emit('previous')"
                :disabled="currentNumber === 1"
                :class="[
                    'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium',
                    currentNumber === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600'
                        : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                ]"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                </svg>
                Previous
            </button>

            <button
                @click="$emit('next')"
                :disabled="!selectedOption"
                :class="[
                    'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium',
                    !selectedOption
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500'
                ]"
            >
                {{ isLastQuestion ? 'Submit Quiz' : 'Next Question' }}
                <svg v-if="!isLastQuestion" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    question: {
        type: Object,
        required: true
    },
    currentNumber: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    savedAnswer: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['previous', 'next', 'answer'])

// Initialize selectedOption with savedAnswer if it exists
const selectedOption = ref(props.savedAnswer)

// Watch for question changes to update selectedOption
watch(() => props.question, () => {
    selectedOption.value = props.savedAnswer
}, { immediate: true })

// Watch for savedAnswer changes
watch(() => props.savedAnswer, (newValue) => {
    selectedOption.value = newValue
})

const isLastQuestion = computed(() => {
    return props.currentNumber === props.totalQuestions
})

const selectOption = (optionId) => {
    selectedOption.value = optionId
    emit('answer', optionId)
}
</script>